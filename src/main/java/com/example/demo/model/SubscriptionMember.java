package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "subscription_members")
public class SubscriptionMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Много участников → одна подписка
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subscription_id")
    private Subscription subscription;

    // Просто имя человека, НЕ юзер приложения
    private String name;

    // Геттеры и сеттеры
    public Long getId() { return id; }

    public Subscription getSubscription() { return subscription; }
    public void setSubscription(Subscription subscription) { this.subscription = subscription; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}