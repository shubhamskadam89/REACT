package com.REACT.backend.common.util;

import com.REACT.backend.users.AppUser;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class LoggedUserUtil {
    public AppUser getLoggedInUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new IllegalArgumentException("No such user exist");
        }

        return (AppUser) auth.getPrincipal(); // Only if your UserDetails implements AppUser
    }
}
