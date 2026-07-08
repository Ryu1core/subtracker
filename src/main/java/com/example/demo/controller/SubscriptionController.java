package com.example.demo.controller;

import com.example.demo.model.Subscription;
import com.example.demo.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@CrossOrigin(origins = "*")
public class SubscriptionController {

    @Autowired
    private SubscriptionService service;

    // GET /api/subscriptions - получить все подписки
    @GetMapping
    public List<Subscription> getAll() {
        return service.getAllSubscriptions();
    }

    // POST /api/subscriptions - добавить новую подписку
    @PostMapping
    public Subscription create(@RequestBody Subscription subscription) {
        return service.addSubscription(subscription);
    }

    // DELETE /api/subscriptions/{id} - удалить подписку
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteSubscription(id);
    }

    // GET /api/subscriptions/total - получить общую сумму в месяц
    @GetMapping("/total")
    public BigDecimal getTotal() {
        return service.getTotalMonthly();
    }
}