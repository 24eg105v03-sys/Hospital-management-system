package com.hospital.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "bills")
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    private LocalDate billDate = LocalDate.now();

    @Column(nullable = false)
    private Double totalAmount;

    private Double discount = 0.0;

    @Column(nullable = false)
    private Double paidAmount = 0.0;

    @Column(nullable = false)
    private String paymentStatus; // PAID, UNPAID, PARTIAL

    private String paymentMethod; // Cash, Card, UPI, Insurance

    public Bill() {
    }

    public Bill(Long id, Patient patient, Appointment appointment, LocalDate billDate,
                Double totalAmount, Double discount, Double paidAmount,
                String paymentStatus, String paymentMethod) {
        this.id = id;
        this.patient = patient;
        this.appointment = appointment;
        this.billDate = billDate != null ? billDate : LocalDate.now();
        this.totalAmount = totalAmount;
        this.discount = discount != null ? discount : 0.0;
        this.paidAmount = paidAmount != null ? paidAmount : 0.0;
        this.paymentStatus = paymentStatus;
        this.paymentMethod = paymentMethod;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public Appointment getAppointment() {
        return appointment;
    }

    public void setAppointment(Appointment appointment) {
        this.appointment = appointment;
    }

    public LocalDate getBillDate() {
        return billDate;
    }

    public void setBillDate(LocalDate billDate) {
        this.billDate = billDate;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Double getDiscount() {
        return discount;
    }

    public void setDiscount(Double discount) {
        this.discount = discount;
    }

    public Double getPaidAmount() {
        return paidAmount;
    }

    public void setPaidAmount(Double paidAmount) {
        this.paidAmount = paidAmount;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public Double getBalanceAmount() {
        return (totalAmount - (discount != null ? discount : 0.0)) - (paidAmount != null ? paidAmount : 0.0);
    }
}
