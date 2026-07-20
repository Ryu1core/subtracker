package com.example.demo.service;

import com.example.demo.model.Subscription;
import com.example.demo.repository.SubscriptionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReminderService {

    private static final Logger log = LoggerFactory.getLogger(ReminderService.class);

    @Autowired
    private SubscriptionRepository repository;

    // Тип — интерфейс, а не EmailSender. Spring сам подставит
    // единственную реализацию. Появится TelegramSender — этот код не трогаем
    @Autowired
    private NotificationSender notificationSender;

    // Каждый день в 10:00 по времени сервера
    @Scheduled(cron = "0 0 10 * * *")
    @Transactional(readOnly = true)
    public void remindAboutEndingTrials() {
        LocalDate target = LocalDate.now().plusDays(2);
        List<Subscription> ending = repository.findByTrialEndDate(target);
        for (Subscription s : ending) {
            String email = s.getOwner().getEmail();
            log.info("⏰ Шлю напоминание на {} о триале «{}»", email, s.getName());
            try {
                notificationSender.send(
                        email,
                        "Subtracker: триал «" + s.getName() + "» скоро закончится",
                        "Привет!\n\nПробный период «" + s.getName() + "» заканчивается "
                                + s.getTrialEndDate() + ". Если не отменить, спишется "
                                + s.getPrice() + ".\n\n— Subtracker");
            } catch (Exception e) {
                // Одно упавшее письмо НЕ должно убить напоминания остальным юзерам.
                // Ловим, пишем в лог и идём к следующей подписке
                log.warn("Не смог отправить напоминание на {}: {}", email, e.getMessage());
            }
        }
    }
}