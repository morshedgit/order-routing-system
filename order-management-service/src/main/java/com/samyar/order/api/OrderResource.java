package com.samyar.order.api;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import io.quarkus.hibernate.reactive.panache.Panache;
import io.quarkus.panache.common.Sort;
import io.smallrye.mutiny.Uni;

import java.util.List;
import java.util.Optional;

import com.samyar.order.models.Order;
import com.samyar.order.service.OrderService;

import static jakarta.ws.rs.core.Response.Status.CREATED;
import static jakarta.ws.rs.core.Response.Status.NOT_FOUND;
import static jakarta.ws.rs.core.Response.Status.NO_CONTENT;

@Path("/orders")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class OrderResource {

    // @Inject
    // OrderService orderService;

    // // Create an Order
    // @POST
    // public Uni<Response> createOrder(Order order) {
    //     return orderService.createOrder(order)
    //                        .onItem().transform(createdOrder -> Response.ok(createdOrder).status(Response.Status.CREATED).build());
    // }

    // // Get an Order by ID
    // @GET
    // @Path("/{orderId}")
    // public Uni<Response> getOrder(@PathParam("orderId") Long orderId) {
    //     return orderService.getOrder(orderId)
    //                        .onItem().transform(order -> order != null ? Response.ok(order).build() : Response.status(Response.Status.NOT_FOUND).build());
    // }

    // // Update an Order
    // @PUT
    // @Path("/{orderId}")
    // public Uni<Response> updateOrder(@PathParam("orderId") Long orderId, Order order) {
    //     return orderService.updateOrder(orderId, order)
    //                        .onItem().transform(updatedOrder -> updatedOrder != null ? Response.ok(updatedOrder).build() : Response.status(Response.Status.NOT_FOUND).build());
    // }

    // // Delete an Order
    // @DELETE
    // @Path("/{orderId}")
    // public Uni<Response> deleteOrder(@PathParam("orderId") Long orderId) {
    //     return orderService.deleteOrder(orderId)
    //                        .onItem().transform(deleted -> deleted ? Response.ok().status(Response.Status.NO_CONTENT).build() : Response.status(Response.Status.NOT_FOUND).build());
    // }

    // // Get Orders with Pagination and Optional Filtering
    // @GET
    // public Uni<Response> getOrders(@QueryParam("status") Optional<String> statusFilter,
    //                                @QueryParam("page") @DefaultValue("0") int pageIndex,
    //                                @QueryParam("size") @DefaultValue("10") int pageSize) {
    //     return orderService.getOrders(statusFilter, pageIndex, pageSize)
    //                        .onItem().transform(orders -> Response.ok(orders).build());
    // }
    @GET
    public Uni<List<Order>> get() {
        return Order.listAll(Sort.by("createdAt"));
    }

    @GET
    @Path("{id}")
    public Uni<Order> getById(Long id){
        return Order.findById(id);
    }
    
    @POST
    public Uni<Response> create(Order order){
        if(order == null ){
            throw new WebApplicationException("Id was invalidly set on request.",422);
        }
        return Panache.withTransaction(order::persist)
            .replaceWith(Response.ok(order).status(CREATED)::build);
    }

    @PUT
    @Path("{id}")
    public Uni<Response> udpate(Long id, Order order){
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
    public Uni<Response> delete(Long id){
        return Panache
            .withTransaction(()->Order.deleteById(id)
            )
            .map(deleted -> deleted
                    ? Response.ok().status(NO_CONTENT).build()
                    : Response.ok().status(NOT_FOUND).build());
    }
}

