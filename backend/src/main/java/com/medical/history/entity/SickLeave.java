package com.medical.history.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;

@Entity
@Table(name = "sick_leaves")
@Data
@EqualsAndHashCode(callSuper = true)
public class SickLeave extends BaseEntity {
    
    @NotNull(message = "Start date is required")
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;
    
    @NotNull(message = "Duration in days is required")
    @Positive(message = "Duration must be positive")
    @Column(name = "duration_days", nullable = false)
    private Integer durationDays;
    
    @Column(name = "end_date")
    private LocalDate endDate;
    
    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;
    
    // The medical visit that issued this sick leave
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medical_visit_id", nullable = false)
    private MedicalVisit medicalVisit;
    
    @PrePersist
    @PreUpdate
    private void calculateEndDate() {
        if (startDate != null && durationDays != null) {
            endDate = startDate.plusDays(durationDays - 1);
        }
    }
}
