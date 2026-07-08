package com.example.demo.model;

import java.math.BigDecimal;
import java.math.RoundingMode;

public enum BillingCycle {
    WEEKLY(BigDecimal.valueOf(52)),      // 52 списания в год
    MONTHLY(BigDecimal.valueOf(12)),
    QUARTERLY(BigDecimal.valueOf(4)),
    YEARLY(BigDecimal.ONE);

    private final BigDecimal timesPerYear;

    BillingCycle(BigDecimal timesPerYear) {
        this.timesPerYear = timesPerYear;
    }

    /** Приводит цену одного списания к месячной сумме. */
    public BigDecimal toMonthly(BigDecimal price) {
        // (price * timesPerYear) / 12
        return price.multiply(timesPerYear)
                .divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP);
    }
}