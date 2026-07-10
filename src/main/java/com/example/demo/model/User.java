package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users") // ВАЖНО: не "user" — это зарезервированное слово в Postgres!
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password; // тут будет храниться ХЕШ, не сам пароль

    private LocalDateTime createdAt = LocalDateTime.now();

    // геттеры и сеттеры (сгенерируй в IDEA: Alt+Insert → Getter and Setter)
    public Long getId() { return id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}