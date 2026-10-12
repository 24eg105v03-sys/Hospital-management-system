package com.hospital.controller;

import com.hospital.entity.Bill;
import com.hospital.service.BillingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/billing")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BillingController {

    private final BillingService billingService;

    public BillingController(BillingService billingService) {
        this.billingService = billingService;
    }

    @GetMapping
    public ResponseEntity<List<Bill>> getAllBills(@RequestParam(required = false) Long patientId) {
        if (patientId != null) {
            return ResponseEntity.ok(billingService.getBillsByPatient(patientId));
        }
        return ResponseEntity.ok(billingService.getAllBills());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bill> getBillById(@PathVariable Long id) {
        return billingService.getBillById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Bill> createBill(@RequestBody Bill bill) {
        return ResponseEntity.ok(billingService.createBill(bill));
    }

    @PatchMapping("/{id}/payment")
    public ResponseEntity<Bill> updatePayment(
            @PathVariable Long id,
            @RequestBody Map<String, Object> paymentData) {
        String status = (String) paymentData.get("status");
        Double paidAmount = paymentData.get("paidAmount") != null 
                ? Double.valueOf(paymentData.get("paidAmount").toString()) 
                : null;
        String paymentMethod = (String) paymentData.get("paymentMethod");

        return ResponseEntity.ok(billingService.updatePaymentStatus(id, status, paidAmount, paymentMethod));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBill(@PathVariable Long id) {
        billingService.deleteBill(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/revenue")
    public ResponseEntity<Map<String, Double>> getTotalRevenue() {
        return ResponseEntity.ok(Map.of("totalRevenue", billingService.getTotalRevenue()));
    }
}
