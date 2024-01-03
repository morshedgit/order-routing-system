package com.samyar.order.api;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import io.quarkus.hibernate.reactive.panache.Panache;
import io.quarkus.panache.common.Sort;
import io.smallrye.mutiny.Uni;

import java.util.List;
import java.util.UUID;

import com.samyar.order.models.OrderSpecification;

import static jakarta.ws.rs.core.Response.Status.CREATED;
import static jakarta.ws.rs.core.Response.Status.NOT_FOUND;
import static jakarta.ws.rs.core.Response.Status.NO_CONTENT;

@Path("/order-specifications")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class OrderSpecificationResource {
    @GET
    public Uni<List<OrderSpecification>> get() {
        return OrderSpecification.listAll(Sort.by("createdAt"));
    }

    @GET
    @Path("{id}")
    public Uni<OrderSpecification> getById(UUID id){
        return OrderSpecification.findById(id);
    }

    @POST
    public Uni<Response> create(OrderSpecification orderSpecification){
        if(orderSpecification == null ){
            throw new WebApplicationException("Order Specification was invalidly set on request.", 422);
        }
        return Panache.withTransaction(orderSpecification::persist)
                .replaceWith(Response.ok(orderSpecification).status(CREATED)::build);
    }

    @PUT
    @Path("{id}")
    public Uni<Response> update(UUID id, OrderSpecification orderSpecification){
        if(orderSpecification == null){
            throw new WebApplicationException("Order Specification is required", 422);
        }
        return Panache
            .withTransaction(() -> OrderSpecification.<OrderSpecification>findById(id)
                .onItem().ifNotNull().invoke(entity -> {
                    entity.setSize(orderSpecification.getSize());
                    entity.setPaperType(orderSpecification.getPaperType());
                    entity.setQuantity(orderSpecification.getQuantity());
                    // other fields to update
                })
            )
            .onItem().ifNotNull().transform(entity -> Response.ok(entity).build())
            .onItem().ifNull().continueWith(Response.ok().status(NOT_FOUND)::build);
    }

    @DELETE
    @Path("{id}")
    public Uni<Response> delete(UUID id){
        return Panache
            .withTransaction(() -> OrderSpecification.deleteById(id))
            .map(deleted -> deleted
                    ? Response.ok().status(NO_CONTENT).build()
                    : Response.ok().status(NOT_FOUND).build());
    }
}
