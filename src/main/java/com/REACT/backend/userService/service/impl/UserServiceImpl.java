package com.REACT.backend.userService.service.impl;


import com.REACT.backend.userService.dto.UpdateUserProfileDto;
import com.REACT.backend.userService.dto.UserProfileDto;
import com.REACT.backend.userService.service.UserService;
import com.REACT.backend.users.AppUser;
import com.REACT.backend.users.Role;
import com.REACT.backend.users.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private final com.REACT.backend.common.util.LoggedUserUtil loggedUserUtil;
    private final AppUserRepository appUserRepository;

    @Override
    public UserProfileDto getProfileOfCurrentUser() {
        AppUser user = loggedUserUtil.getCurrentUser();
        log.info("User found with email={} and userId={}",user.getUserEmail(),user.getUserId());
        if (user.getRole() != Role.USER) {
            log.error("User don't have Role of user, userRole={}",user.getRole());
            throw new SecurityException("Only users with role USER can access this endpoint");
        }
        return UserProfileDto.from(user);
    }

    @Override
    public UserProfileDto updateUserProfile(UpdateUserProfileDto updateRequest) {
        AppUser user = loggedUserUtil.getCurrentUser();
        log.info("Old name {} \n Old PhoneNumber {}",user.getUserFullName(),user.getPhoneNumber());
        user.setUserFullName(updateRequest.getUserFullName());
        user.setPhoneNumber(updateRequest.getPhoneNumber());
        log.info("New name {} \n new PhoneNumber {}",user.getUserFullName(),user.getPhoneNumber());

        AppUser saved = appUserRepository.save(user);
        return UserProfileDto.from(saved);
    }

}
