package com.samyar.assignment.clients;

import io.smallrye.mutiny.Uni;
import jakarta.ws.rs.*;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import com.samyar.assignment.models.Order;

@Path("/orders")
@RegisterRestClient(configKey = "order-api")
public interface OrderService {

    @GET
    @Path("{orderId}")
    Uni<Order> getOrder();
}