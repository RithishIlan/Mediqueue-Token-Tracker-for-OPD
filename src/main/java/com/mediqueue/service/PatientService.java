package com.mediqueue.service;

import com.mediqueue.entity.Patient;
import com.mediqueue.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    @Autowired
    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public Patient registerPatient(Patient patient) {
        // Auto-generate the next token in sequence
        int nextToken = patientRepository.findMaxTokenNumber().orElse(0) + 1;
        patient.setTokenNumber(nextToken);
        return patientRepository.save(patient);
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Optional<Patient> getPatientById(Long id) {
        return patientRepository.findById(id);
    }

    public Patient updatePatient(Long id, Patient patientDetails) {
        return patientRepository.findById(id).map(existingPatient -> {
            existingPatient.setName(patientDetails.getName());
            existingPatient.setAge(patientDetails.getAge());
            return patientRepository.save(existingPatient);
        }).orElseThrow(() -> new RuntimeException("Patient not found with id " + id));
    }

    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }
}
