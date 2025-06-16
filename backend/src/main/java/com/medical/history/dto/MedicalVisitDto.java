package com.medical.history.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class MedicalVisitDto {
    
    private Long id;
    
    @NotNull(message = "Visit date is required")
    private LocalDate visitDate;
    
    private LocalDateTime visitTime;
    
    private String symptoms;
    
    private String treatment;
    
    private String prescribedMedication;
    
    private String notes;
    
    @NotNull(message = "Patient ID is required")
    private Long patientId;
    
    private String patientName;
    
    @NotNull(message = "Doctor ID is required")
    private Long doctorId;
    
    private String doctorName;
    
    private Long diagnosisId;
    
    private String diagnosisName;
    
    private SickLeaveDto sickLeave;
}
