package com.example.demo.service;

import com.example.demo.model.BillingCycle;
import com.example.demo.model.Subscription;
import com.example.demo.repository.SubscriptionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SubscriptionServiceTest {

    @Mock
    private SubscriptionRepository repository;

    @InjectMocks
    private SubscriptionService service;

    @Test
    void totalMonthly_normalizesMixedCycles() {
        var netflix = new Subscription();        // 500/мес
        netflix.setPrice(BigDecimal.valueOf(500));
        netflix.setBillingCycle(BillingCycle.MONTHLY);

        var domain = new Subscription();         // 1200/год = 100/мес
        domain.setPrice(BigDecimal.valueOf(1200));
        domain.setBillingCycle(BillingCycle.YEARLY);

        when(repository.findAll()).thenReturn(List.of(netflix, domain));

        assertEquals(0, service.getTotalMonthly()
                .compareTo(BigDecimal.valueOf(600.00)));  // 500 + 100
    }
}