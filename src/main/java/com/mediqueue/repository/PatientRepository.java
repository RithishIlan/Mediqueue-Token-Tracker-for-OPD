package com.mediqueue.repository;

import com.mediqueue.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    @Query("SELECT MAX(p.tokenNumber) FROM Patient p")
    Optional<Integer> findMaxTokenNumber();
}
