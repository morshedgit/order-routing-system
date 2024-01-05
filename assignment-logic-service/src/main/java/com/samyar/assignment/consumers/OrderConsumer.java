package com.samyar.assignment.consumers;

import org.eclipse.microprofile.reactive.messaging.Incoming;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import com.samyar.assignment.clients.PrinterService;
import com.samyar.assignment.models.Order;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class OrderConsumer {


    @Inject
    @RestClient
    PrinterService printerService;

    @Incoming("orders")
    public void receive(Order order) {
        System.out.println("Entered receive method");
    
        printerService.getPrinters().onItem().invoke(printers -> {
            printers.forEach(printer->System.out.println("Printer City: "+ printer.getLocation().getCity()));
        }).onFailure().invoke(th -> {
            System.out.println("Error occurred: " + th.getMessage());
        }).subscribe().with(item -> {}, failure -> {});
    
        System.out.println("Leaving receive method");
    }
}

