package com.medical.history.service;

import com.medical.history.dto.MedicalVisitDto;
import com.medical.history.entity.Doctor;
import com.medical.history.entity.Diagnosis;
import com.medical.history.entity.MedicalVisit;
import com.medical.history.entity.Patient;
import com.medical.history.repository.DiagnosisRepository;
import com.medical.history.repository.DoctorRepository;
import com.medical.history.repository.MedicalVisitRepository;
import com.medical.history.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MedicalVisitService {
    
    private final MedicalVisitRepository medicalVisitRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final DiagnosisRepository diagnosisRepository;
    
    public List<MedicalVisitDto> getAllMedicalVisits() {
        return medicalVisitRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public Optional<MedicalVisitDto> getMedicalVisitById(Long id) {
        return medicalVisitRepository.findById(id)
                .map(this::convertToDto);
    }
    
    public List<MedicalVisitDto> getMedicalVisitsByPatient(Long patientId) {
        return medicalVisitRepository.findByPatientId(patientId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<MedicalVisitDto> getMedicalVisitsByDoctor(Long doctorId) {
        return medicalVisitRepository.findByDoctorId(doctorId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<MedicalVisitDto> getMedicalVisitsByDateRange(LocalDate startDate, LocalDate endDate) {
        return medicalVisitRepository.findByVisitDateBetween(startDate, endDate).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<MedicalVisitDto> getMedicalVisitsByDoctorAndDateRange(Long doctorId, LocalDate startDate, LocalDate endDate) {
        return medicalVisitRepository.findByDoctorIdAndVisitDateBetween(doctorId, startDate, endDate).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public MedicalVisitDto createMedicalVisit(MedicalVisitDto visitDto) {
        MedicalVisit visit = convertToEntity(visitDto);
        MedicalVisit savedVisit = medicalVisitRepository.save(visit);
        return convertToDto(savedVisit);
    }
    
    public Optional<MedicalVisitDto> updateMedicalVisit(Long id, MedicalVisitDto visitDto) {
        return medicalVisitRepository.findById(id)
                .map(existingVisit -> {
                    existingVisit.setVisitDate(visitDto.getVisitDate());
                    existingVisit.setVisitTime(visitDto.getVisitTime());
                    existingVisit.setSymptoms(visitDto.getSymptoms());
                    existingVisit.setTreatment(visitDto.getTreatment());
                    existingVisit.setPrescribedMedication(visitDto.getPrescribedMedication());
                    existingVisit.setNotes(visitDto.getNotes());
                    
                    if (visitDto.getPatientId() != null) {
                        Patient patient = patientRepository.findById(visitDto.getPatientId())
                                .orElseThrow(() -> new RuntimeException("Patient not found"));
                        existingVisit.setPatient(patient);
                    }
                    
                    if (visitDto.getDoctorId() != null) {
                        Doctor doctor = doctorRepository.findById(visitDto.getDoctorId())
                                .orElseThrow(() -> new RuntimeException("Doctor not found"));
                        existingVisit.setDoctor(doctor);
                    }
                    
                    if (visitDto.getDiagnosisId() != null) {
                        Diagnosis diagnosis = diagnosisRepository.findById(visitDto.getDiagnosisId())
                                .orElseThrow(() -> new RuntimeException("Diagnosis not found"));
                        existingVisit.setDiagnosis(diagnosis);
                    }
                    
                    return convertToDto(medicalVisitRepository.save(existingVisit));
                });
    }
    
    public boolean deleteMedicalVisit(Long id) {
        if (medicalVisitRepository.existsById(id)) {
            medicalVisitRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    private MedicalVisitDto convertToDto(MedicalVisit visit) {
        MedicalVisitDto dto = new MedicalVisitDto();
        dto.setId(visit.getId());
        dto.setVisitDate(visit.getVisitDate());
        dto.setVisitTime(visit.getVisitTime());
        dto.setSymptoms(visit.getSymptoms());
        dto.setTreatment(visit.getTreatment());
        dto.setPrescribedMedication(visit.getPrescribedMedication());
        dto.setNotes(visit.getNotes());
        
        if (visit.getPatient() != null) {
            dto.setPatientId(visit.getPatient().getId());
            dto.setPatientName(visit.getPatient().getName());
        }
        
        if (visit.getDoctor() != null) {
            dto.setDoctorId(visit.getDoctor().getId());
            dto.setDoctorName(visit.getDoctor().getName());
        }
        
        if (visit.getDiagnosis() != null) {
            dto.setDiagnosisId(visit.getDiagnosis().getId());
            dto.setDiagnosisName(visit.getDiagnosis().getName());
        }
        
        return dto;
    }
    
    private MedicalVisit convertToEntity(MedicalVisitDto dto) {
        MedicalVisit visit = new MedicalVisit();
        visit.setVisitDate(dto.getVisitDate());
        visit.setVisitTime(dto.getVisitTime());
        visit.setSymptoms(dto.getSymptoms());
        visit.setTreatment(dto.getTreatment());
        visit.setPrescribedMedication(dto.getPrescribedMedication());
        visit.setNotes(dto.getNotes());
        
        if (dto.getPatientId() != null) {
            Patient patient = patientRepository.findById(dto.getPatientId())
                    .orElseThrow(() -> new RuntimeException("Patient not found"));
            visit.setPatient(patient);
        }
        
        if (dto.getDoctorId() != null) {
            Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));
            visit.setDoctor(doctor);
        }
        
        if (dto.getDiagnosisId() != null) {
            Diagnosis diagnosis = diagnosisRepository.findById(dto.getDiagnosisId())
                    .orElseThrow(() -> new RuntimeException("Diagnosis not found"));
            visit.setDiagnosis(diagnosis);
        }
        
        return visit;
    }
}
