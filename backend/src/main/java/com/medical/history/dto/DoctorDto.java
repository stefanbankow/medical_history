package com.medical.history.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DoctorDto {
    
    private Long id;
    
    @NotBlank(message = "Doctor identification number is required")
    private String identificationNumber;
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotBlank(message = "Specialty is required")
    private String specialty;
    
    private Boolean isFamilyDoctor = false;
    
    private Integer patientCount;
    private Integer visitCount;
}
