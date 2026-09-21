package com.careerpilot.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.careerpilot.config.JwtProperties;
import com.careerpilot.user.Role;
import com.careerpilot.user.User;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import com.nimbusds.jose.proc.SecurityContext;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

/**
 * Pure unit test — no Spring context, no database. Verifies the access token carries the claims the
 * security layer relies on, and that a token signed with a different key is rejected.
 */
class JwtServiceTest {

    private static final String SECRET = "careerpilot-test-secret-at-least-32-bytes!!";
    private static final String OTHER_SECRET = "a-completely-different-32-byte-secret!!";
    private static final String ISSUER = "https://careerpilot.app";

    private final SecretKey key = key(SECRET);
    private final JwtService jwtService = new JwtService(
            new NimbusJwtEncoder(secretSource(key)),
            new JwtProperties(ISSUER, SECRET, Duration.ofMinutes(15), Duration.ofDays(30)));

    @Test
    void issuesTokenCarryingIdentityAndRole() {
        User user = new User("karan@careerpilot.app", "hash", "Karan Rana");
        user.setRole(Role.ADMIN);

        Jwt decoded = decoder(key).decode(jwtService.issueAccessToken(user).token());

        assertThat(decoded.getIssuer().toString()).isEqualTo(ISSUER);
        assertThat(decoded.getClaimAsString("email")).isEqualTo("karan@careerpilot.app");
        assertThat(decoded.getClaimAsString("name")).isEqualTo("Karan Rana");
        assertThat(decoded.getClaimAsString("role")).isEqualTo("ADMIN");
        assertThat(decoded.getExpiresAt()).isAfter(decoded.getIssuedAt());
    }

    @Test
    void exposesAccessTokenLifetimeInSeconds() {
        User user = new User("karan@careerpilot.app", "hash", "Karan Rana");
        assertThat(jwtService.issueAccessToken(user).expiresInSeconds()).isEqualTo(900);
    }

    @Test
    void rejectsTokenSignedWithAnotherKey() {
        User user = new User("karan@careerpilot.app", "hash", "Karan Rana");
        String token = jwtService.issueAccessToken(user).token();

        assertThatThrownBy(() -> decoder(key(OTHER_SECRET)).decode(token))
                .isInstanceOf(JwtException.class);
    }

    private static SecretKey key(String secret) {
        return new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
    }

    private static ImmutableSecret<SecurityContext> secretSource(SecretKey key) {
        return new ImmutableSecret<>(key);
    }

    private static JwtDecoder decoder(SecretKey key) {
        return NimbusJwtDecoder.withSecretKey(key).build();
    }
}
