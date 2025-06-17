package com.medical.history.config;

import com.medical.history.entity.*;
import com.medical.history.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final DiagnosisRepository diagnosisRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        initializeRoles();
        initializeUsers();
        initializeDiagnoses();
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
    
    private void initializeUsers() {
        if (userRepository.count() == 0) {
            log.info("Initializing default users...");
            
            // Create roles
            Role adminRole = roleRepository.findByName(Role.RoleName.ROLE_ADMIN).orElse(null);
            Role doctorRole = roleRepository.findByName(Role.RoleName.ROLE_DOCTOR).orElse(null);
            Role patientRole = roleRepository.findByName(Role.RoleName.ROLE_PATIENT).orElse(null);
            
            // Create Admin User
            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setEmail("admin@medical.com");
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            adminUser.setRoles(Set.of(adminRole));
            userRepository.save(adminUser);
            
            // Create Doctor
            Doctor doctor = new Doctor();
            doctor.setIdentificationNumber("DOC123456");
            doctor.setName("Dr. John Smith");
            doctor.setSpecialty("General Medicine");
            doctor.setIsFamilyDoctor(true);
            doctorRepository.save(doctor);
            
            // Create Doctor User
            User doctorUser = new User();
            doctorUser.setUsername("doctor");
            doctorUser.setEmail("doctor@medical.com");
            doctorUser.setPassword(passwordEncoder.encode("doctor123"));
            doctorUser.setRoles(Set.of(doctorRole));
            doctorUser.setDoctor(doctor);
            userRepository.save(doctorUser);
            
            // Create Patient
            Patient patient = new Patient();
            patient.setName("Jane Doe");
            patient.setEgn("9005151234"); // Valid Bulgarian EGN format
            patient.setHealthInsurancePaid(true);
            patient.setLastInsurancePaymentDate(LocalDate.now().minusMonths(1));
            patient.setFamilyDoctor(doctor);
            patientRepository.save(patient);
            
            // Create Patient User
            User patientUser = new User();
            patientUser.setUsername("patient");
            patientUser.setEmail("patient@medical.com");
            patientUser.setPassword(passwordEncoder.encode("patient123"));
            patientUser.setRoles(Set.of(patientRole));
            patientUser.setPatient(patient);
            userRepository.save(patientUser);
            
            log.info("Default users created successfully");
            log.info("Admin credentials: admin / admin123");
            log.info("Doctor credentials: doctor / doctor123");
            log.info("Patient credentials: patient / patient123");
        }
    }
    
    private void initializeDiagnoses() {
        if (diagnosisRepository.count() == 0) {
            log.info("Initializing common diagnoses...");
            
            String[] commonDiagnoses = {
                "Common Cold", "Influenza", "Hypertension", "Diabetes Type 2",
                "Asthma", "Migraine", "Gastritis", "Bronchitis",
                "Allergic Rhinitis", "Lower Back Pain", "Anxiety Disorder",
                "Depression", "Pneumonia", "Urinary Tract Infection"
            };
            
            for (String diagnosisName : commonDiagnoses) {
                Diagnosis diagnosis = new Diagnosis();
                diagnosis.setName(diagnosisName);
                diagnosis.setCode("ICD-" + diagnosisName.replaceAll(" ", "").toUpperCase());
                diagnosis.setDescription("Standard diagnosis for " + diagnosisName.toLowerCase());
                diagnosisRepository.save(diagnosis);
            }
            
            log.info("Common diagnoses created successfully");
        }
    }
}
