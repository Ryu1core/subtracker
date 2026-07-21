package com.example.demo.exception;

public class MemberNotFoundException extends RuntimeException {
    public MemberNotFoundException(Long id) {
        super("Участник с id " + id + " не найден");
    }
}