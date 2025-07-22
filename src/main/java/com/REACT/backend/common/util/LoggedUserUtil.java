package com.REACT.backend.common.util;

import com.REACT.backend.users.AppUser;
import com.REACT.backend.users.repository.AmbulanceDriverRepository;
import com.REACT.backend.users.repository.AppUserRepository;
import com.REACT.backend.users.repository.FireTruckDriverRepository;
import com.REACT.backend.users.repository.PoliceOfficerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class LoggedUserUtil {

    private final AppUserRepository appUserRepository;
    @Autowired
    private final AmbulanceDriverRepository ambulanceDriverRepository;

    @Autowired
    private final PoliceOfficerRepository policeOfficerRepository;

    @Autowired
    private final FireTruckDriverRepository fireTruckDriverRepository;


    public  AppUser getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof AppUser) {
            return (AppUser) principal;
        } else if (principal instanceof UserDetails) {
            String email = ((UserDetails) principal).getUsername(); // Should be email
            return appUserRepository.findByUserEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found for email: " + email));
        } else if (principal instanceof String) {
            // In case principal is just a username string
            return appUserRepository.findByUserEmail((String) principal)
                    .orElseThrow(() -> new RuntimeException("User not found for email: " + principal));
        }
        throw new RuntimeException("Unsupported principal type: " + principal.getClass());
    }


    public Object getCurrentLoggedUserDetails() {
        AppUser appUser = getCurrentUser();

        return switch (appUser.getRole()) {
            case AMBULANCE_DRIVER -> ambulanceDriverRepository.findByDriver(appUser)
                    .orElseThrow(() -> new RuntimeException("Ambulance driver details not found"));
            case POLICE_OFFICER -> policeOfficerRepository.findByPoliceOfficer(appUser)
                    .orElseThrow(() -> new RuntimeException("Police officer details not found"));
            case FIRE_DRIVER -> fireTruckDriverRepository.findByDriver(appUser)
                    .orElseThrow(() -> new RuntimeException("Fire truck driver details not found"));
            default -> appUser;
        };
    }

}
