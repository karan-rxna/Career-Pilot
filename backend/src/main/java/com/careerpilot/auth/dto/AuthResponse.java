package com.careerpilot.auth.dto;

import com.careerpilot.user.dto.UserResponse;

/**
 * @param expiresIn access-token lifetime in seconds; the refresh token travels as an httpOnly cookie
 */
public record AuthResponse(
        String accessToken,
        long expiresIn,
        UserResponse user) {
}
