package com.hospital.service;

import com.hospital.entity.Appointment;
import com.hospital.entity.Bill;
import com.hospital.entity.Patient;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.BillRepository;
import com.hospital.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BillingService {

    private final BillRepository billRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;

    public BillingService(BillRepository billRepository,
                          PatientRepository patientRepository,
                          AppointmentRepository appointmentRepository) {
        this.billRepository = billRepository;
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    public Optional<Bill> getBillById(Long id) {
        return billRepository.findById(id);
    }

    public Bill createBill(Bill bill) {
        if (bill.getPatient() != null && bill.getPatient().getId() != null) {
            Patient patient = patientRepository.findById(bill.getPatient().getId())
                    .orElseThrow(() -> new RuntimeException("Patient not found"));
            bill.setPatient(patient);
        }

        if (bill.getAppointment() != null && bill.getAppointment().getId() != null) {
            Appointment appointment = appointmentRepository.findById(bill.getAppointment().getId()).orElse(null);
            bill.setAppointment(appointment);
        }

        if (bill.getPaymentStatus() == null || bill.getPaymentStatus().isBlank()) {
            if (bill.getPaidAmount() >= (bill.getTotalAmount() - (bill.getDiscount() != null ? bill.getDiscount() : 0.0))) {
                bill.setPaymentStatus("PAID");
            } else if (bill.getPaidAmount() > 0) {
                bill.setPaymentStatus("PARTIAL");
            } else {
                bill.setPaymentStatus("UNPAID");
            }
        }

        return billRepository.save(bill);
    }

    public Bill updatePaymentStatus(Long id, String status, Double paidAmount, String paymentMethod) {
        return billRepository.findById(id).map(bill -> {
            bill.setPaymentStatus(status.toUpperCase());
            if (paidAmount != null) {
                bill.setPaidAmount(paidAmount);
            }
            if (paymentMethod != null) {
                bill.setPaymentMethod(paymentMethod);
            }
            return billRepository.save(bill);
        }).orElseThrow(() -> new RuntimeException("Bill not found with id: " + id));
    }

    public List<Bill> getBillsByPatient(Long patientId) {
        return billRepository.findByPatientId(patientId);
    }

    public void deleteBill(Long id) {
        billRepository.deleteById(id);
    }

    public Double getTotalRevenue() {
        return billRepository.findAll().stream()
                .mapToDouble(Bill::getPaidAmount)
                .sum();
    }
}
