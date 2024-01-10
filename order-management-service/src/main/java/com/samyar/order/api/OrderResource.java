package com.samyar.order.api;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import io.quarkus.hibernate.reactive.panache.Panache;
import io.quarkus.panache.common.Sort;
import io.smallrye.common.annotation.Blocking;
import io.smallrye.mutiny.Uni;
import org.eclipse.microprofile.reactive.messaging.Channel;
import org.eclipse.microprofile.reactive.messaging.Emitter;

import java.util.List;
import java.util.UUID;

import com.samyar.order.models.Order;
import com.samyar.order.models.OrderProgress;
import com.samyar.order.services.OrderProgressService;

import static jakarta.ws.rs.core.Response.Status.CREATED;
import static jakarta.ws.rs.core.Response.Status.NOT_FOUND;
import static jakarta.ws.rs.core.Response.Status.NO_CONTENT;

@Path("/orders")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class OrderResource {

    @Inject
    @Channel("orders-out")
    Emitter<Order> orderEmitter;

    @Inject
    OrderProgressService orderProgressService;
    
    @GET
    public Uni<List<Order>> get() {
        return Order.listAll(Sort.by("createdAt"));
    }

    @GET
    @Path("{id}")
    public Uni<Order> getById(UUID id){
        return Order.findById(id);
    }

    @GET
    @Path("{id}/order-progress")
    public Uni<OrderProgress> getOrderProgressById(UUID id){
        return orderProgressService.getOrderProgressByOrderId(id);
    }
    
    @POST
    public Uni<Response> create(Order order) {
        if (order == null) {
            throw new WebApplicationException("Order should not be null.", 422);
        }

        return Panache.withTransaction(() -> order.persist())
            .onItem().invoke(() -> orderEmitter.send(order))
            .replaceWith(() -> Response.ok(order).status(Response.Status.CREATED).build());
    }

    @PUT
    @Path("{id}")
    public Uni<Response> udpate(UUID id, Order order){
        if(order == null){
            throw new WebApplicationException("Order is required", 422);
        };
        return Panache
            .withTransaction(()->Order.<Order>findById(id)
                .onItem().ifNotNull().invoke(entity-> entity.setStatus(order.getStatus()))
            )
            .onItem().ifNotNull().transform(entity -> Response.ok(entity).build())
            .onItem().ifNull().continueWith(Response.ok().status(NOT_FOUND)::build);
    }

    @DELETE
    @Path("{id}")
    public Uni<Response> delete(UUID id){
        return Panache
            .withTransaction(()->Order.deleteById(id)
            )
            .map(deleted -> deleted
                    ? Response.ok().status(NO_CONTENT).build()
                    : Response.ok().status(NOT_FOUND).build());
    }
}

