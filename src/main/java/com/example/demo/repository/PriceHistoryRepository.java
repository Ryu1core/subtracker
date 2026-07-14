package com.example.demo.repository;

import com.example.demo.model.PriceHistory;
import com.example.demo.model.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PriceHistoryRepository extends JpaRepository<PriceHistory, Long> {

    // WHERE subscription_id = ... ORDER BY changed_at DESC (свежие сверху)
    List<PriceHistory> findBySubscriptionOrderByChangedAtDesc(Subscription subscription);
}