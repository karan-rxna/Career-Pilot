package com.careerpilot.config;

import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * @param cookieSecure   set true in production (Render serves over HTTPS)
 * @param cookieSameSite {@code Lax} keeps the refresh cookie on same-site requests, which is all a
 *                       local SPA needs (localhost:5173 → localhost:8080 is cross-origin but
 *                       same-site). A deployed frontend on a different domain is cross-*site*, so
 *                       it must set {@code None} — which browsers only accept together with a
 *                       {@code Secure} cookie, i.e. HTTPS.
 * @param resetTokenTtl  how long a password-reset link stays valid
 */
@ConfigurationProperties(prefix = "careerpilot.auth")
public record AuthProperties(boolean cookieSecure, String cookieSameSite, Duration resetTokenTtl) {
}
