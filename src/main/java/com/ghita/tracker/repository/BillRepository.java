package com.ghita.tracker.repository;

import com.ghita.tracker.entity.Bill;
import com.ghita.tracker.entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BillRepository extends JpaRepository<Bill, Long> {

    // Find bills by title (partial match)
    List<Bill> findByTitleContainingIgnoreCase(String title);

    // Find bills by status (PAID / UNPAID)
    List<Bill> findByStatus(Status status);

    // Find bills by exact due date
    List<Bill> findByDueDate(LocalDate dueDate);

    // Find bills between two dates (date range)
    List<Bill> findByDueDateBetween(LocalDate startDate, LocalDate endDate);

    // Find bills by year (using native query)
    @Query("SELECT b FROM Bill b WHERE YEAR(b.dueDate) = :year")
    List<Bill> findByYear(@Param("year") int year);
}