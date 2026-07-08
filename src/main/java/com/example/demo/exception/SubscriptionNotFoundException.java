package com.example.demo.exception;

public class SubscriptionNotFoundException extends RuntimeException {
    public SubscriptionNotFoundException(Long id) {
        super("Подписка с id " + id + " не найдена");
    }
}