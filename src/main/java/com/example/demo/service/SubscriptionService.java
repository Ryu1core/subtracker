package com.example.demo.service;

import com.example.demo.exception.SubscriptionNotFoundException;
import com.example.demo.model.Subscription;
import com.example.demo.model.User;
import com.example.demo.repository.SubscriptionRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@Service
public class SubscriptionService {

    @Autowired
    private SubscriptionRepository repository;

    @Autowired
    private UserRepository userRepository;

    // Кто сейчас стучится в API? Email положил в SecurityContext наш JwtAuthFilter
    private User getCurrentUser() {
        String email = (String) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Пользователь не найден"));
    }

    // Достать подписку И проверить, что она принадлежит текущему юзеру.
    // Чужая или несуществующая → одинаковый 404
    private Subscription getOwnedOrThrow(Long id) {
        Subscription sub = repository.findById(id)
                .orElseThrow(() -> new SubscriptionNotFoundException(id));
        if (sub.getOwner() == null
                || !sub.getOwner().getId().equals(getCurrentUser().getId())) {
            throw new SubscriptionNotFoundException(id);
        }
        return sub;
    }

    public List<Subscription> getAll() {
        return repository.findByOwner(getCurrentUser());
    }

    public Subscription save(Subscription subscription) {
        subscription.setOwner(getCurrentUser());
        return repository.save(subscription);
    }

    public Subscription update(Long id, Subscription updated) {
        Subscription existing = getOwnedOrThrow(id);
        existing.setName(updated.getName());
        existing.setPrice(updated.getPrice());
        existing.setBillingDate(updated.getBillingDate());
        existing.setCategory(updated.getCategory());
        existing.setBillingCycle(updated.getBillingCycle());
        return repository.save(existing);
    }

    public void delete(Long id) {
        Subscription existing = getOwnedOrThrow(id);
        repository.delete(existing);
    }

    public BigDecimal getTotalMonthly() {
        return repository.findByOwner(getCurrentUser()).stream()
                .map(s -> s.getBillingCycle().toMonthly(s.getPrice()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /** Подписки текущего юзера, у которых списание в ближайшие days дней. */
    public List<Subscription> getUpcoming(int days) {
        LocalDate today = LocalDate.now();
        LocalDate limit = today.plusDays(days);
        return repository.findByOwner(getCurrentUser()).stream()
                .filter(s -> !s.getBillingCycle()
                        .nextBilling(s.getBillingDate(), today).isAfter(limit))
                .sorted(Comparator.comparing((Subscription s) ->
                        s.getBillingCycle().nextBilling(s.getBillingDate(), today)))
                .toList();
    }
}