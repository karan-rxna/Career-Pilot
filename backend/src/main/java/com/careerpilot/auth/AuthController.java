package com.careerpilot.auth;

import com.careerpilot.auth.dto.AuthResponse;
import com.careerpilot.auth.dto.ForgotRequest;
import com.careerpilot.auth.dto.LoginRequest;
import com.careerpilot.auth.dto.RefreshResponse;
import com.careerpilot.auth.dto.RegisterRequest;
import com.careerpilot.auth.dto.ResetRequest;
import com.careerpilot.config.AuthProperties;
import com.careerpilot.config.JwtProperties;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.time.Duration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Auth endpoints. The refresh token never appears in a response body — only in an httpOnly cookie
 * scoped to {@code /api/auth}, so it is invisible to JavaScript and never sent to other routes.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    static final String REFRESH_COOKIE = "cp_refresh";
    private static final String REFRESH_PATH = "/api/auth";

    private final AuthService authService;
    private final JwtProperties jwtProperties;
    private final AuthProperties authProperties;

    public AuthController(AuthService authService, JwtProperties jwtProperties, AuthProperties authProperties) {
        this.authService = authService;
        this.jwtProperties = jwtProperties;
        this.authProperties = authProperties;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request,
                                                HttpServletRequest http) {
        AuthService.AuthResult result = authService.register(request, http.getHeader(HttpHeaders.USER_AGENT));
        return ResponseEntity.status(HttpStatus.CREATED)
                .header(HttpHeaders.SET_COOKIE, refreshCookie(result.refreshToken()).toString())
                .body(result.response());
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request,
                                              HttpServletRequest http) {
        AuthService.AuthResult result = authService.login(request, http.getHeader(HttpHeaders.USER_AGENT));
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, refreshCookie(result.refreshToken()).toString())
                .body(result.response());
    }

    @PostMapping("/refresh")
    public ResponseEntity<RefreshResponse> refresh(
            @CookieValue(name = REFRESH_COOKIE, required = false) String refreshToken,
            HttpServletRequest http) {
        AuthService.AuthResult result = authService.refresh(refreshToken, http.getHeader(HttpHeaders.USER_AGENT));
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, refreshCookie(result.refreshToken()).toString())
                .body(new RefreshResponse(result.response().accessToken(), result.response().expiresIn()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@CookieValue(name = REFRESH_COOKIE, required = false) String refreshToken) {
        authService.logout(refreshToken);
        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, clearedCookie().toString())
                .build();
    }

    /** Always 204 — the response never reveals whether the email exists. */
    @PostMapping("/forgot")
    public ResponseEntity<Void> forgot(@Valid @RequestBody ForgotRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/reset")
    public ResponseEntity<Void> reset(@Valid @RequestBody ResetRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.noContent().build();
    }

    private ResponseCookie refreshCookie(String value) {
        return ResponseCookie.from(REFRESH_COOKIE, value)
                .httpOnly(true)
                .secure(authProperties.cookieSecure())
                .sameSite("Lax")
                .path(REFRESH_PATH)
                .maxAge(jwtProperties.refreshTokenTtl())
                .build();
    }

    private ResponseCookie clearedCookie() {
        return ResponseCookie.from(REFRESH_COOKIE, "")
                .httpOnly(true)
                .secure(authProperties.cookieSecure())
                .sameSite("Lax")
                .path(REFRESH_PATH)
                .maxAge(Duration.ZERO)
                .build();
    }
}
