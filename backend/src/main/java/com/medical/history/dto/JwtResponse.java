package com.medical.history.dto;

import lombok.Data;

import java.util.List;

@Data
public class JwtResponse {
    
    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String email;
    private List<String> roles;
    private Long patientId;
    private Long doctorId;
    
    public JwtResponse(String accessToken, Long id, String username, String email, List<String> roles) {
        this.token = accessToken;
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles;
    }
    
    public JwtResponse(String accessToken, Long id, String username, String email, List<String> roles, Long patientId, Long doctorId) {
        this.token = accessToken;
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles;
        this.patientId = patientId;
        this.doctorId = doctorId;
    }
}
