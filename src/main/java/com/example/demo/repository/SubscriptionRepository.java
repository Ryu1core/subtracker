package com.example.demo.repository;

import com.example.demo.model.Subscription;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    // Spring Data сам напишет SQL по имени метода: WHERE user_id = ...
    List<Subscription> findByOwner(User owner);
}