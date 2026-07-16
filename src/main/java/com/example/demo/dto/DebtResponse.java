package com.example.demo.dto;

import java.math.BigDecimal;

public class DebtResponse {

    private final String name;
    private final BigDecimal monthlyDebt;

    public DebtResponse(String name, BigDecimal monthlyDebt) {
        this.name = name;
        this.monthlyDebt = monthlyDebt;
    }

    public String getName() { return name; }
    public BigDecimal getMonthlyDebt() { return monthlyDebt; }
}