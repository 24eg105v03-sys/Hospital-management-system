package com.hospital.service;

import com.hospital.entity.Appointment;
import com.hospital.entity.Doctor;
import com.hospital.entity.Medicine;
import com.hospital.entity.Patient;
import com.hospital.entity.Prescription;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.PatientRepository;
import com.hospital.repository.PrescriptionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;

    public PrescriptionService(PrescriptionRepository prescriptionRepository,
                               PatientRepository patientRepository,
                               DoctorRepository doctorRepository,
                               AppointmentRepository appointmentRepository) {
        this.prescriptionRepository = prescriptionRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    public Optional<Prescription> getPrescriptionById(Long id) {
        return prescriptionRepository.findById(id);
    }

    public Prescription createPrescription(Prescription prescription) {
        if (prescription.getPatient() != null && prescription.getPatient().getId() != null) {
            Patient patient = patientRepository.findById(prescription.getPatient().getId())
                    .orElseThrow(() -> new RuntimeException("Patient not found"));
            prescription.setPatient(patient);
        }

        if (prescription.getDoctor() != null && prescription.getDoctor().getId() != null) {
            Doctor doctor = doctorRepository.findById(prescription.getDoctor().getId())
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));
            prescription.setDoctor(doctor);
        }

        if (prescription.getAppointment() != null && prescription.getAppointment().getId() != null) {
            Appointment appointment = appointmentRepository.findById(prescription.getAppointment().getId()).orElse(null);
            prescription.setAppointment(appointment);
        }

        if (prescription.getMedicines() != null) {
            for (Medicine m : prescription.getMedicines()) {
                m.setPrescription(prescription);
            }
        }

        return prescriptionRepository.save(prescription);
    }

    public List<Prescription> getPrescriptionsByPatient(Long patientId) {
        return prescriptionRepository.findByPatientId(patientId);
    }

    public void deletePrescription(Long id) {
        prescriptionRepository.deleteById(id);
    }
}
