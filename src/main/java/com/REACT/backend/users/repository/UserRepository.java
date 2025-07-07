package com.REACT.backend.users.repository;

import com.REACT.backend.users.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<AppUser,Long> {

    AppUser findByUserEmail(String email);
    boolean existsByGovernmentId(String governmentId);
    boolean existsByPhoneNumber(String phoneNumber);
    AppUser findByUserType(String email);

}
