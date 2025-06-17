package com.medical.history.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "medical_visits")
@Data
@EqualsAndHashCode(callSuper = true, exclude = {"patient", "doctor", "diagnosis", "sickLeave"})
public class MedicalVisit extends BaseEntity {
    
    @NotNull(message = "Visit date is required")
    @Column(name = "visit_date", nullable = false)
    private LocalDate visitDate;
    
    @Column(name = "visit_time")
    private LocalTime visitTime;
    
    @Column(name = "symptoms", columnDefinition = "TEXT")
    private String symptoms;
    
    @Column(name = "treatment", columnDefinition = "TEXT")
    private String treatment;
    
    @Column(name = "prescribed_medication", columnDefinition = "TEXT")
    private String prescribedMedication;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    // The patient who visited
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;
    
    // The doctor who conducted the visit
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;
    
    // The diagnosis made during this visit
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diagnosis_id")
    private Diagnosis diagnosis;
    
    // Sick leave issued during this visit (if any)
    @OneToOne(mappedBy = "medicalVisit", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private SickLeave sickLeave;
    
    @PrePersist
    private void prePersist() {
        if (visitTime == null) {
            visitTime = LocalTime.now();
        }
    }
}
