package com.medical.history.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDate;

@Data
public class SickLeaveDto {
    
    private Long id;
    
    @NotNull(message = "Start date is required")
    private LocalDate startDate;
    
    @NotNull(message = "Duration in days is required")
    @Positive(message = "Duration must be positive")
    private Integer durationDays;
    
    private LocalDate endDate;
    
    private String reason;
    
    private Long medicalVisitId;
}
