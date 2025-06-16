package com.medical.history.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PatientDto {
    
    private Long id;
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotBlank(message = "EGN (Personal ID) is required")
    @Pattern(regexp = "\\d{10}", message = "EGN must be exactly 10 digits")
    private String egn;
    
    private Boolean healthInsurancePaid = false;
    
    private LocalDate lastInsurancePaymentDate;
    
    private Long familyDoctorId;
    
    private String familyDoctorName;
    
    private Boolean healthInsuranceValid;
}
