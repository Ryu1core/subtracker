package com.example.demo.service;

import com.example.demo.model.Subscription;
import com.example.demo.repository.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class SubscriptionService {

    @Autowired
    private SubscriptionRepository repository;

    // Получить все подписки
    public List<Subscription> getAllSubscriptions() {
        return repository.findAll();
    }

    // Добавить новую подписку
    public Subscription addSubscription(Subscription subscription) {
        return repository.save(subscription);
    }

    // Удалить подписку по id
    public void deleteSubscription(Long id) {
        repository.deleteById(id);
    }

    public BigDecimal getTotalMonthly() {
        return repository.findAll().stream()
                .map(s -> s.getBillingCycle().toMonthly(s.getPrice()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}