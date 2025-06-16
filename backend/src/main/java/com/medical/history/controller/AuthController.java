package com.medical.history.controller;

import com.medical.history.dto.*;
import com.medical.history.entity.Role;
import com.medical.history.entity.User;
import com.medical.history.repository.RoleRepository;
import com.medical.history.repository.UserRepository;
import com.medical.history.security.JwtUtils;
import com.medical.history.security.UserPrincipal;
import com.medical.history.service.DoctorService;
import com.medical.history.service.PatientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication management APIs")
public class AuthController {
    
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;
    private final PatientService patientService;
    private final DoctorService doctorService;
    
    @PostMapping("/signin")
    @Operation(summary = "Sign in user")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        UserPrincipal userDetails = (UserPrincipal) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());
        
        User user = userRepository.findByUsername(userDetails.getUsername()).orElse(null);
        Long patientId = user != null && user.getPatient() != null ? user.getPatient().getId() : null;
        Long doctorId = user != null && user.getDoctor() != null ? user.getDoctor().getId() : null;
        
        return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(),
                userDetails.getEmail(), roles, patientId, doctorId));
    }
    
    @PostMapping("/signup")
    @Operation(summary = "Register a new user")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }
        
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }
        
        // Create new user's account
        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        
        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();
        
        if (strRoles == null) {
            Role userRole = roleRepository.findByName(Role.RoleName.ROLE_PATIENT)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(Role.RoleName.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);
                        break;
                    case "doctor":
                        Role doctorRole = roleRepository.findByName(Role.RoleName.ROLE_DOCTOR)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(doctorRole);
                        break;
                    default:
                        Role patientRole = roleRepository.findByName(Role.RoleName.ROLE_PATIENT)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(patientRole);
                }
            });
        }
        
        user.setRoles(roles);
        user = userRepository.save(user);
        
        // Create associated patient or doctor entity
        if (roles.stream().anyMatch(r -> r.getName() == Role.RoleName.ROLE_PATIENT)) {
            if (signUpRequest.getName() != null && signUpRequest.getEgn() != null) {
                PatientDto patientDto = new PatientDto();
                patientDto.setName(signUpRequest.getName());
                patientDto.setEgn(signUpRequest.getEgn());
                patientDto.setFamilyDoctorId(signUpRequest.getFamilyDoctorId());
                patientService.createPatient(patientDto);
            }
        }
        
        if (roles.stream().anyMatch(r -> r.getName() == Role.RoleName.ROLE_DOCTOR)) {
            if (signUpRequest.getName() != null && signUpRequest.getIdentificationNumber() != null) {
                DoctorDto doctorDto = new DoctorDto();
                doctorDto.setName(signUpRequest.getName());
                doctorDto.setIdentificationNumber(signUpRequest.getIdentificationNumber());
                doctorDto.setSpecialty(signUpRequest.getSpecialty());
                doctorDto.setIsFamilyDoctor(signUpRequest.getIsFamilyDoctor());
                doctorService.createDoctor(doctorDto);
            }
        }
        
        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}
