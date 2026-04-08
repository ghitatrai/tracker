package com.ghita.tracker.service;

import com.ghita.tracker.dto.GraphResponse;
import com.ghita.tracker.entity.Bill;
import com.ghita.tracker.entity.Status;
import com.ghita.tracker.repository.BillRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BillService {

    private final BillRepository billRepository;

    public BillService(BillRepository billRepository) {
        this.billRepository = billRepository;
    }

    // Add bill
    public Bill addBill(Bill bill) {
        if (bill.getAmount() == null || bill.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Amount must be greater than 0");
        }

        return billRepository.save(bill);
    }

    // Get bill by ID
    public Bill getBillById(Long id) {
        return billRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bill not found with id: " + id));
    }

    // Update bill
    public Bill updateBill(Long id, Bill updatedBill) {
        if (updatedBill.getAmount() == null || updatedBill.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Amount must be greater than 0");
        }

        Bill existingBill = getBillById(id);

        existingBill.setTitle(updatedBill.getTitle());
        existingBill.setAmount(updatedBill.getAmount());
        existingBill.setDueDate(updatedBill.getDueDate());
        existingBill.setCategory(updatedBill.getCategory());
        existingBill.setStatus(updatedBill.getStatus());

        return billRepository.save(existingBill);
    }

    // Delete bill
    public void deleteBill(Long id) {
        billRepository.deleteById(id);
    }

    // Get all bills
    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    // Get bills by year
    public List<Bill> getBillsByYear(int year) {
        return billRepository.findByYear(year);
    }

    // Get unpaid bills
    public List<Bill> getUnpaidBills() {
        return billRepository.findByStatus(Status.UNPAID);
    }

    // Total amount
    public BigDecimal getTotalAmount() {
        return billRepository.findAll()
                .stream()
                .map(Bill::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Total unpaid
    public BigDecimal getTotalUnpaidAmount() {
        return billRepository.findByStatus(Status.UNPAID)
                .stream()
                .map(Bill::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Total this month
    public BigDecimal getTotalAmountThisMonth() {
        java.time.LocalDate now = java.time.LocalDate.now();
        int currentMonth = now.getMonthValue();
        int currentYear = now.getYear();

        return billRepository.findAll()
                .stream()
                .filter(b -> b.getDueDate().getMonthValue() == currentMonth && b.getDueDate().getYear() == currentYear)
                .map(Bill::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Total this year
    public BigDecimal getTotalAmountThisYear() {
        int currentYear = java.time.LocalDate.now().getYear();

        return billRepository.findAll()
                .stream()
                .filter(b -> b.getDueDate().getYear() == currentYear)
                .map(Bill::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    //monthly spending (this year)
    public GraphResponse getMonthlySpendingThisYear() {
        int currentYear = java.time.LocalDate.now().getYear();

        double[] monthlyTotals = new double[12];

        for (Bill bill : billRepository.findAll()) {
            if (bill.getDueDate().getYear() == currentYear) {
                int month = bill.getDueDate().getMonthValue() - 1;
                monthlyTotals[month] += bill.getAmount().doubleValue();
            }
        }

        return buildMonthlyGraph(monthlyTotals);
    }
    //monthly spending (last year)
    public GraphResponse getMonthlySpendingLastYear() {
        int lastYear = java.time.LocalDate.now().getYear() - 1;

        double[] monthlyTotals = new double[12];

        for (Bill bill : billRepository.findAll()) {
            if (bill.getDueDate().getYear() == lastYear) {
                int month = bill.getDueDate().getMonthValue() - 1;
                monthlyTotals[month] += bill.getAmount().doubleValue();
            }
        }

        return buildMonthlyGraph(monthlyTotals);
    }
    //helper methode(reusable)
    private GraphResponse buildMonthlyGraph(double[] monthlyTotals) {
        List<String> labels = List.of(
                "Jan","Feb","Mar","Apr","May","Jun",
                "Jul","Aug","Sep","Oct","Nov","Dec"
        );

        List<Double> values = java.util.Arrays.stream(monthlyTotals)
                .boxed()
                .toList();

        return new GraphResponse(labels, values);
    }
    //spending per category
    public GraphResponse getSpendingByCategory() {
        Map<String, Double> categoryMap = new HashMap<>();

        for (Bill bill : billRepository.findAll()) {
            String category = bill.getCategory() != null ? bill.getCategory() : "Other";

            categoryMap.put(
                    category,
                    categoryMap.getOrDefault(category, 0.0)
                            + bill.getAmount().doubleValue()
            );
        }

        List<String> labels = new ArrayList<>(categoryMap.keySet());
        List<Double> values = labels.stream()
                .map(categoryMap::get)
                .toList();

        return new GraphResponse(labels, values);
    }
    // compare this year vs last year
    public GraphResponse compareThisYearVsLastYear() {
        int currentYear = java.time.LocalDate.now().getYear();
        int lastYear = currentYear - 1;

        double currentTotal = 0.0;
        double lastTotal = 0.0;

        for (Bill bill : billRepository.findAll()) {
            if (bill.getDueDate().getYear() == currentYear) {
                currentTotal += bill.getAmount().doubleValue();
            } else if (bill.getDueDate().getYear() == lastYear) {
                lastTotal += bill.getAmount().doubleValue();
            }
        }

        return new GraphResponse(
                List.of("Last Year", "This Year"),
                List.of(lastTotal, currentTotal)
        );
    }

}