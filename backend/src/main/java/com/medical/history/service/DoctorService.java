package com.medical.history.service;

import com.medical.history.dto.DoctorDto;
import com.medical.history.entity.Doctor;
import com.medical.history.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DoctorService {
    
    private final DoctorRepository doctorRepository;
    
    public List<DoctorDto> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public Optional<DoctorDto> getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .map(this::convertToDto);
    }
    
    public Optional<DoctorDto> getDoctorByIdentificationNumber(String identificationNumber) {
        return doctorRepository.findByIdentificationNumber(identificationNumber)
                .map(this::convertToDto);
    }
    
    public List<DoctorDto> getFamilyDoctors() {
        return doctorRepository.findByIsFamilyDoctorTrue().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<DoctorDto> getDoctorsBySpecialty(String specialty) {
        return doctorRepository.findBySpecialty(specialty).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public DoctorDto createDoctor(DoctorDto doctorDto) {
        Doctor doctor = convertToEntity(doctorDto);
        Doctor savedDoctor = doctorRepository.save(doctor);
        return convertToDto(savedDoctor);
    }
    
    public Optional<DoctorDto> updateDoctor(Long id, DoctorDto doctorDto) {
        return doctorRepository.findById(id)
                .map(existingDoctor -> {
                    existingDoctor.setIdentificationNumber(doctorDto.getIdentificationNumber());
                    existingDoctor.setName(doctorDto.getName());
                    existingDoctor.setSpecialty(doctorDto.getSpecialty());
                    existingDoctor.setIsFamilyDoctor(doctorDto.getIsFamilyDoctor());
                    return convertToDto(doctorRepository.save(existingDoctor));
                });
    }
    
    public boolean deleteDoctor(Long id) {
        if (doctorRepository.existsById(id)) {
            doctorRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public List<DoctorDto> getDoctorsOrderedByPatientCount() {
        return doctorRepository.findDoctorsOrderedByPatientCount().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<DoctorDto> getDoctorsOrderedByVisitCount() {
        return doctorRepository.findDoctorsOrderedByVisitCount().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    private DoctorDto convertToDto(Doctor doctor) {
        DoctorDto dto = new DoctorDto();
        dto.setId(doctor.getId());
        dto.setIdentificationNumber(doctor.getIdentificationNumber());
        dto.setName(doctor.getName());
        dto.setSpecialty(doctor.getSpecialty());
        dto.setIsFamilyDoctor(doctor.getIsFamilyDoctor());
        dto.setPatientCount(doctor.getPatients().size());
        dto.setVisitCount(doctor.getMedicalVisits().size());
        return dto;
    }
    
    private Doctor convertToEntity(DoctorDto dto) {
        Doctor doctor = new Doctor();
        doctor.setIdentificationNumber(dto.getIdentificationNumber());
        doctor.setName(dto.getName());
        doctor.setSpecialty(dto.getSpecialty());
        doctor.setIsFamilyDoctor(dto.getIsFamilyDoctor());
        return doctor;
    }
}
