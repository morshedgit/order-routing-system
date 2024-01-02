package com.samyar.order.api;

import java.util.Arrays;
import java.util.List;

import io.smallrye.mutiny.Uni;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;

@Path("/orders")
public class OrderResource {

    @GET
    public Uni<List<Integer>> getOrders(){
        // Example list of integers
        List<Integer> orders = Arrays.asList(1, 2, 3, 4, 5);
        // Create a Uni that emits this list
        return Uni.createFrom().item(orders);
    }
    
}
