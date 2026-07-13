package com.example.demo.dto;

import com.example.demo.model.BillingCycle;
import com.example.demo.model.Subscription;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class SubscriptionResponse {

    private Long id;
    private String name;
    private BigDecimal price;
    private LocalDate billingDate;
    private LocalDate nextBillingDate;   // вычисляется, в базе не хранится
    private LocalDate trialEndDate;      // null = не триал
    private String category;
    private BillingCycle billingCycle;
    private LocalDateTime createdAt;

    // Статический фабричный метод — превращает entity в DTO
    public static SubscriptionResponse from(Subscription s) {
        SubscriptionResponse dto = new SubscriptionResponse();
        dto.id = s.getId();
        dto.name = s.getName();
        dto.price = s.getPrice();
        dto.billingDate = s.getBillingDate();
        dto.nextBillingDate = s.getBillingCycle()
                .nextBilling(s.getBillingDate(), LocalDate.now());
        dto.trialEndDate = s.getTrialEndDate();
        dto.category = s.getCategory();
        dto.billingCycle = s.getBillingCycle();
        dto.createdAt = s.getCreatedAt();
        return dto;
    }

    // Геттеры
    public Long getId() { return id; }
    public String getName() { return name; }
    public BigDecimal getPrice() { return price; }
    public LocalDate getBillingDate() { return billingDate; }
    public LocalDate getNextBillingDate() { return nextBillingDate; }
    public LocalDate getTrialEndDate() { return trialEndDate; }
    public String getCategory() { return category; }
    public BillingCycle getBillingCycle() { return billingCycle; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}