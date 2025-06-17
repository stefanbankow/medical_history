package com.medical.history.service;

import com.medical.history.dto.SickLeaveDto;
import com.medical.history.entity.MedicalVisit;
import com.medical.history.entity.SickLeave;
import com.medical.history.repository.MedicalVisitRepository;
import com.medical.history.repository.SickLeaveRepository;
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
public class SickLeaveService {
    
    private final SickLeaveRepository sickLeaveRepository;
    private final MedicalVisitRepository medicalVisitRepository;
    
    public List<SickLeaveDto> getAllSickLeaves() {
        return sickLeaveRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public Optional<SickLeaveDto> getSickLeaveById(Long id) {
        return sickLeaveRepository.findById(id)
                .map(this::convertToDto);
    }
    
    public List<SickLeaveDto> getSickLeavesByPatient(Long patientId) {
        return sickLeaveRepository.findByMedicalVisitPatientId(patientId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<SickLeaveDto> getSickLeavesByDoctor(Long doctorId) {
        return sickLeaveRepository.findByMedicalVisitDoctorId(doctorId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<SickLeaveDto> getSickLeavesByDateRange(LocalDate startDate, LocalDate endDate) {
        return sickLeaveRepository.findByStartDateBetween(startDate, endDate).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public SickLeaveDto createSickLeave(SickLeaveDto sickLeaveDto) {
        SickLeave sickLeave = convertToEntity(sickLeaveDto);
        SickLeave savedSickLeave = sickLeaveRepository.save(sickLeave);
        return convertToDto(savedSickLeave);
    }
    
    public Optional<SickLeaveDto> updateSickLeave(Long id, SickLeaveDto sickLeaveDto) {
        return sickLeaveRepository.findById(id)
                .map(existingSickLeave -> {
                    existingSickLeave.setStartDate(sickLeaveDto.getStartDate());
                    existingSickLeave.setDurationDays(sickLeaveDto.getDurationDays());
                    existingSickLeave.setReason(sickLeaveDto.getReason());
                    
                    if (sickLeaveDto.getMedicalVisitId() != null) {
                        MedicalVisit medicalVisit = medicalVisitRepository.findById(sickLeaveDto.getMedicalVisitId())
                                .orElseThrow(() -> new RuntimeException("Medical visit not found"));
                        existingSickLeave.setMedicalVisit(medicalVisit);
                    }
                    
                    return convertToDto(sickLeaveRepository.save(existingSickLeave));
                });
    }
    
    public boolean deleteSickLeave(Long id) {
        if (sickLeaveRepository.existsById(id)) {
            sickLeaveRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    private SickLeaveDto convertToDto(SickLeave sickLeave) {
        SickLeaveDto dto = new SickLeaveDto();
        dto.setId(sickLeave.getId());
        dto.setStartDate(sickLeave.getStartDate());
        dto.setDurationDays(sickLeave.getDurationDays());
        dto.setEndDate(sickLeave.getEndDate());
        dto.setReason(sickLeave.getReason());
        
        if (sickLeave.getMedicalVisit() != null) {
            dto.setMedicalVisitId(sickLeave.getMedicalVisit().getId());
        }
        
        return dto;
    }
    
    private SickLeave convertToEntity(SickLeaveDto dto) {
        SickLeave sickLeave = new SickLeave();
        sickLeave.setStartDate(dto.getStartDate());
        sickLeave.setDurationDays(dto.getDurationDays());
        sickLeave.setReason(dto.getReason());
        
        if (dto.getMedicalVisitId() != null) {
            MedicalVisit medicalVisit = medicalVisitRepository.findById(dto.getMedicalVisitId())
                    .orElseThrow(() -> new RuntimeException("Medical visit not found"));
            sickLeave.setMedicalVisit(medicalVisit);
        }
        
        return sickLeave;
    }
}
