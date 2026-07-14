package com.example.demo.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "price_history")
public class PriceHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Много записей истории → одна подписка
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subscription_id")
    private Subscription subscription;

    private BigDecimal oldPrice;

    private BigDecimal newPrice;

    private LocalDateTime changedAt;

    // Хук JPA: выполнится сам перед сохранением в базу
    @PrePersist
    void onCreate() {
        this.changedAt = LocalDateTime.now();
    }

    // Геттеры и сеттеры
    public Long getId() { return id; }

    public Subscription getSubscription() { return subscription; }
    public void setSubscription(Subscription subscription) { this.subscription = subscription; }

    public BigDecimal getOldPrice() { return oldPrice; }
    public void setOldPrice(BigDecimal oldPrice) { this.oldPrice = oldPrice; }

    public BigDecimal getNewPrice() { return newPrice; }
    public void setNewPrice(BigDecimal newPrice) { this.newPrice = newPrice; }

    public LocalDateTime getChangedAt() { return changedAt; }
}