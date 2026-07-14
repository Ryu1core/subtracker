package com.example.demo.dto;

import com.example.demo.model.PriceHistory;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PriceHistoryResponse {

    private BigDecimal oldPrice;
    private BigDecimal newPrice;
    private LocalDateTime changedAt;

    public static PriceHistoryResponse from(PriceHistory h) {
        PriceHistoryResponse dto = new PriceHistoryResponse();
        dto.oldPrice = h.getOldPrice();
        dto.newPrice = h.getNewPrice();
        dto.changedAt = h.getChangedAt();
        return dto;
    }

    public BigDecimal getOldPrice() { return oldPrice; }
    public BigDecimal getNewPrice() { return newPrice; }
    public LocalDateTime getChangedAt() { return changedAt; }
}