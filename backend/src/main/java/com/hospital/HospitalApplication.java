package com.hospital;

import com.hospital.entity.*;
import com.hospital.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@SpringBootApplication
public class HospitalApplication {

    public static void main(String[] args) {
        SpringApplication.run(HospitalApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(UserRepository userRepository,
                                     DepartmentRepository departmentRepository,
                                     DoctorRepository doctorRepository,
                                     PatientRepository patientRepository,
                                     AppointmentRepository appointmentRepository,
                                     BillRepository billRepository,
                                     PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                // Seed Users
                User admin = new User(null, "admin", passwordEncoder.encode("admin123"), "System Administrator", "admin@hospital.com", "ADMIN");
                User doctorUser = new User(null, "dr_sarah", passwordEncoder.encode("doctor123"), "Dr. Sarah Jenkins", "sarah.jenkins@hospital.com", "DOCTOR");
                User patientUser = new User(null, "john_doe", passwordEncoder.encode("patient123"), "John Doe", "john.doe@example.com", "PATIENT");
                userRepository.saveAll(List.of(admin, doctorUser, patientUser));

                // Seed Departments
                Department cardiology = departmentRepository.save(new Department(null, "Cardiology", "Heart and cardiovascular system care"));
                Department neurology = departmentRepository.save(new Department(null, "Neurology", "Brain, spinal cord and nervous system"));
                Department pediatrics = departmentRepository.save(new Department(null, "Pediatrics", "Medical care for infants, children, and adolescents"));
                Department orthopedics = departmentRepository.save(new Department(null, "Orthopedics", "Musculoskeletal system, joints, and bones"));
                Department generalMed = departmentRepository.save(new Department(null, "General Medicine", "Primary adult healthcare and internal medicine"));

                // Seed Doctors
                Doctor doc1 = doctorRepository.save(new Doctor(null, "Sarah", "Jenkins", "sarah.jenkins@hospital.com", "+1-555-0101",
                        "Cardiologist", cardiology, "MD, FACC - Harvard Medical", 12, 1200.0));
                Doctor doc2 = doctorRepository.save(new Doctor(null, "Marcus", "Vance", "marcus.vance@hospital.com", "+1-555-0102",
                        "Neurologist", neurology, "MD, PhD - Johns Hopkins", 15, 1500.0));
                Doctor doc3 = doctorRepository.save(new Doctor(null, "Elena", "Rostova", "elena.rostova@hospital.com", "+1-555-0103",
                        "Pediatrician", pediatrics, "MD - Stanford University", 8, 800.0));
                Doctor doc4 = doctorRepository.save(new Doctor(null, "David", "Kim", "david.kim@hospital.com", "+1-555-0104",
                        "Orthopedic Surgeon", orthopedics, "MS, FRCS - Oxford", 10, 1000.0));

                // Seed Patients
                Patient pat1 = patientRepository.save(new Patient(null, "John", "Doe", "john.doe@example.com", "+1-555-1101",
                        LocalDate.of(1985, 4, 12), "Male", "O+", "742 Evergreen Terrace, Springfield", "Hypertension diagnosed 2021"));
                Patient pat2 = patientRepository.save(new Patient(null, "Emily", "Watson", "emily.watson@example.com", "+1-555-1102",
                        LocalDate.of(1992, 9, 23), "Female", "A+", "104 Maple Street, Seattle", "Mild seasonal asthma"));
                Patient pat3 = patientRepository.save(new Patient(null, "Robert", "Chen", "robert.chen@example.com", "+1-555-1103",
                        LocalDate.of(1978, 1, 30), "Male", "B-", "55 Broadway Ave, New York", "No chronic conditions"));
                Patient pat4 = patientRepository.save(new Patient(null, "Sophia", "Martinez", "sophia.m@example.com", "+1-555-1104",
                        LocalDate.of(2018, 6, 15), "Female", "AB+", "88 Sunset Blvd, Los Angeles", "Child routine vaccination up to date"));

                // Seed Appointments
                Appointment apt1 = appointmentRepository.save(new Appointment(null, pat1, doc1,
                        LocalDateTime.now().plusDays(1).withHour(10).withMinute(0),
                        "CONFIRMED", "Regular cardiac follow-up", "Patient to bring recent ECG"));
                Appointment apt2 = appointmentRepository.save(new Appointment(null, pat2, doc3,
                        LocalDateTime.now().plusDays(2).withHour(14).withMinute(30),
                        "PENDING", "Allergy checkup and inhaler review", "First visit to clinic"));
                Appointment apt3 = appointmentRepository.save(new Appointment(null, pat3, doc2,
                        LocalDateTime.now().minusDays(1).withHour(11).withMinute(15),
                        "COMPLETED", "Persistent migraine evaluation", "MRI advised"));

                // Seed Bills
                billRepository.save(new Bill(null, pat1, apt1, LocalDate.now(), 1200.0, 100.0, 1100.0, "PAID", "Card"));
                billRepository.save(new Bill(null, pat2, apt2, LocalDate.now(), 800.0, 0.0, 0.0, "UNPAID", "Cash"));
                billRepository.save(new Bill(null, pat3, apt3, LocalDate.now().minusDays(1), 1500.0, 200.0, 1300.0, "PAID", "UPI"));

                System.out.println(">>> Sample Hospital Data initialized successfully! <<<");
                System.out.println(">>> Default Admin: admin / admin123 <<<");
                System.out.println(">>> Default Doctor: dr_sarah / doctor123 <<<");
                System.out.println(">>> Default Patient: john_doe / patient123 <<<");
            }
        };
    }
}
