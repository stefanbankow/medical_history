package com.medical.history.repository;

import com.medical.history.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    
    Optional<Doctor> findByIdentificationNumber(String identificationNumber);
    
    List<Doctor> findByIsFamilyDoctorTrue();
    
    List<Doctor> findBySpecialty(String specialty);
    
    @Query("SELECT d FROM Doctor d LEFT JOIN d.patients p GROUP BY d ORDER BY COUNT(p) DESC")
    List<Doctor> findDoctorsOrderedByPatientCount();
    
    @Query("SELECT d FROM Doctor d LEFT JOIN d.medicalVisits mv GROUP BY d ORDER BY COUNT(mv) DESC")
    List<Doctor> findDoctorsOrderedByVisitCount();
    
    @Query("SELECT d, COUNT(sl) as sickLeaveCount FROM Doctor d " +
           "LEFT JOIN d.medicalVisits mv " +
           "LEFT JOIN mv.sickLeave sl " +
           "GROUP BY d " +
           "ORDER BY COUNT(sl) DESC")
    List<Object[]> findDoctorsWithSickLeaveCount();
}
