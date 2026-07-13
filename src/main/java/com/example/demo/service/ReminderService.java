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

    @Scheduled(cron = "0 0 10 * * *")
    @Transactional(readOnly = true) // держим сессию с БД, чтобы дотянуться до lazy-владельца
    public void remindAboutEndingTrials() {
        LocalDate target = LocalDate.now().plusDays(2);
        List<Subscription> ending = repository.findByTrialEndDate(target);
        for (Subscription s : ending) {
            log.info("⏰ НАПОМИНАНИЕ для {}: триал «{}» заканчивается {} — отмени, или спишется {}!",
                    s.getOwner().getEmail(), s.getName(), s.getTrialEndDate(), s.getPrice());
        }
    }
}