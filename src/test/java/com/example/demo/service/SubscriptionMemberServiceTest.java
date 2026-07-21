package com.example.demo.service;

import com.example.demo.dto.DebtResponse;
import com.example.demo.dto.MemberResponse;
import com.example.demo.exception.MemberNotFoundException;
import com.example.demo.model.BillingCycle;
import com.example.demo.model.Subscription;
import com.example.demo.model.SubscriptionMember;
import com.example.demo.repository.SubscriptionMemberRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SubscriptionMemberServiceTest {

    @Mock
    private SubscriptionMemberRepository memberRepository;

    // Мокаем ЦЕЛИКОМ основной сервис — плюс вчерашнего рефакторинга:
    // не нужно возиться с SecurityContext и юзером, как в SubscriptionServiceTest
    @Mock
    private SubscriptionService subscriptionService;

    @InjectMocks
    private SubscriptionMemberService service;

    private Subscription netflix;

    @BeforeEach
    void setUp() {
        netflix = new Subscription();
        netflix.setId(1L);
        netflix.setName("Netflix");
        netflix.setPrice(BigDecimal.valueOf(749));
        netflix.setBillingCycle(BillingCycle.MONTHLY);
    }

    // Помощник: собрать участника (у SubscriptionMember нет setId — и не надо)
    private SubscriptionMember member(String name, Subscription sub) {
        SubscriptionMember m = new SubscriptionMember();
        m.setName(name);
        m.setSubscription(sub);
        return m;
    }

    @Test
    void addMember_dividesMonthlyPriceBetweenMembersAndOwner() {
        when(subscriptionService.getOwnedOrThrow(1L)).thenReturn(netflix);
        // save() возвращает то, что ему передали — как настоящая база
        when(memberRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        // после добавления в базе 2 участника
        when(memberRepository.findBySubscription(netflix))
                .thenReturn(List.of(member("Вася", netflix), member("Оля", netflix)));

        MemberResponse response = service.addMember(1L, "Оля");

        assertEquals("Оля", response.getName());
        // 749 ÷ (2 участника + владелец) = 249.666… → 249.67 (HALF_UP)
        // BigDecimal сравниваем через compareTo, не equals!
        assertEquals(0, new BigDecimal("249.67").compareTo(response.getMonthlyShare()));
    }

    @Test
    void getMembers_convertsYearlyPriceToMonthly() {
        netflix.setPrice(BigDecimal.valueOf(12000));
        netflix.setBillingCycle(BillingCycle.YEARLY);
        when(subscriptionService.getOwnedOrThrow(1L)).thenReturn(netflix);
        when(memberRepository.findBySubscription(netflix))
                .thenReturn(List.of(member("Вася", netflix)));

        List<MemberResponse> members = service.getMembers(1L);

        assertEquals(1, members.size());
        // 12000/год → 1000/мес → делим на (1 участник + владелец) = 500.00
        assertEquals(0, new BigDecimal("500.00").compareTo(members.get(0).getMonthlyShare()));
    }

    @Test
    void getMembers_noMembers_returnsEmptyList() {
        when(subscriptionService.getOwnedOrThrow(1L)).thenReturn(netflix);
        when(memberRepository.findBySubscription(netflix)).thenReturn(List.of());

        assertTrue(service.getMembers(1L).isEmpty());
    }

    @Test
    void removeMember_deletesOwnMember() {
        SubscriptionMember vasya = member("Вася", netflix);
        when(subscriptionService.getOwnedOrThrow(1L)).thenReturn(netflix);
        when(memberRepository.findById(5L)).thenReturn(Optional.of(vasya));

        service.removeMember(1L, 5L);

        verify(memberRepository).delete(vasya);
    }

    @Test
    void removeMember_memberOfAnotherSubscription_throwsNotFound() {
        Subscription spotify = new Subscription();
        spotify.setId(2L);
        SubscriptionMember foreign = member("Чужой", spotify);
        when(subscriptionService.getOwnedOrThrow(1L)).thenReturn(netflix);
        when(memberRepository.findById(5L)).thenReturn(Optional.of(foreign));

        // участник другой подписки → честный 404 про УЧАСТНИКА, и delete НЕ вызывается
        assertThrows(MemberNotFoundException.class,
                () -> service.removeMember(1L, 5L));
        verify(memberRepository, never()).delete(any());
    }

    @Test
    void getDebts_sumsSharesAcrossSubscriptions() {
        Subscription spotify = new Subscription();
        spotify.setId(2L);
        spotify.setName("Spotify");
        spotify.setPrice(BigDecimal.valueOf(300));
        spotify.setBillingCycle(BillingCycle.MONTHLY);

        when(subscriptionService.getAll()).thenReturn(List.of(netflix, spotify));
        // Netflix 749: один Вася → его доля 374.50
        when(memberRepository.findBySubscription(netflix))
                .thenReturn(List.of(member("Вася", netflix)));
        // Spotify 300: Вася и Оля → по 100.00
        when(memberRepository.findBySubscription(spotify))
                .thenReturn(List.of(member("Вася", spotify), member("Оля", spotify)));

        List<DebtResponse> debts = service.getDebts();

        assertEquals(2, debts.size());
        // Вася первый — сортировка по убыванию долга: 374.50 + 100.00 = 474.50
        assertEquals("Вася", debts.get(0).getName());
        assertEquals(0, new BigDecimal("474.50").compareTo(debts.get(0).getMonthlyDebt()));
        assertEquals("Оля", debts.get(1).getName());
        assertEquals(0, new BigDecimal("100.00").compareTo(debts.get(1).getMonthlyDebt()));
    }
}