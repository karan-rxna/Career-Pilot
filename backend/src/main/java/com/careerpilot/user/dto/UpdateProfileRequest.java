package com.careerpilot.user.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import java.util.List;

/**
 * PATCH semantics: every field is optional, only non-null values are applied.
 */
public record UpdateProfileRequest(
        @Size(max = 120) String name,
        @Size(max = 40) String handle,
        @Size(max = 180) String college,
        @Size(max = 120) String batch,
        @Size(max = 120) String location,
        @Size(max = 160) String headline,
        @Size(max = 600) String bio,
        @Min(0) @Max(360) Short avatarHue,
        @Size(max = 30) List<@Size(max = 40) String> skills) {
}
