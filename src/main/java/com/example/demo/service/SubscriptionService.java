package com.example.demo.service;

import com.example.demo.dto.GhostResponse;
import com.example.demo.exception.SubscriptionNotFoundException;
import com.example.demo.model.PriceHistory;
import com.example.demo.model.Subscription;
import com.example.demo.model.User;
import com.example.demo.repository.PriceHistoryRepository;
import com.example.demo.repository.SubscriptionRepository;
import com.example.demo.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class SubscriptionService {

    private static final Logger log = LoggerFactory.getLogger(SubscriptionService.class);

    @Autowired
    private SubscriptionRepository repository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PriceHistoryRepository priceHistoryRepository;

    @Autowired
    private NotificationSender notificationSender;

    // Кто сейчас стучится в API? Email положил в SecurityContext наш JwtAuthFilter
    private User getCurrentUser() {
        String email = (String) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Пользователь не найден"));
    }

    // Достать подписку И проверить, что она принадлежит текущему юзеру.
    // Чужая или несуществующая → одинаковый 404.
    // package-private: виден SubscriptionMemberService в этом же пакете
    Subscription getOwnedOrThrow(Long id) {
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

        BigDecimal oldPrice = existing.getPrice();
        BigDecimal newPrice = updated.getPrice();
        // BigDecimal сравниваем ТОЛЬКО через compareTo!
        // equals считает 649 и 649.00 РАЗНЫМИ числами (разный масштаб)
        boolean priceChanged = oldPrice.compareTo(newPrice) != 0;

        existing.setName(updated.getName());
        existing.setPrice(newPrice);
        existing.setBillingDate(updated.getBillingDate());
        existing.setCategory(updated.getCategory());
        existing.setBillingCycle(updated.getBillingCycle());
        existing.setTrialEndDate(updated.getTrialEndDate());
        Subscription saved = repository.save(existing);

        if (priceChanged) {
            PriceHistory history = new PriceHistory();
            history.setSubscription(saved);
            history.setOldPrice(oldPrice);
            history.setNewPrice(newPrice);
            priceHistoryRepository.save(history);

            // Алерт только на подорожание: снижению цены радуемся молча.
            // try/catch: почта лежит — не повод ронять PUT-запрос юзера
            if (newPrice.compareTo(oldPrice) > 0) {
                try {
                    notificationSender.send(
                            saved.getOwner().getEmail(),
                            "Subtracker: «" + saved.getName() + "» подорожала",
                            "Внимание!\n\nЦена подписки «" + saved.getName()
                                    + "» выросла с " + oldPrice + " до " + newPrice
                                    + ".\n\nМожет, пора её пересмотреть?\n\n— Subtracker");
                } catch (Exception e) {
                    log.warn("Не удалось отправить алерт о подорожании «{}»: {}",
                            saved.getName(), e.getMessage());
                }
            }
        }
        return saved;
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

    /** История изменений цены (свежие сверху). Чужая подписка → 404. */
    public List<PriceHistory> getPriceHistory(Long id) {
        return priceHistoryRepository
                .findBySubscriptionOrderByChangedAtDesc(getOwnedOrThrow(id));
    }
    /** Отметить: "я сегодня пользовался этой подпиской". */
    public void markUsed(Long id) {
        Subscription sub = getOwnedOrThrow(id);
        sub.setLastUsedAt(LocalDateTime.now());
        repository.save(sub);
    }

    /**
     * Подписки-призраки: не использовались 30+ дней.
     * Если lastUsedAt пуст (ни разу не отмечали) — считаем от даты создания.
     */
    public List<GhostResponse> getGhosts() {
        LocalDateTime now = LocalDateTime.now();
        List<GhostResponse> ghosts = new ArrayList<>();

        for (Subscription sub : getAll()) {
            LocalDateTime lastActivity = sub.getLastUsedAt() != null
                    ? sub.getLastUsedAt()
                    : sub.getCreatedAt();

            long daysUnused = ChronoUnit.DAYS.between(lastActivity, now);
            if (daysUnused >= 30) {
                ghosts.add(GhostResponse.from(sub, daysUnused));
            }
        }

        // самые дорогие призраки сверху
        ghosts.sort(Comparator.comparing(GhostResponse::getMonthlyPrice).reversed());
        return ghosts;
    }
}