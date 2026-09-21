package com.careerpilot.config;

import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * @param cookieSecure  set true in production (Render serves over HTTPS)
 * @param resetTokenTtl how long a password-reset link stays valid
 */
@ConfigurationProperties(prefix = "careerpilot.auth")
public record AuthProperties(boolean cookieSecure, Duration resetTokenTtl) {
}
