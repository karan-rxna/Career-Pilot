package com.careerpilot.user.dto;

/**
 * Aggregated profile stats.
 *
 * <p>{@code goalsCompleted}, {@code streak} and {@code solvedTotal} are wired to their real tables once
 * Goals (Stage 5) and the sync engine (Stage 6) land; until then they report the stored user values and
 * zero counts rather than inventing numbers.</p>
 */
public record UserStatsResponse(
        int goalsCompleted,
        short readinessScore,
        short resumeProgress,
        int streak,
        int solvedTotal) {
}
