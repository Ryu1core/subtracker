package com.example.demo.model;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;

class BillingCycleTest {

    private final LocalDate today = LocalDate.of(2026, 7, 13);

    @Test
    void futureDateStaysAsIs() {
        // дата ещё не наступила → она и есть следующее списание
        assertEquals(LocalDate.of(2026, 7, 15),
                BillingCycle.MONTHLY.nextBilling(LocalDate.of(2026, 7, 15), today));
    }

    @Test
    void pastMonthlyRollsForward() {
        // списание было 5 июля → следующее 5 августа
        assertEquals(LocalDate.of(2026, 8, 5),
                BillingCycle.MONTHLY.nextBilling(LocalDate.of(2026, 7, 5), today));
    }

    @Test
    void oldYearlyRollsSeveralYears() {
        // годовая от 10.01.2024 → следующее списание 10.01.2027
        assertEquals(LocalDate.of(2027, 1, 10),
                BillingCycle.YEARLY.nextBilling(LocalDate.of(2024, 1, 10), today));
    }
}