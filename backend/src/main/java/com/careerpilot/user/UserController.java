package com.careerpilot.user;

import com.careerpilot.user.dto.UpdateProfileRequest;
import com.careerpilot.user.dto.UserResponse;
import com.careerpilot.user.dto.UserStatsResponse;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Everything here is scoped to the caller: the user id comes from the verified JWT subject, never
 * from a path or body parameter, so one account can never read or write another's data.
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public UserResponse me(@AuthenticationPrincipal Jwt jwt) {
        return userService.me(userId(jwt));
    }

    @PatchMapping("/me")
    public UserResponse update(@AuthenticationPrincipal Jwt jwt,
                               @Valid @RequestBody UpdateProfileRequest request) {
        return userService.update(userId(jwt), request);
    }

    @GetMapping("/me/stats")
    public UserStatsResponse stats(@AuthenticationPrincipal Jwt jwt) {
        return userService.stats(userId(jwt));
    }

    private Long userId(Jwt jwt) {
        return Long.valueOf(jwt.getSubject());
    }
}
