package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;

public class MemberRequest {

    @NotBlank(message = "Имя участника не может быть пустым")
    private String name;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}