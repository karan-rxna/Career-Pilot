package com.careerpilot.common;

import java.time.Instant;
import java.util.Map;

/**
 * Uniform error body — see docs/API_CONTRACT.md ("Error codes").
 *
 * <pre>
 * { "status": 400, "error": "VALIDATION_FAILED", "message": "...",
 *   "path": "/api/goals", "timestamp": "...", "fieldErrors": { "target": "must be > 0" } }
 * </pre>
 */
public record ApiError(
        int status,
        String error,
        String message,
        String path,
        Instant timestamp,
        Map<String, String> fieldErrors) {

    public static ApiError of(int status, String error, String message, String path) {
        return new ApiError(status, error, message, path, Instant.now(), Map.of());
    }

    public static ApiError validation(String message, String path, Map<String, String> fieldErrors) {
        return new ApiError(400, "VALIDATION_FAILED", message, path, Instant.now(), fieldErrors);
    }
}
