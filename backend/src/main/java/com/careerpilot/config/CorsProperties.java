package com.careerpilot.config;

import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

/** Browser origins allowed to call the API (the Vercel frontend plus local dev). */
@ConfigurationProperties(prefix = "careerpilot.cors")
public record CorsProperties(List<String> allowedOrigins) {
}
