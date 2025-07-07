package com.REACT.backend.Jwt;

import com.REACT.backend.users.AppUser;
import com.REACT.backend.users.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class AuthTokenFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserRepository userRepository;

    private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        try {
            String jwt = jwtUtils.getJwtFromHeader(request);
            logger.debug("Token received from header: {}", jwt); // ✅ Log raw token

            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                String userEmail = jwtUtils.getEmailFromJwtToken(jwt);
                logger.debug("Decoded user email from token: {}", userEmail); // ✅ Log decoded subject

                AppUser userDetails = userRepository.findByUserEmail(userEmail);

                if (userDetails != null) {
                    logger.debug("User found in DB: {}", userDetails.getUserEmail()); // ✅ Log DB lookup success

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    List.of(new SimpleGrantedAuthority("ROLE_" + userDetails.getRole()))
                            );

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    logger.debug("Security context updated with user: {}", userDetails.getUserEmail()); // ✅ Log security context
                } else {
                    logger.warn("User not found in DB for email: {}", userEmail);
                }
            } else {
                logger.warn("Invalid or missing JWT token.");
            }

        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}", e.getMessage(), e);
        }

        filterChain.doFilter(request, response);
    }


}
