package com.medical.history.service;

import com.medical.history.dto.DiagnosisDto;
import com.medical.history.entity.Diagnosis;
import com.medical.history.repository.DiagnosisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DiagnosisService {
    
    private final DiagnosisRepository diagnosisRepository;
    
    public List<DiagnosisDto> getAllDiagnoses() {
        return diagnosisRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public Optional<DiagnosisDto> getDiagnosisById(Long id) {
        return diagnosisRepository.findById(id)
                .map(this::convertToDto);
    }
    
    public Optional<DiagnosisDto> getDiagnosisByCode(String code) {
        return diagnosisRepository.findByCode(code)
                .map(this::convertToDto);
    }
    
    public List<DiagnosisDto> searchDiagnosesByName(String name) {
        return diagnosisRepository.findByNameContainingIgnoreCase(name).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public DiagnosisDto createDiagnosis(DiagnosisDto diagnosisDto) {
        Diagnosis diagnosis = convertToEntity(diagnosisDto);
        Diagnosis savedDiagnosis = diagnosisRepository.save(diagnosis);
        return convertToDto(savedDiagnosis);
    }
    
    public Optional<DiagnosisDto> updateDiagnosis(Long id, DiagnosisDto diagnosisDto) {
        return diagnosisRepository.findById(id)
                .map(existingDiagnosis -> {
                    existingDiagnosis.setCode(diagnosisDto.getCode());
                    existingDiagnosis.setName(diagnosisDto.getName());
                    existingDiagnosis.setDescription(diagnosisDto.getDescription());
                    return convertToDto(diagnosisRepository.save(existingDiagnosis));
                });
    }
    
    public boolean deleteDiagnosis(Long id) {
        if (diagnosisRepository.existsById(id)) {
            diagnosisRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    private DiagnosisDto convertToDto(Diagnosis diagnosis) {
        DiagnosisDto dto = new DiagnosisDto();
        dto.setId(diagnosis.getId());
        dto.setCode(diagnosis.getCode());
        dto.setName(diagnosis.getName());
        dto.setDescription(diagnosis.getDescription());
        return dto;
    }
    
    private Diagnosis convertToEntity(DiagnosisDto dto) {
        Diagnosis diagnosis = new Diagnosis();
        diagnosis.setCode(dto.getCode());
        diagnosis.setName(dto.getName());
        diagnosis.setDescription(dto.getDescription());
        return diagnosis;
    }
}
