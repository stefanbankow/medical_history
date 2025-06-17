package com.medical.history.controller;

import com.medical.history.dto.MedicalVisitDto;
import com.medical.history.dto.PatientDto;
import com.medical.history.service.ReportsService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class ReportsController {
    
    private final ReportsService reportsService;
    
    // 3a. Списък с пациенти, с дадена диагноза
    @GetMapping("/patients-by-diagnosis/{diagnosisId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<List<PatientDto>> getPatientsByDiagnosis(@PathVariable Long diagnosisId) {
        List<PatientDto> patients = reportsService.getPatientsByDiagnosis(diagnosisId);
        return ResponseEntity.ok(patients);
    }
    
    // 3b. Най-често диагностицирани диагнози
    @GetMapping("/most-common-diagnoses")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<List<ReportsService.DiagnosisReport>> getMostCommonDiagnoses() {
        List<ReportsService.DiagnosisReport> reports = reportsService.getMostCommonDiagnoses();
        return ResponseEntity.ok(reports);
    }
    
    // 3c. Списък с пациенти, които имат даден личен лекар
    @GetMapping("/patients-by-family-doctor/{doctorId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<List<PatientDto>> getPatientsByFamilyDoctor(@PathVariable Long doctorId) {
        List<PatientDto> patients = reportsService.getPatientsByFamilyDoctor(doctorId);
        return ResponseEntity.ok(patients);
    }
    
    // 3d. Брой на пациентите, записани при всеки от личните лекари
    @GetMapping("/family-doctor-patient-counts")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<List<ReportsService.DoctorPatientCountReport>> getFamilyDoctorPatientCounts() {
        List<ReportsService.DoctorPatientCountReport> reports = reportsService.getFamilyDoctorPatientCounts();
        return ResponseEntity.ok(reports);
    }
    
    // 3e. Брой посещения при всеки от лекарите
    @GetMapping("/doctor-visit-counts")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<List<ReportsService.DoctorVisitCountReport>> getDoctorVisitCounts() {
        List<ReportsService.DoctorVisitCountReport> reports = reportsService.getDoctorVisitCounts();
        return ResponseEntity.ok(reports);
    }
    
    // 3g. Списък на прегледите при всички лекари в даден период
    @GetMapping("/visits-by-date-range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<List<MedicalVisitDto>> getVisitsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<MedicalVisitDto> visits = reportsService.getVisitsByDateRange(startDate, endDate);
        return ResponseEntity.ok(visits);
    }
    
    // 3h. Списък на прегледите при определен лекар за даден период
    @GetMapping("/visits-by-doctor-and-date-range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<List<MedicalVisitDto>> getVisitsByDoctorAndDateRange(
            @RequestParam Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<MedicalVisitDto> visits = reportsService.getVisitsByDoctorAndDateRange(doctorId, startDate, endDate);
        return ResponseEntity.ok(visits);
    }
    
    // 3i. Месец в годината, в който са издадени най-много болнични
    @GetMapping("/month-most-sick-leaves")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<ReportsService.MonthlyReport> getMonthWithMostSickLeaves() {
        ReportsService.MonthlyReport report = reportsService.getMonthWithMostSickLeaves();
        return ResponseEntity.ok(report);
    }
    
    // 3j. Лекар/лекари, които са издали най-много болнични
    @GetMapping("/doctors-most-sick-leaves")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<List<ReportsService.DoctorSickLeaveReport>> getDoctorsWithMostSickLeaves() {
        List<ReportsService.DoctorSickLeaveReport> reports = reportsService.getDoctorsWithMostSickLeaves();
        return ResponseEntity.ok(reports);
    }
    
    // Additional useful reports
    @GetMapping("/sick-leaves-by-month")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<List<ReportsService.MonthlyReport>> getSickLeavesByMonth() {
        List<ReportsService.MonthlyReport> reports = reportsService.getSickLeavesByMonth();
        return ResponseEntity.ok(reports);
    }
    
    @GetMapping("/dashboard-stats")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<ReportsService.DashboardStats> getDashboardStats() {
        ReportsService.DashboardStats stats = reportsService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/patients-most-visits")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<List<ReportsService.PatientVisitReport>> getPatientsWithMostVisits() {
        List<ReportsService.PatientVisitReport> reports = reportsService.getPatientsWithMostVisits();
        return ResponseEntity.ok(reports);
    }
    
    @GetMapping("/insurance-stats")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<ReportsService.InsuranceStats> getInsuranceStats() {
        ReportsService.InsuranceStats stats = reportsService.getInsuranceStats();
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/sick-leaves-detailed-monthly")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<List<ReportsService.SickLeaveDetailedReport>> getDetailedSickLeavesByMonth() {
        List<ReportsService.SickLeaveDetailedReport> reports = reportsService.getDetailedSickLeavesByMonth();
        return ResponseEntity.ok(reports);
    }
    
    @GetMapping("/doctors-sick-leaves-detailed")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<List<ReportsService.DoctorSickLeaveDetailedReport>> getDetailedDoctorSickLeaveStats() {
        List<ReportsService.DoctorSickLeaveDetailedReport> reports = reportsService.getDetailedDoctorSickLeaveStats();
        return ResponseEntity.ok(reports);
    }
}
