package com.example.demo.dto;

import com.example.demo.model.Subscription;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class GhostResponse {

    private Long id;
    private String name;
    private BigDecimal monthlyPrice;   // сколько утекает в месяц
    private long daysUnused;           // сколько дней не пользовались
    private LocalDateTime lastUsedAt;  // null = ни разу не отмечали

    public static GhostResponse from(Subscription sub, long daysUnused) {
        GhostResponse dto = new GhostResponse();
        dto.id = sub.getId();
        dto.name = sub.getName();
        dto.monthlyPrice = sub.getBillingCycle().toMonthly(sub.getPrice());
        dto.daysUnused = daysUnused;
        dto.lastUsedAt = sub.getLastUsedAt();
        return dto;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public BigDecimal getMonthlyPrice() { return monthlyPrice; }
    public long getDaysUnused() { return daysUnused; }
    public LocalDateTime getLastUsedAt() { return lastUsedAt; }
}