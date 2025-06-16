package com.medical.history.service;

import com.medical.history.dto.PatientDto;
import com.medical.history.entity.Doctor;
import com.medical.history.entity.Patient;
import com.medical.history.repository.DoctorRepository;
import com.medical.history.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PatientService {
    
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    
    public List<PatientDto> getAllPatients() {
        return patientRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public Optional<PatientDto> getPatientById(Long id) {
        return patientRepository.findById(id)
                .map(this::convertToDto);
    }
    
    public Optional<PatientDto> getPatientByEgn(String egn) {
        return patientRepository.findByEgn(egn)
                .map(this::convertToDto);
    }
    
    public List<PatientDto> getPatientsByFamilyDoctor(Long familyDoctorId) {
        return patientRepository.findByFamilyDoctorId(familyDoctorId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<PatientDto> getPatientsByDiagnosis(Long diagnosisId) {
        return patientRepository.findByDiagnosisId(diagnosisId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public PatientDto createPatient(PatientDto patientDto) {
        Patient patient = convertToEntity(patientDto);
        Patient savedPatient = patientRepository.save(patient);
        return convertToDto(savedPatient);
    }
    
    public Optional<PatientDto> updatePatient(Long id, PatientDto patientDto) {
        return patientRepository.findById(id)
                .map(existingPatient -> {
                    existingPatient.setName(patientDto.getName());
                    existingPatient.setEgn(patientDto.getEgn());
                    existingPatient.setHealthInsurancePaid(patientDto.getHealthInsurancePaid());
                    existingPatient.setLastInsurancePaymentDate(patientDto.getLastInsurancePaymentDate());
                    
                    if (patientDto.getFamilyDoctorId() != null) {
                        Doctor familyDoctor = doctorRepository.findById(patientDto.getFamilyDoctorId())
                                .orElseThrow(() -> new RuntimeException("Family doctor not found"));
                        existingPatient.setFamilyDoctor(familyDoctor);
                    }
                    
                    return convertToDto(patientRepository.save(existingPatient));
                });
    }
    
    public boolean deletePatient(Long id) {
        if (patientRepository.existsById(id)) {
            patientRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    private PatientDto convertToDto(Patient patient) {
        PatientDto dto = new PatientDto();
        dto.setId(patient.getId());
        dto.setName(patient.getName());
        dto.setEgn(patient.getEgn());
        dto.setHealthInsurancePaid(patient.getHealthInsurancePaid());
        dto.setLastInsurancePaymentDate(patient.getLastInsurancePaymentDate());
        dto.setHealthInsuranceValid(patient.isHealthInsuranceValid());
        
        if (patient.getFamilyDoctor() != null) {
            dto.setFamilyDoctorId(patient.getFamilyDoctor().getId());
            dto.setFamilyDoctorName(patient.getFamilyDoctor().getName());
        }
        
        return dto;
    }
    
    private Patient convertToEntity(PatientDto dto) {
        Patient patient = new Patient();
        patient.setName(dto.getName());
        patient.setEgn(dto.getEgn());
        patient.setHealthInsurancePaid(dto.getHealthInsurancePaid());
        patient.setLastInsurancePaymentDate(dto.getLastInsurancePaymentDate());
        
        if (dto.getFamilyDoctorId() != null) {
            Doctor familyDoctor = doctorRepository.findById(dto.getFamilyDoctorId())
                    .orElseThrow(() -> new RuntimeException("Family doctor not found"));
            patient.setFamilyDoctor(familyDoctor);
        }
        
        return patient;
    }
}
