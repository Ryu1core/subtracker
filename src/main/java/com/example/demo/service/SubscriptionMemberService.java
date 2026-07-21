package com.example.demo.service;

import com.example.demo.dto.DebtResponse;
import com.example.demo.dto.MemberResponse;
import com.example.demo.exception.MemberNotFoundException;
import com.example.demo.model.Subscription;
import com.example.demo.model.SubscriptionMember;
import com.example.demo.repository.SubscriptionMemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Совместные подписки: участники и их доли, сводка долгов.
 * Вынесено из SubscriptionService, чтобы каждый сервис делал одну работу.
 */
@Service
public class SubscriptionMemberService {

    @Autowired
    private SubscriptionMemberRepository memberRepository;

    // Переиспользуем проверки доступа из основного сервиса,
    // чтобы не дублировать логику "чья это подписка"
    @Autowired
    private SubscriptionService subscriptionService;

    /** Месячная доля одного человека: цена/мес ÷ (участники + владелец). */
    private BigDecimal monthlyShare(Subscription sub, int memberCount) {
        BigDecimal monthly = sub.getBillingCycle().toMonthly(sub.getPrice());
        // Деньги делим ТОЛЬКО с явным округлением: 749 / 3 = 249.666... — без
        // RoundingMode программа просто упадёт с ArithmeticException
        return monthly.divide(BigDecimal.valueOf(memberCount + 1), 2, RoundingMode.HALF_UP);
    }

    public MemberResponse addMember(Long subscriptionId, String name) {
        Subscription sub = subscriptionService.getOwnedOrThrow(subscriptionId);
        SubscriptionMember member = new SubscriptionMember();
        member.setSubscription(sub);
        member.setName(name);
        SubscriptionMember saved = memberRepository.save(member);
        int count = memberRepository.findBySubscription(sub).size();
        return MemberResponse.from(saved, monthlyShare(sub, count));
    }

    public List<MemberResponse> getMembers(Long subscriptionId) {
        Subscription sub = subscriptionService.getOwnedOrThrow(subscriptionId);
        List<SubscriptionMember> members = memberRepository.findBySubscription(sub);
        if (members.isEmpty()) {
            return List.of();
        }
        BigDecimal share = monthlyShare(sub, members.size());
        return members.stream().map(m -> MemberResponse.from(m, share)).toList();
    }

    public void removeMember(Long subscriptionId, Long memberId) {
        Subscription sub = subscriptionService.getOwnedOrThrow(subscriptionId);

        SubscriptionMember member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberNotFoundException(memberId));

        // участник существует, но принадлежит другой подписке — тоже "не найден"
        if (!member.getSubscription().getId().equals(sub.getId())) {
            throw new MemberNotFoundException(memberId);
        }

        memberRepository.delete(member);
    }

    /** Сводка по всем подпискам: сколько каждый человек должен мне в месяц. */
    public List<DebtResponse> getDebts() {
        // getAll() уже возвращает подписки ТЕКУЩЕГО юзера — переиспользуем
        List<Subscription> subs = subscriptionService.getAll();
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