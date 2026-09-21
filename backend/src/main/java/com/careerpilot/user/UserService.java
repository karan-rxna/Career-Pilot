package com.careerpilot.user;

import com.careerpilot.common.UnauthorizedException;
import com.careerpilot.user.dto.UpdateProfileRequest;
import com.careerpilot.user.dto.UserResponse;
import com.careerpilot.user.dto.UserStatsResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository users;

    public UserService(UserRepository users) {
        this.users = users;
    }

    @Transactional(readOnly = true)
    public UserResponse me(Long userId) {
        return UserResponse.from(require(userId));
    }

    @Transactional
    public UserResponse update(Long userId, UpdateProfileRequest request) {
        User user = require(userId);
        if (request.name() != null) {
            user.setName(request.name().trim());
        }
        if (request.handle() != null) {
            String handle = request.handle().trim();
            user.setHandle(handle.startsWith("@") ? handle : "@" + handle);
        }
        if (request.college() != null) {
            user.setCollege(request.college().trim());
        }
        if (request.batch() != null) {
            user.setBatch(request.batch().trim());
        }
        if (request.location() != null) {
            user.setLocation(request.location().trim());
        }
        if (request.headline() != null) {
            user.setHeadline(request.headline().trim());
        }
        if (request.bio() != null) {
            user.setBio(request.bio().trim());
        }
        if (request.avatarHue() != null) {
            user.setAvatarHue(request.avatarHue());
        }
        if (request.skills() != null) {
            user.setSkills(request.skills().stream().map(String::trim).filter(s -> !s.isEmpty()).distinct().toList());
        }
        return UserResponse.from(users.save(user));
    }

    @Transactional(readOnly = true)
    public UserStatsResponse stats(Long userId) {
        User user = require(userId);
        // goalsCompleted / streak / solvedTotal light up in Stage 5 (Goals) and Stage 6 (sync engine).
        return new UserStatsResponse(0, user.getReadinessScore(), user.getResumeProgress(), 0, 0);
    }

    private User require(Long userId) {
        return users.findById(userId)
                .orElseThrow(() -> new UnauthorizedException("Account no longer exists"));
    }
}
