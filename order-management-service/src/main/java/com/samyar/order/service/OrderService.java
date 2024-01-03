package com.samyar.order.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

import com.samyar.order.models.Order;
import com.samyar.order.repository.OrderRepository;

import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.quarkus.panache.common.Page;
import io.smallrye.mutiny.Uni;

@ApplicationScoped
public class OrderService {

    // @Inject
    // OrderRepository orderRepository;

    // // Retrieve an order by ID
    // public Uni<Order> getOrder(Long orderId) {
    //     return orderRepository.findById(orderId);
    // }

    // // Create a new order

    // @WithSession
    // @Transactional
    // public Uni<Order> createOrder(Order order) {
    //     return orderRepository.persist(order)
    //                           .onItem().transform(inserted -> inserted); // Return the persisted order
    // }

    // // Update an existing order
    // public Uni<Order> updateOrder(Long orderId, Order updatedOrder) {
    //     return orderRepository.findById(orderId)
    //                           .onItem().ifNotNull().transformToUni(order -> {
    //                               // Update the order entity with new values
    //                               order.setStatus(updatedOrder.getStatus());
    //                               order.setUpdatedAt(updatedOrder.getUpdatedAt());
    //                               order.setUpdatedBy(updatedOrder.getUpdatedBy());
    //                               // Persist the changes
    //                               return orderRepository.persist(order);
    //                           });
    // }

    // // Delete an order
    // public Uni<Boolean> deleteOrder(Long orderId) {
    //     return orderRepository.deleteById(orderId)
    //                           .onItem().transform(deleted -> deleted); // Return deletion result
    // }

    // // Method to retrieve orders with pagination and optional status filter
    // public Uni<List<Order>> getOrders(Optional<String> statusFilter, int pageIndex, int pageSize) {
    //     Page page = Page.of(pageIndex, pageSize);
    //     return orderRepository.findOrders(statusFilter, page);
    // }
}
