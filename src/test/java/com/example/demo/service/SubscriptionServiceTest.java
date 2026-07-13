package com.example.demo.service;

import com.example.demo.model.BillingCycle;
import com.example.demo.model.Subscription;
import com.example.demo.model.User;
import com.example.demo.repository.SubscriptionRepository;
import com.example.demo.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SubscriptionServiceTest {

    @Mock
    private SubscriptionRepository repository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SubscriptionService service;

    private User user;

    @BeforeEach
    void setUp() {
        // Создаём тестового юзера и "логиним" его в SecurityContext,
        // как это в реальной жизни делает JwtAuthFilter
        user = new User();
        user.setId(1L);
        user.setEmail("test@mail.ru");
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("test@mail.ru", null, List.of()));
        when(userRepository.findByEmail("test@mail.ru")).thenReturn(Optional.of(user));
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext(); // прибираем за собой, чтобы тесты не влияли друг на друга
    }

    @Test
    void totalMonthly_normalizesMixedCycles() {
        var netflix = new Subscription();        // 500/мес
        netflix.setPrice(BigDecimal.valueOf(500));
        netflix.setBillingCycle(BillingCycle.MONTHLY);

        var domain = new Subscription();         // 1200/год = 100/мес
        domain.setPrice(BigDecimal.valueOf(1200));
        domain.setBillingCycle(BillingCycle.YEARLY);

        when(repository.findByOwner(user)).thenReturn(List.of(netflix, domain));

        assertEquals(0, service.getTotalMonthly()
                .compareTo(BigDecimal.valueOf(600.00)));  // 500 + 100
    }
}