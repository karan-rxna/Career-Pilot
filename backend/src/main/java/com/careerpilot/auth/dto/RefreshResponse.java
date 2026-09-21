package com.careerpilot.auth.dto;

/** Returned by {@code POST /api/auth/refresh} — the user already has the rest from login. */
public record RefreshResponse(
        String accessToken,
        long expiresIn) {
}
