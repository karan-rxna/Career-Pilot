package com.careerpilot.user.dto;

import com.careerpilot.user.User;
import java.time.Instant;
import java.util.List;

/** Public view of a user — mirrors the {@code User} type in the frontend mock layer. */
public record UserResponse(
        Long id,
        String name,
        String email,
        String handle,
        String college,
        String batch,
        String location,
        String headline,
        String bio,
        short avatarHue,
        short readinessScore,
        short resumeProgress,
        List<String> skills,
        String role,
        Instant joinedOn) {

    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getHandle(),
                user.getCollege(),
                user.getBatch(),
                user.getLocation(),
                user.getHeadline(),
                user.getBio(),
                user.getAvatarHue(),
                user.getReadinessScore(),
                user.getResumeProgress(),
                List.copyOf(user.getSkills()),
                user.getRole().name(),
                user.getCreatedAt());
    }
}
