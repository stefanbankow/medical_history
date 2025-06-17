package com.medical.history.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "doctors")
@Data
@EqualsAndHashCode(callSuper = true, exclude = {"patients", "medicalVisits"})
public class Doctor extends BaseEntity {
    
    @NotBlank(message = "Doctor identification number is required")
    @Column(name = "identification_number", unique = true, nullable = false)
    private String identificationNumber;
    
    @NotBlank(message = "Name is required")
    @Column(name = "name", nullable = false)
    private String name;
    
    @NotBlank(message = "Specialty is required")
    @Column(name = "specialty", nullable = false)
    private String specialty;
    
    @Column(name = "is_family_doctor")
    private Boolean isFamilyDoctor = false;
    
    // Patients who have this doctor as their family doctor
    @OneToMany(mappedBy = "familyDoctor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Patient> patients = new HashSet<>();
    
    // All medical visits this doctor has conducted
    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<MedicalVisit> medicalVisits = new HashSet<>();
}
