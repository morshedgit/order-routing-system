package com.samyar.order.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.samyar.order.models.Order;

import io.quarkus.hibernate.reactive.panache.PanacheRepository;
import io.quarkus.panache.common.Page;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class OrderRepository implements PanacheRepository<Order> {
    // Method to find orders with optional filters and pagination
    public Uni<List<Order>> findOrders(Optional<String> statusFilter, Page page) {
        if (statusFilter.isPresent()) {
            return find("status", statusFilter.get()).page(page).list();
        } else {
            return findAll().page(page).list();
        }
    }
}
