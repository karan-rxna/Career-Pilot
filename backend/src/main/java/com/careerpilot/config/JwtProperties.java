package com.careerpilot.config;

import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * JWT settings — see {@code application.yml}.
 *
 * @param issuer          {@code iss} claim
 * @param secret          HMAC key material, must be at least 32 bytes for HS256
 * @param accessTokenTtl  short-lived token sent on every request
 * @param refreshTokenTtl long-lived, rotated, httpOnly cookie
 */
@ConfigurationProperties(prefix = "careerpilot.jwt")
public record JwtProperties(
        String issuer,
        String secret,
        Duration accessTokenTtl,
        Duration refreshTokenTtl) {
}
