package com.medical.history.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DiagnosisDto {
    
    private Long id;
    
    @NotBlank(message = "Diagnosis code is required")
    private String code;
    
    @NotBlank(message = "Diagnosis name is required")
    private String name;
    
    private String description;
    
    private Long visitCount;
}
