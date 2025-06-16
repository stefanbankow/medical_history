package com.medical.history.config;

import com.medical.history.entity.Role;
import com.medical.history.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    
    private final RoleRepository roleRepository;
    
    @Override
    public void run(String... args) throws Exception {
        initializeRoles();
    }
    
    private void initializeRoles() {
        if (roleRepository.count() == 0) {
            log.info("Initializing default roles...");
            
            Role patientRole = new Role();
            patientRole.setName(Role.RoleName.ROLE_PATIENT);
            roleRepository.save(patientRole);
            
            Role doctorRole = new Role();
            doctorRole.setName(Role.RoleName.ROLE_DOCTOR);
            roleRepository.save(doctorRole);
            
            Role adminRole = new Role();
            adminRole.setName(Role.RoleName.ROLE_ADMIN);
            roleRepository.save(adminRole);
            
            log.info("Default roles created successfully");
        }
    }
}
