package com.example.demo.dto;

import com.example.demo.model.SubscriptionMember;

import java.math.BigDecimal;

public class MemberResponse {

    private Long id;
    private String name;
    private BigDecimal monthlyShare; // сколько этот человек должен в месяц

    public static MemberResponse from(SubscriptionMember m, BigDecimal share) {
        MemberResponse dto = new MemberResponse();
        dto.id = m.getId();
        dto.name = m.getName();
        dto.monthlyShare = share;
        return dto;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public BigDecimal getMonthlyShare() { return monthlyShare; }
}