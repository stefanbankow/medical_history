package com.medical.history.controller;

import com.medical.history.dto.DiagnosisDto;
import com.medical.history.service.DiagnosisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/diagnoses")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class DiagnosisController {
    
    private final DiagnosisService diagnosisService;
     @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('PATIENT')")
    public ResponseEntity<List<DiagnosisDto>> getAllDiagnoses() {
        List<DiagnosisDto> diagnoses = diagnosisService.getAllDiagnoses();
        return ResponseEntity.ok(diagnoses);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('PATIENT')")
    public ResponseEntity<DiagnosisDto> getDiagnosisById(@PathVariable Long id) {
        return diagnosisService.getDiagnosisById(id)
                .map(diagnosis -> ResponseEntity.ok(diagnosis))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/code/{code}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<DiagnosisDto> getDiagnosisByCode(@PathVariable String code) {
        return diagnosisService.getDiagnosisByCode(code)
                .map(diagnosis -> ResponseEntity.ok(diagnosis))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<List<DiagnosisDto>> searchDiagnoses(@RequestParam String name) {
        List<DiagnosisDto> diagnoses = diagnosisService.searchDiagnosesByName(name);
        return ResponseEntity.ok(diagnoses);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DiagnosisDto> createDiagnosis(@Valid @RequestBody DiagnosisDto diagnosisDto) {
        try {
            DiagnosisDto createdDiagnosis = diagnosisService.createDiagnosis(diagnosisDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdDiagnosis);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DiagnosisDto> updateDiagnosis(@PathVariable Long id, @Valid @RequestBody DiagnosisDto diagnosisDto) {
        return diagnosisService.updateDiagnosis(id, diagnosisDto)
                .map(diagnosis -> ResponseEntity.ok(diagnosis))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteDiagnosis(@PathVariable Long id) {
        if (diagnosisService.deleteDiagnosis(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
