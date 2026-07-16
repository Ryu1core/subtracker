package com.example.demo.service;

import com.example.demo.dto.DebtResponse;
import com.example.demo.dto.MemberResponse;
import com.example.demo.exception.SubscriptionNotFoundException;
import com.example.demo.model.PriceHistory;
import com.example.demo.model.Subscription;
import com.example.demo.model.SubscriptionMember;
import com.example.demo.model.User;
import com.example.demo.repository.PriceHistoryRepository;
import com.example.demo.repository.SubscriptionMemberRepository;
import com.example.demo.repository.SubscriptionRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class SubscriptionService {

    @Autowired
    private SubscriptionRepository repository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PriceHistoryRepository priceHistoryRepository;

    @Autowired
    private NotificationSender notificationSender;

    @Autowired
    private SubscriptionMemberRepository memberRepository;

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

            // Алерт только на подорожание: снижению цены радуемся молча
            if (newPrice.compareTo(oldPrice) > 0) {
                notificationSender.send(
                        saved.getOwner().getEmail(),
                        "Subtracker: «" + saved.getName() + "» подорожала",
                        "Внимание!\n\nЦена подписки «" + saved.getName()
                                + "» выросла с " + oldPrice + " до " + newPrice
                                + ".\n\nМожет, пора её пересмотреть?\n\n— Subtracker");
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

    /** Месячная доля одного человека: цена/мес ÷ (участники + владелец). */
    private BigDecimal monthlyShare(Subscription sub, int memberCount) {
        BigDecimal monthly = sub.getBillingCycle().toMonthly(sub.getPrice());
        // Деньги делим ТОЛЬКО с явным округлением: 749 / 3 = 249.666... — без
        // RoundingMode программа просто упадёт с ArithmeticException
        return monthly.divide(BigDecimal.valueOf(memberCount + 1), 2, RoundingMode.HALF_UP);
    }

    public MemberResponse addMember(Long subscriptionId, String name) {
        Subscription sub = getOwnedOrThrow(subscriptionId);
        SubscriptionMember member = new SubscriptionMember();
        member.setSubscription(sub);
        member.setName(name);
        SubscriptionMember saved = memberRepository.save(member);
        int count = memberRepository.findBySubscription(sub).size();
        return MemberResponse.from(saved, monthlyShare(sub, count));
    }

    public List<MemberResponse> getMembers(Long subscriptionId) {
        Subscription sub = getOwnedOrThrow(subscriptionId);
        List<SubscriptionMember> members = memberRepository.findBySubscription(sub);
        if (members.isEmpty()) {
            return List.of();
        }
        BigDecimal share = monthlyShare(sub, members.size());
        return members.stream().map(m -> MemberResponse.from(m, share)).toList();
    }

    public void removeMember(Long subscriptionId, Long memberId) {
        Subscription sub = getOwnedOrThrow(subscriptionId);
        SubscriptionMember member = memberRepository.findById(memberId)
                .orElseThrow(() -> new SubscriptionNotFoundException(memberId));
        // Участник должен принадлежать именно ЭТОЙ подписке — иначе 404
        if (!member.getSubscription().getId().equals(sub.getId())) {
            throw new SubscriptionNotFoundException(memberId);
        }
        memberRepository.delete(member);
    }

    /** Сводка по всем подпискам: сколько каждый человек должен мне в месяц. */
    public List<DebtResponse> getDebts() {
        List<Subscription> subs = repository.findByOwner(getCurrentUser());
        Map<String, BigDecimal> byName = new LinkedHashMap<>();
        for (Subscription sub : subs) {
            List<SubscriptionMember> members = memberRepository.findBySubscription(sub);
            if (members.isEmpty()) {
                continue;
            }
            BigDecimal share = monthlyShare(sub, members.size());
            for (SubscriptionMember m : members) {
                // Вася сидит и на Netflix, и на Spotify? merge сложит его доли
                byName.merge(m.getName(), share, BigDecimal::add);
            }
        }
        return byName.entrySet().stream()
                .map(e -> new DebtResponse(e.getKey(), e.getValue()))
                .sorted(Comparator.comparing(DebtResponse::getMonthlyDebt).reversed())
                .toList();
    }
}