package com.example.demo.controller;

import com.example.demo.dto.PriceHistoryResponse;
import com.example.demo.dto.SubscriptionRequest;
import com.example.demo.dto.SubscriptionResponse;
import com.example.demo.model.Subscription;
import com.example.demo.service.SubscriptionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    private final SubscriptionService service;

    public SubscriptionController(SubscriptionService service) {
        this.service = service;
    }

    @GetMapping
    public List<SubscriptionResponse> getAll() {
        return service.getAll()
                .stream()
                .map(SubscriptionResponse::from)
                .collect(Collectors.toList());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SubscriptionResponse create(@Valid @RequestBody SubscriptionRequest request) {
        Subscription sub = new Subscription();
        sub.setName(request.getName());
        sub.setPrice(request.getPrice());
        sub.setBillingDate(request.getBillingDate());
        sub.setCategory(request.getCategory());
        sub.setBillingCycle(request.getBillingCycle());
        sub.setTrialEndDate(request.getTrialEndDate());
        return SubscriptionResponse.from(service.save(sub));
    }

    @PutMapping("/{id}")
    public SubscriptionResponse update(@PathVariable Long id,
                                       @Valid @RequestBody SubscriptionRequest request) {
        Subscription sub = new Subscription();
        sub.setName(request.getName());
        sub.setPrice(request.getPrice());
        sub.setBillingDate(request.getBillingDate());
        sub.setCategory(request.getCategory());
        sub.setBillingCycle(request.getBillingCycle());
        sub.setTrialEndDate(request.getTrialEndDate());
        return SubscriptionResponse.from(service.update(id, sub));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/total")
    public BigDecimal getTotal() {
        return service.getTotalMonthly();
    }

    @GetMapping("/upcoming")
    public List<SubscriptionResponse> getUpcoming(@RequestParam(defaultValue = "7") int days) {
        return service.getUpcoming(days).stream()
                .map(SubscriptionResponse::from)
                .collect(Collectors.toList());
    }
    @GetMapping("/{id}/price-history")
    public List<PriceHistoryResponse> getPriceHistory(@PathVariable Long id) {
        return service.getPriceHistory(id).stream()
                .map(PriceHistoryResponse::from)
                .collect(Collectors.toList());
    }
}