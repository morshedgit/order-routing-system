package com.samyar.order.services;

import java.util.UUID;

import org.eclipse.microprofile.rest.client.inject.RestClient;

import com.samyar.order.clients.AssignmentService;
import com.samyar.order.clients.PrinterService;
import com.samyar.order.models.Assignment;
import com.samyar.order.models.Order;
import com.samyar.order.models.OrderProgress;
import com.samyar.order.models.Printer;

import io.smallrye.common.annotation.Blocking;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class OrderProgressService {

    @Inject
    @RestClient
    AssignmentService assignmentService;

    @Inject
    @RestClient
    PrinterService printerService;
    
    public Uni<OrderProgress> getOrderProgressByOrderId(UUID orderId){

        OrderProgress orderProgress = new OrderProgress();
        orderProgress.setOrderId(orderId);
        Uni<Order> orderUni = Order.findById(orderId);

        return orderUni
        .onItem().transformToUni((Order order) -> {
            System.out.println("Order Id: "+order.getOrderId());
            orderProgress.setOrder(order);
            Uni<Assignment> assUni = assignmentService.getAssignment(order.getOrderId());
            return assUni;
            
        }).onItem().transformToUni((Assignment assignment) -> {

            System.out.println("Assignment Id: "+assignment.getAssignmentId());
            Uni<Printer> pUni = printerService.getPrinter(assignment.getPrinterId());
            return pUni;
        }).onItem().transformToUni((Printer printer) -> {
            System.out.println("printer Id: "+printer.getPrinterId());
            orderProgress.setPrinter(printer);
            return Uni.createFrom().item(orderProgress);
        }).onFailure().recoverWithItem(th->{
            System.out.println("Error Message: "+ th.getMessage());
            return orderProgress;
        });
    }    
    
}
