package com.medical.history.controller;

import com.medical.history.dto.SickLeaveDto;
import com.medical.history.service.SickLeaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/sick-leaves")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class SickLeaveController {
    
    private final SickLeaveService sickLeaveService;
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<List<SickLeaveDto>> getAllSickLeaves() {
        List<SickLeaveDto> sickLeaves = sickLeaveService.getAllSickLeaves();
        return ResponseEntity.ok(sickLeaves);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('PATIENT')")
    public ResponseEntity<SickLeaveDto> getSickLeaveById(@PathVariable Long id) {
        return sickLeaveService.getSickLeaveById(id)
                .map(sickLeave -> ResponseEntity.ok(sickLeave))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or (hasRole('PATIENT') and @patientService.isPatientOwner(#patientId, authentication.name))")
    public ResponseEntity<List<SickLeaveDto>> getSickLeavesByPatient(@PathVariable Long patientId) {
        List<SickLeaveDto> sickLeaves = sickLeaveService.getSickLeavesByPatient(patientId);
        return ResponseEntity.ok(sickLeaves);
    }
    
    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<List<SickLeaveDto>> getSickLeavesByDoctor(@PathVariable Long doctorId) {
        List<SickLeaveDto> sickLeaves = sickLeaveService.getSickLeavesByDoctor(doctorId);
        return ResponseEntity.ok(sickLeaves);
    }
    
    @GetMapping("/date-range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<List<SickLeaveDto>> getSickLeavesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<SickLeaveDto> sickLeaves = sickLeaveService.getSickLeavesByDateRange(startDate, endDate);
        return ResponseEntity.ok(sickLeaves);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<SickLeaveDto> createSickLeave(@Valid @RequestBody SickLeaveDto sickLeaveDto) {
        try {
            SickLeaveDto createdSickLeave = sickLeaveService.createSickLeave(sickLeaveDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdSickLeave);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<SickLeaveDto> updateSickLeave(@PathVariable Long id, @Valid @RequestBody SickLeaveDto sickLeaveDto) {
        return sickLeaveService.updateSickLeave(id, sickLeaveDto)
                .map(sickLeave -> ResponseEntity.ok(sickLeave))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSickLeave(@PathVariable Long id) {
        if (sickLeaveService.deleteSickLeave(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
