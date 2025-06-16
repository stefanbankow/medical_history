package com.medical.history.repository;

import com.medical.history.entity.Diagnosis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DiagnosisRepository extends JpaRepository<Diagnosis, Long> {
    
    Optional<Diagnosis> findByCode(String code);
    
    List<Diagnosis> findByNameContainingIgnoreCase(String name);
    
    @Query("SELECT d, COUNT(mv) as visitCount FROM Diagnosis d " +
           "LEFT JOIN d.medicalVisits mv " +
           "GROUP BY d " +
           "ORDER BY COUNT(mv) DESC")
    List<Object[]> findDiagnosesWithVisitCount();
    
    @Query("SELECT d FROM Diagnosis d " +
           "LEFT JOIN d.medicalVisits mv " +
           "GROUP BY d " +
           "ORDER BY COUNT(mv) DESC")
    List<Diagnosis> findMostCommonDiagnoses();
}
