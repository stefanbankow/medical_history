package com.medical.history.service;

import com.medical.history.dto.DiagnosisDto;
import com.medical.history.dto.DoctorDto;
import com.medical.history.dto.MedicalVisitDto;
import com.medical.history.dto.PatientDto;
import com.medical.history.entity.Diagnosis;
import com.medical.history.entity.Doctor;
import com.medical.history.entity.Patient;
import com.medical.history.repository.DoctorRepository;
import com.medical.history.repository.MedicalVisitRepository;
import com.medical.history.repository.PatientRepository;
import com.medical.history.repository.SickLeaveRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportsService {
    
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final MedicalVisitRepository medicalVisitRepository;
    private final SickLeaveRepository sickLeaveRepository;
    private final PatientService patientService;
    private final MedicalVisitService medicalVisitService;
    
    // 3a. Списък с пациенти, с дадена диагноза
    public List<PatientDto> getPatientsByDiagnosis(Long diagnosisId) {
        List<Patient> patients = patientRepository.findByDiagnosisId(diagnosisId);
        return patients.stream()
                .map(this::convertPatientToDto)
                .collect(Collectors.toList());
    }
    
    // 3b. Най-често диагностицирани диагнози
    public List<DiagnosisReport> getMostCommonDiagnoses() {
        List<Object[]> results = medicalVisitRepository.findDiagnosisCountReport();
        return results.stream()
                .map(result -> {
                    Diagnosis diagnosis = (Diagnosis) result[0];
                    Long count = (Long) result[1];
                    DiagnosisReport report = new DiagnosisReport();
                    report.setDiagnosis(convertDiagnosisToDto(diagnosis));
                    report.setPatientCount(count.intValue());
                    return report;
                })
                .collect(Collectors.toList());
    }
    
    // 3c. Списък с пациенти, които имат даден личен лекар
    public List<PatientDto> getPatientsByFamilyDoctor(Long doctorId) {
        return patientService.getPatientsByFamilyDoctor(doctorId);
    }
    
    // 3d. Брой на пациентите, записани при всеки от личните лекари
    public List<DoctorPatientCountReport> getFamilyDoctorPatientCounts() {
        List<Object[]> results = patientRepository.findFamilyDoctorPatientCounts();
        return results.stream()
                .map(result -> {
                    Doctor doctor = (Doctor) result[0];
                    Long count = (Long) result[1];
                    DoctorPatientCountReport report = new DoctorPatientCountReport();
                    report.setDoctor(convertDoctorToDto(doctor));
                    report.setPatientCount(count.intValue());
                    return report;
                })
                .collect(Collectors.toList());
    }
    
    // 3e. Брой посещения при всеки от лекарите
    public List<DoctorVisitCountReport> getDoctorVisitCounts() {
        List<Object[]> results = medicalVisitRepository.findDoctorVisitCounts();
        return results.stream()
                .map(result -> {
                    Doctor doctor = (Doctor) result[0];
                    Long count = (Long) result[1];
                    DoctorVisitCountReport report = new DoctorVisitCountReport();
                    report.setDoctor(convertDoctorToDto(doctor));
                    report.setVisitCount(count.intValue());
                    return report;
                })
                .collect(Collectors.toList());
    }
    
    // 3g. Списък на прегледите при всички лекари в даден период
    public List<MedicalVisitDto> getVisitsByDateRange(LocalDate startDate, LocalDate endDate) {
        return medicalVisitService.getMedicalVisitsByDateRange(startDate, endDate);
    }
    
    // 3h. Списък на прегледите при определен лекар за даден период
    public List<MedicalVisitDto> getVisitsByDoctorAndDateRange(Long doctorId, LocalDate startDate, LocalDate endDate) {
        return medicalVisitService.getMedicalVisitsByDoctorAndDateRange(doctorId, startDate, endDate);
    }
    
    // 3i. Месец в годината, в който са издадени най-много болнични
    public MonthlyReport getMonthWithMostSickLeaves() {
        List<Object[]> results = sickLeaveRepository.findSickLeaveCountsByMonth();
        if (results.isEmpty()) {
            return new MonthlyReport(0, 0, 0);
        }
        
        Object[] maxResult = results.get(0); // Assuming query orders by count DESC
        Integer month = (Integer) maxResult[0];
        Integer year = (Integer) maxResult[1];
        Long count = (Long) maxResult[2];
        
        return new MonthlyReport(month, year, count.intValue());
    }
    
    // 3j. Лекар/лекари, които са издали най-много болнични
    public List<DoctorSickLeaveReport> getDoctorsWithMostSickLeaves() {
        List<Object[]> results = sickLeaveRepository.findDoctorSickLeaveCounts();
        return results.stream()
                .map(result -> {
                    Doctor doctor = (Doctor) result[0];
                    Long count = (Long) result[1];
                    DoctorSickLeaveReport report = new DoctorSickLeaveReport();
                    report.setDoctor(convertDoctorToDto(doctor));
                    report.setSickLeaveCount(count.intValue());
                    return report;
                })
                .collect(Collectors.toList());
    }
    
    // Additional reports
    public List<MonthlyReport> getSickLeavesByMonth() {
        List<Object[]> results = sickLeaveRepository.findSickLeaveCountsByMonth();
        return results.stream()
                .map(result -> {
                    Integer month = (Integer) result[0];
                    Integer year = (Integer) result[1];
                    Long count = (Long) result[2];
                    return new MonthlyReport(month, year, count.intValue());
                })
                .collect(Collectors.toList());
    }
    
    public DashboardStats getDashboardStats() {
        long totalDoctors = doctorRepository.count();
        long totalPatients = patientRepository.count();
        long totalVisits = medicalVisitRepository.count();
        long totalSickLeaves = sickLeaveRepository.count();
        
        return new DashboardStats(
                (int) totalDoctors,
                (int) totalPatients,
                (int) totalVisits,
                (int) totalSickLeaves
        );
    }
    
    // Helper methods for DTO conversion
    private PatientDto convertPatientToDto(Patient patient) {
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
    
    private DoctorDto convertDoctorToDto(Doctor doctor) {
        DoctorDto dto = new DoctorDto();
        dto.setId(doctor.getId());
        dto.setIdentificationNumber(doctor.getIdentificationNumber());
        dto.setName(doctor.getName());
        dto.setSpecialty(doctor.getSpecialty());
        dto.setIsFamilyDoctor(doctor.getIsFamilyDoctor());
        return dto;
    }
    
    private DiagnosisDto convertDiagnosisToDto(Diagnosis diagnosis) {
        DiagnosisDto dto = new DiagnosisDto();
        dto.setId(diagnosis.getId());
        dto.setCode(diagnosis.getCode());
        dto.setName(diagnosis.getName());
        dto.setDescription(diagnosis.getDescription());
        return dto;
    }
    
    // Report DTOs
    @Data
    public static class DiagnosisReport {
        private DiagnosisDto diagnosis;
        private int patientCount;
    }
    
    @Data
    public static class DoctorPatientCountReport {
        private DoctorDto doctor;
        private int patientCount;
    }
    
    @Data
    public static class DoctorVisitCountReport {
        private DoctorDto doctor;
        private int visitCount;
    }
    
    @Data
    public static class MonthlyReport {
        private int month;
        private int year;
        private int count;
        
        public MonthlyReport(int month, int year, int count) {
            this.month = month;
            this.year = year;
            this.count = count;
        }
    }
    
    @Data
    public static class DoctorSickLeaveReport {
        private DoctorDto doctor;
        private int sickLeaveCount;
    }
    
    @Data
    public static class DashboardStats {
        private int totalDoctors;
        private int totalPatients;
        private int totalVisits;
        private int totalSickLeaves;
        
        public DashboardStats(int totalDoctors, int totalPatients, int totalVisits, int totalSickLeaves) {
            this.totalDoctors = totalDoctors;
            this.totalPatients = totalPatients;
            this.totalVisits = totalVisits;
            this.totalSickLeaves = totalSickLeaves;
        }
    }
}
