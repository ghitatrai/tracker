package com.ghita.tracker.controller;

import com.ghita.tracker.dto.GraphResponse;
import com.ghita.tracker.entity.Bill;
import com.ghita.tracker.entity.Status;
import com.ghita.tracker.service.BillService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bills")
public class BillController {

    private final BillService billService;

    public BillController(BillService billService) {
        this.billService = billService;
    }

    // ✅ POST /bills
    @PostMapping
    public Bill addBill(@RequestBody Bill bill) {
        return billService.addBill(bill);
    }

    // ✅ GET /bills
    @GetMapping
    public List<Bill> getAllBills(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Status status
    ) {
        if (year != null) {
            return billService.getBillsByYear(year);
        }

        if (status != null) {
            if (status == Status.UNPAID) {
                return billService.getUnpaidBills();
            }
            return billService.getAllBills().stream()
                    .filter(b -> b.getStatus() == status)
                    .toList();
        }

        return billService.getAllBills();
    }

    // ✅ GET /bills/{id}
    @GetMapping("/{id}")
    public Bill getBillById(@PathVariable Long id) {
        return billService.getBillById(id);
    }

    // ✅ PUT /bills/{id}
    @PutMapping("/{id}")
    public Bill updateBill(@PathVariable Long id, @RequestBody Bill bill) {
        return billService.updateBill(id, bill);
    }

    // ✅ DELETE /bills/{id}
    @DeleteMapping("/{id}")
    public void deleteBill(@PathVariable Long id) {
        billService.deleteBill(id);
    }
    @GetMapping("/analytics/monthly")
    public GraphResponse monthly() {
        return billService.getMonthlySpendingThisYear();
    }

    @GetMapping("/analytics/monthly-last-year")
    public GraphResponse lastYear() {
        return billService.getMonthlySpendingLastYear();
    }

    @GetMapping("/analytics/categories")
    public GraphResponse categories() {
        return billService.getSpendingByCategory();
    }

    @GetMapping("/analytics/comparison")
    public GraphResponse comparison() {
        return billService.compareThisYearVsLastYear();
    }

    @GetMapping("/dashboard")
    public java.util.Map<String, Object> getDashboardData() {
        java.util.Map<String, Object> dashboard = new java.util.HashMap<>();
        dashboard.put("totalThisMonth", billService.getTotalAmountThisMonth());
        dashboard.put("totalThisYear", billService.getTotalAmountThisYear());
        dashboard.put("unpaid", billService.getUnpaidBills().size());
        dashboard.put("upcoming", billService.getUnpaidBills());
        return dashboard;
    }
}