package com.medical.history.controller;

import com.medical.history.dto.MedicalVisitDto;
import com.medical.history.service.MedicalVisitService;
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
@RequestMapping("/medical-visits")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class MedicalVisitController {
    
    private final MedicalVisitService medicalVisitService;
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<List<MedicalVisitDto>> getAllMedicalVisits() {
        List<MedicalVisitDto> visits = medicalVisitService.getAllMedicalVisits();
        return ResponseEntity.ok(visits);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('PATIENT')")
    public ResponseEntity<MedicalVisitDto> getMedicalVisitById(@PathVariable Long id) {
        return medicalVisitService.getMedicalVisitById(id)
                .map(visit -> ResponseEntity.ok(visit))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or (hasRole('PATIENT') and @patientService.isPatientOwner(#patientId, authentication.name))")
    public ResponseEntity<List<MedicalVisitDto>> getMedicalVisitsByPatient(@PathVariable Long patientId) {
        List<MedicalVisitDto> visits = medicalVisitService.getMedicalVisitsByPatient(patientId);
        return ResponseEntity.ok(visits);
    }
    
    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<List<MedicalVisitDto>> getMedicalVisitsByDoctor(@PathVariable Long doctorId) {
        List<MedicalVisitDto> visits = medicalVisitService.getMedicalVisitsByDoctor(doctorId);
        return ResponseEntity.ok(visits);
    }
    
    @GetMapping("/date-range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<List<MedicalVisitDto>> getMedicalVisitsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<MedicalVisitDto> visits = medicalVisitService.getMedicalVisitsByDateRange(startDate, endDate);
        return ResponseEntity.ok(visits);
    }
    
    @GetMapping("/doctor/{doctorId}/date-range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<List<MedicalVisitDto>> getMedicalVisitsByDoctorAndDateRange(
            @PathVariable Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<MedicalVisitDto> visits = medicalVisitService.getMedicalVisitsByDoctorAndDateRange(doctorId, startDate, endDate);
        return ResponseEntity.ok(visits);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<MedicalVisitDto> createMedicalVisit(@Valid @RequestBody MedicalVisitDto visitDto) {
        try {
            MedicalVisitDto createdVisit = medicalVisitService.createMedicalVisit(visitDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdVisit);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<MedicalVisitDto> updateMedicalVisit(@PathVariable Long id, @Valid @RequestBody MedicalVisitDto visitDto) {
        return medicalVisitService.updateMedicalVisit(id, visitDto)
                .map(visit -> ResponseEntity.ok(visit))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMedicalVisit(@PathVariable Long id) {
        if (medicalVisitService.deleteMedicalVisit(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
