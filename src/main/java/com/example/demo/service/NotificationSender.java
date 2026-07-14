package com.example.demo.service;

/**
 * Канал доставки уведомлений. Сегодня email, завтра Telegram —
 * ядро (ReminderService) об этом знать не должно.
 */
public interface NotificationSender {
    void send(String to, String subject, String text);
}