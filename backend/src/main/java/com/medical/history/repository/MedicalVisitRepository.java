package com.medical.history.repository;

import com.medical.history.entity.MedicalVisit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MedicalVisitRepository extends JpaRepository<MedicalVisit, Long> {
    
    List<MedicalVisit> findByPatientId(Long patientId);
    
    List<MedicalVisit> findByDoctorId(Long doctorId);
    
    List<MedicalVisit> findByPatientIdOrderByVisitDateDesc(Long patientId);
    
    List<MedicalVisit> findByDoctorIdOrderByVisitDateDesc(Long doctorId);
    
    @Query("SELECT mv FROM MedicalVisit mv WHERE mv.visitDate BETWEEN :startDate AND :endDate")
    List<MedicalVisit> findByVisitDateBetween(@Param("startDate") LocalDate startDate, 
                                              @Param("endDate") LocalDate endDate);
    
    @Query("SELECT mv FROM MedicalVisit mv WHERE mv.doctor.id = :doctorId " +
           "AND mv.visitDate BETWEEN :startDate AND :endDate")
    List<MedicalVisit> findByDoctorIdAndVisitDateBetween(@Param("doctorId") Long doctorId,
                                                         @Param("startDate") LocalDate startDate,
                                                         @Param("endDate") LocalDate endDate);
    
    @Query("SELECT COUNT(mv) FROM MedicalVisit mv WHERE mv.doctor.id = :doctorId")
    Long countByDoctorId(@Param("doctorId") Long doctorId);
    
    @Query("SELECT mv FROM MedicalVisit mv WHERE mv.diagnosis.id = :diagnosisId")
    List<MedicalVisit> findByDiagnosisId(@Param("diagnosisId") Long diagnosisId);
    
    @Query("SELECT mv.diagnosis, COUNT(mv) FROM MedicalVisit mv " +
           "WHERE mv.diagnosis IS NOT NULL " +
           "GROUP BY mv.diagnosis " +
           "ORDER BY COUNT(mv) DESC")
    List<Object[]> findDiagnosisCountReport();
    
    @Query("SELECT mv.doctor, COUNT(mv) FROM MedicalVisit mv " +
           "GROUP BY mv.doctor " +
           "ORDER BY COUNT(mv) DESC")
    List<Object[]> findDoctorVisitCounts();
    
    @Query("SELECT mv.patient, COUNT(mv) as visitCount FROM MedicalVisit mv " +
           "GROUP BY mv.patient " +
           "ORDER BY COUNT(mv) DESC")
    List<Object[]> findPatientVisitCounts();
    
    @Query("SELECT EXTRACT(HOUR FROM mv.visitTime) as hour, COUNT(mv) as count " +
           "FROM MedicalVisit mv " +
           "WHERE mv.visitTime IS NOT NULL " +
           "GROUP BY EXTRACT(HOUR FROM mv.visitTime) " +
           "ORDER BY COUNT(mv) DESC")
    List<Object[]> findPeakVisitHours();
    
    @Query("SELECT mv.visitDate, COUNT(mv), " +
           "COUNT(DISTINCT mv.patient), COUNT(DISTINCT mv.doctor) " +
           "FROM MedicalVisit mv " +
           "WHERE mv.visitDate BETWEEN :startDate AND :endDate " +
           "GROUP BY mv.visitDate " +
           "ORDER BY mv.visitDate")
    List<Object[]> findVisitStatsByDateRange(@Param("startDate") LocalDate startDate,
                                             @Param("endDate") LocalDate endDate);
}
