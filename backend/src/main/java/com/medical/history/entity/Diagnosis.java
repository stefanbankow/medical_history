package com.medical.history.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "diagnoses")
@Data
@EqualsAndHashCode(callSuper = true)
public class Diagnosis extends BaseEntity {
    
    @NotBlank(message = "Diagnosis code is required")
    @Column(name = "code", unique = true, nullable = false)
    private String code;
    
    @NotBlank(message = "Diagnosis name is required")
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    // Medical visits where this diagnosis was made
    @OneToMany(mappedBy = "diagnosis", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<MedicalVisit> medicalVisits = new HashSet<>();
}
