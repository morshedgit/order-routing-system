package com.samyar.assignment.consumers;

import java.math.BigDecimal;
import java.time.Duration;

import org.eclipse.microprofile.reactive.messaging.Incoming;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import com.samyar.assignment.blm.OrderService;
import com.samyar.assignment.clients.PrinterService;
import com.samyar.assignment.models.AssignmentCriteria;
import com.samyar.assignment.models.Order;

import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class OrderConsumer {
    
    


    @Inject
    @RestClient
    PrinterService printerService;

    @Inject
    OrderService orderService;

    @Incoming("orders")
    public void receive(Order order) {
        orderService.processOrder(order)
            .onFailure().invoke(th -> {
                System.out.println("Error processing order: " + th.getMessage());
                // Additional error handling can be added here
            }).subscribe().with(item -> {}, failure -> {});
            // No need to block the thread, return the Uni<Void> directly
    }
}

