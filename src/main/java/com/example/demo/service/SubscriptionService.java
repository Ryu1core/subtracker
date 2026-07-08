package com.example.demo.service;

import com.example.demo.exception.SubscriptionNotFoundException;
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

    public List<Subscription> getAll() {
        return repository.findAll();
    }

    public Subscription save(Subscription subscription) {
        return repository.save(subscription);
    }

    public Subscription update(Long id, Subscription updated) {
        Subscription existing = repository.findById(id)
                .orElseThrow(() -> new SubscriptionNotFoundException(id));
        existing.setName(updated.getName());
        existing.setPrice(updated.getPrice());
        existing.setBillingDate(updated.getBillingDate());
        existing.setCategory(updated.getCategory());
        existing.setBillingCycle(updated.getBillingCycle());
        return repository.save(existing);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new SubscriptionNotFoundException(id);
        }
        repository.deleteById(id);
    }

    public BigDecimal getTotalMonthly() {
        return repository.findAll().stream()
                .map(s -> s.getBillingCycle().toMonthly(s.getPrice()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}