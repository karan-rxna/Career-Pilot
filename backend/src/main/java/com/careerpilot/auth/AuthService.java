package com.careerpilot.auth;

import com.careerpilot.auth.dto.AuthResponse;
import com.careerpilot.auth.dto.ForgotRequest;
import com.careerpilot.auth.dto.LoginRequest;
import com.careerpilot.auth.dto.RegisterRequest;
import com.careerpilot.auth.dto.ResetRequest;
import com.careerpilot.common.ConflictException;
import com.careerpilot.common.Tokens;
import com.careerpilot.common.UnauthorizedException;
import com.careerpilot.config.AuthProperties;
import com.careerpilot.config.JwtProperties;
import com.careerpilot.user.Role;
import com.careerpilot.user.User;
import com.careerpilot.user.UserRepository;
import com.careerpilot.user.dto.UserResponse;
import java.time.Instant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);
    private static final String BAD_CREDENTIALS = "Invalid email or password";
    private static final String DEAD_SESSION = "Your session expired — please sign in again";

    private final UserRepository users;
    private final RefreshTokenRepository refreshTokens;
    private final PasswordResetTokenRepository resetTokens;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final JwtProperties jwtProperties;
    private final AuthProperties authProperties;

    public AuthService(UserRepository users,
                       RefreshTokenRepository refreshTokens,
                       PasswordResetTokenRepository resetTokens,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       JwtProperties jwtProperties,
                       AuthProperties authProperties) {
        this.users = users;
        this.refreshTokens = refreshTokens;
        this.resetTokens = resetTokens;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.jwtProperties = jwtProperties;
        this.authProperties = authProperties;
    }

    @Transactional
    public AuthResult register(RegisterRequest request, String userAgent) {
        String email = request.email().trim().toLowerCase();
        if (users.existsByEmailIgnoreCase(email)) {
            throw new ConflictException("An account with that email already exists");
        }
        User user = new User(email, passwordEncoder.encode(request.password()), request.name().trim());
        user.setHandle("@" + email.substring(0, email.indexOf('@')));
        user.setRole(Role.USER);
        if (request.college() != null && !request.college().isBlank()) {
            user.setCollege(request.college().trim());
        }
        return openSession(users.save(user), userAgent);
    }

    @Transactional
    public AuthResult login(LoginRequest request, String userAgent) {
        User user = users.findByEmailIgnoreCase(request.email().trim())
                .orElseThrow(() -> new UnauthorizedException(BAD_CREDENTIALS));
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new UnauthorizedException(BAD_CREDENTIALS);
        }
        return openSession(user, userAgent);
    }

    /** Rotation: the presented token is revoked and a fresh one is issued in the same call. */
    @Transactional
    public AuthResult refresh(String rawRefreshToken, String userAgent) {
        if (rawRefreshToken == null || rawRefreshToken.isBlank()) {
            throw new UnauthorizedException(DEAD_SESSION);
        }
        RefreshToken stored = refreshTokens.findByTokenHash(Tokens.sha256(rawRefreshToken))
                .filter(RefreshToken::isActive)
                .orElseThrow(() -> new UnauthorizedException(DEAD_SESSION));
        User user = users.findById(stored.getUserId())
                .orElseThrow(() -> new UnauthorizedException(DEAD_SESSION));
        stored.revoke();
        return openSession(user, userAgent);
    }

    @Transactional
    public void logout(String rawRefreshToken) {
        if (rawRefreshToken == null || rawRefreshToken.isBlank()) {
            return;
        }
        refreshTokens.findByTokenHash(Tokens.sha256(rawRefreshToken)).ifPresent(RefreshToken::revoke);
    }

    /**
     * Always succeeds for the caller (no account enumeration). Returns the raw token for a local
     * delivery channel: it is logged in dev, and becomes an email through Resend/SMTP in production.
     */
    @Transactional
    public String forgotPassword(ForgotRequest request) {
        return users.findByEmailIgnoreCase(request.email().trim())
                .map(user -> {
                    String raw = Tokens.random();
                    resetTokens.save(new PasswordResetToken(
                            user.getId(), Tokens.sha256(raw), Instant.now().plus(authProperties.resetTokenTtl())));
                    if (!authProperties.cookieSecure()) {
                        log.info("Password reset link (dev): /auth/reset?token={}", raw);
                    }
                    return raw;
                })
                .orElse(null);
    }

    @Transactional
    public void resetPassword(ResetRequest request) {
        PasswordResetToken token = resetTokens.findByTokenHash(Tokens.sha256(request.token()))
                .filter(PasswordResetToken::isUsable)
                .orElseThrow(() -> new UnauthorizedException("This reset link is invalid or has expired"));
        User user = users.findById(token.getUserId())
                .orElseThrow(() -> new UnauthorizedException("This reset link is invalid or has expired"));
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        token.markUsed();
        // a password change kills every existing session
        refreshTokens.revokeAllForUser(user.getId(), Instant.now());
    }

    private AuthResult openSession(User user, String userAgent) {
        String rawRefresh = Tokens.random();
        refreshTokens.save(new RefreshToken(
                user.getId(),
                Tokens.sha256(rawRefresh),
                userAgent,
                Instant.now().plus(jwtProperties.refreshTokenTtl())));

        JwtService.IssuedAccessToken access = jwtService.issueAccessToken(user);
        return new AuthResult(
                new AuthResponse(access.token(), access.expiresInSeconds(), UserResponse.from(user)),
                rawRefresh);
    }

    /** The raw refresh token is deliberately kept out of the response body — it goes in a cookie. */
    public record AuthResult(AuthResponse response, String refreshToken) {
    }
}
