package com.medical.history.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "patients")
@Data
@EqualsAndHashCode(callSuper = true)
public class Patient extends BaseEntity {
    
    @NotBlank(message = "Name is required")
    @Column(name = "name", nullable = false)
    private String name;
    
    @NotBlank(message = "EGN (Personal ID) is required")
    @Pattern(regexp = "\\d{10}", message = "EGN must be exactly 10 digits")
    @Column(name = "egn", unique = true, nullable = false, length = 10)
    private String egn;
    
    @Column(name = "health_insurance_paid")
    private Boolean healthInsurancePaid = false;
    
    @Column(name = "last_insurance_payment_date")
    private LocalDate lastInsurancePaymentDate;
    
    // Family doctor assignment
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "family_doctor_id", nullable = false)
    private Doctor familyDoctor;
    
    // All medical visits for this patient
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<MedicalVisit> medicalVisits = new HashSet<>();
    
    // Check if health insurance is paid for the last 6 months
    public boolean isHealthInsuranceValid() {
        if (lastInsurancePaymentDate == null) {
            return false;
        }
        return lastInsurancePaymentDate.isAfter(LocalDate.now().minusMonths(6));
    }
}
