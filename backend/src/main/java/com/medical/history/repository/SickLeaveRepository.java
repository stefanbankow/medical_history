package com.medical.history.repository;

import com.medical.history.entity.SickLeave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SickLeaveRepository extends JpaRepository<SickLeave, Long> {
    
    List<SickLeave> findByMedicalVisitPatientId(Long patientId);
    
    List<SickLeave> findByMedicalVisitDoctorId(Long doctorId);
    
    @Query("SELECT sl FROM SickLeave sl WHERE sl.startDate BETWEEN :startDate AND :endDate")
    List<SickLeave> findByStartDateBetween(@Param("startDate") LocalDate startDate, 
                                           @Param("endDate") LocalDate endDate);
    
    @Query("SELECT EXTRACT(MONTH FROM sl.startDate) as month, COUNT(sl) as count " +
           "FROM SickLeave sl " +
           "GROUP BY EXTRACT(MONTH FROM sl.startDate) " +
           "ORDER BY COUNT(sl) DESC")
    List<Object[]> findSickLeaveCountByMonth();
    
    @Query("SELECT sl.medicalVisit.doctor, COUNT(sl) as sickLeaveCount " +
           "FROM SickLeave sl " +
           "GROUP BY sl.medicalVisit.doctor " +
           "ORDER BY COUNT(sl) DESC")
    List<Object[]> findDoctorsWithMostSickLeaves();
    
    @Query("SELECT EXTRACT(MONTH FROM sl.startDate) as month, " +
           "EXTRACT(YEAR FROM sl.startDate) as year, COUNT(sl) as count " +
           "FROM SickLeave sl " +
           "GROUP BY EXTRACT(MONTH FROM sl.startDate), EXTRACT(YEAR FROM sl.startDate) " +
           "ORDER BY COUNT(sl) DESC")
    List<Object[]> findSickLeaveCountsByMonth();
    
    @Query("SELECT sl.medicalVisit.doctor, COUNT(sl) as count " +
           "FROM SickLeave sl " +
           "GROUP BY sl.medicalVisit.doctor " +
           "ORDER BY COUNT(sl) DESC")
    List<Object[]> findDoctorSickLeaveCounts();
    
    @Query("SELECT sl.medicalVisit.doctor, COUNT(sl), SUM(sl.durationDays), AVG(sl.durationDays) " +
           "FROM SickLeave sl " +
           "GROUP BY sl.medicalVisit.doctor " +
           "ORDER BY COUNT(sl) DESC")
    List<Object[]> findDoctorSickLeaveStatistics();
    
    @Query("SELECT EXTRACT(MONTH FROM sl.startDate) as month, " +
           "EXTRACT(YEAR FROM sl.startDate) as year, " +
           "COUNT(sl) as count, SUM(sl.durationDays) as totalDays, AVG(sl.durationDays) as avgDays " +
           "FROM SickLeave sl " +
           "GROUP BY EXTRACT(MONTH FROM sl.startDate), EXTRACT(YEAR FROM sl.startDate) " +
           "ORDER BY year DESC, month DESC")
    List<Object[]> findSickLeaveMonthlyStatistics();
}
