package com.medical.history.controller;

import com.medical.history.dto.DoctorDto;
import com.medical.history.service.DoctorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
@Tag(name = "Doctor Management", description = "Doctor management APIs")
public class DoctorController {
    
    private final DoctorService doctorService;
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    @Operation(summary = "Get all doctors")
    public ResponseEntity<List<DoctorDto>> getAllDoctors() {
        List<DoctorDto> doctors = doctorService.getAllDoctors();
        return ResponseEntity.ok(doctors);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    @Operation(summary = "Get doctor by ID")
    public ResponseEntity<DoctorDto> getDoctorById(@PathVariable Long id) {
        return doctorService.getDoctorById(id)
                .map(doctor -> ResponseEntity.ok(doctor))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/identification/{identificationNumber}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    @Operation(summary = "Get doctor by identification number")
    public ResponseEntity<DoctorDto> getDoctorByIdentificationNumber(@PathVariable String identificationNumber) {
        return doctorService.getDoctorByIdentificationNumber(identificationNumber)
                .map(doctor -> ResponseEntity.ok(doctor))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/family-doctors")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('PATIENT')")
    @Operation(summary = "Get all family doctors")
    public ResponseEntity<List<DoctorDto>> getFamilyDoctors() {
        List<DoctorDto> familyDoctors = doctorService.getFamilyDoctors();
        return ResponseEntity.ok(familyDoctors);
    }
    
    @GetMapping("/specialty/{specialty}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    @Operation(summary = "Get doctors by specialty")
    public ResponseEntity<List<DoctorDto>> getDoctorsBySpecialty(@PathVariable String specialty) {
        List<DoctorDto> doctors = doctorService.getDoctorsBySpecialty(specialty);
        return ResponseEntity.ok(doctors);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new doctor")
    public ResponseEntity<DoctorDto> createDoctor(@Valid @RequestBody DoctorDto doctorDto) {
        DoctorDto createdDoctor = doctorService.createDoctor(doctorDto);
        return new ResponseEntity<>(createdDoctor, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update doctor")
    public ResponseEntity<DoctorDto> updateDoctor(@PathVariable Long id, @Valid @RequestBody DoctorDto doctorDto) {
        return doctorService.updateDoctor(id, doctorDto)
                .map(doctor -> ResponseEntity.ok(doctor))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete doctor")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Long id) {
        if (doctorService.deleteDoctor(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/stats/by-patient-count")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    @Operation(summary = "Get doctors ordered by patient count")
    public ResponseEntity<List<DoctorDto>> getDoctorsOrderedByPatientCount() {
        List<DoctorDto> doctors = doctorService.getDoctorsOrderedByPatientCount();
        return ResponseEntity.ok(doctors);
    }
    
    @GetMapping("/stats/by-visit-count")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    @Operation(summary = "Get doctors ordered by visit count")
    public ResponseEntity<List<DoctorDto>> getDoctorsOrderedByVisitCount() {
        List<DoctorDto> doctors = doctorService.getDoctorsOrderedByVisitCount();
        return ResponseEntity.ok(doctors);
    }
}
