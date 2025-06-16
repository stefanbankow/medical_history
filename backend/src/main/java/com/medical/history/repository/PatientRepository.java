package com.medical.history.repository;

import com.medical.history.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    
    Optional<Patient> findByEgn(String egn);
    
    List<Patient> findByFamilyDoctorId(Long familyDoctorId);
    
    @Query("SELECT p FROM Patient p " +
           "JOIN p.medicalVisits mv " +
           "WHERE mv.diagnosis.id = :diagnosisId")
    List<Patient> findByDiagnosisId(@Param("diagnosisId") Long diagnosisId);
    
    @Query("SELECT p FROM Patient p " +
           "JOIN p.medicalVisits mv " +
           "WHERE mv.diagnosis.code = :diagnosisCode")
    List<Patient> findByDiagnosisCode(@Param("diagnosisCode") String diagnosisCode);
    
    @Query("SELECT COUNT(p) FROM Patient p WHERE p.familyDoctor.id = :doctorId")
    Long countByFamilyDoctorId(@Param("doctorId") Long doctorId);
}
