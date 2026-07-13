package com.example.demo.dto;

import com.example.demo.model.BillingCycle;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;

public class SubscriptionRequest {

    @NotBlank(message = "Название не может быть пустым")
    private String name;

    @NotNull(message = "Цена обязательна")
    @Positive(message = "Цена должна быть больше нуля")
    private BigDecimal price;

    @NotNull(message = "Дата списания обязательна")
    private LocalDate billingDate;

    private String category;

    @NotNull(message = "Цикл оплаты обязателен")
    private BillingCycle billingCycle;

    // Геттеры и сеттеры
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public LocalDate getBillingDate() {
        return billingDate;
    }

    public void setBillingDate(LocalDate billingDate) {
        this.billingDate = billingDate;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BillingCycle getBillingCycle() {
        return billingCycle;
    }

    public void setBillingCycle(BillingCycle billingCycle) {
        this.billingCycle = billingCycle;
    }
    // Необязательное поле: дата конца триала, если подписка пробная
    private LocalDate trialEndDate;

    public LocalDate getTrialEndDate() {
        return trialEndDate;
    }

    public void setTrialEndDate(LocalDate trialEndDate) {
        this.trialEndDate = trialEndDate;
    }
}