package com.samyar.order.api;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import io.quarkus.hibernate.reactive.panache.Panache;
import io.quarkus.panache.common.Sort;
import io.smallrye.mutiny.Uni;

import java.util.List;
import java.util.UUID;

import com.samyar.order.models.Customer;

import static jakarta.ws.rs.core.Response.Status.CREATED;
import static jakarta.ws.rs.core.Response.Status.NOT_FOUND;
import static jakarta.ws.rs.core.Response.Status.NO_CONTENT;

@Path("/customers")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CustomerResource {
    @GET
    public Uni<List<Customer>> get() {
        return Customer.listAll(Sort.by("createdAt"));
    }

    @GET
    @Path("{id}")
    public Uni<Customer> getById(UUID id){
        return Customer.findById(id);
    }
    
    @POST
    public Uni<Response> create(Customer customer){
        if(customer == null ){
            throw new WebApplicationException("Id was invalidly set on request.",422);
        }
        return Panache.withTransaction(customer::persist)
            .replaceWith(Response.ok(customer).status(CREATED)::build);
    }

    @PUT
    @Path("{id}")
    public Uni<Response> udpate(UUID id, Customer customer){
        if(customer == null){
            throw new WebApplicationException("customer is required", 422);
        };
        return Panache
            .withTransaction(()->Customer.<Customer>findById(id)
                .onItem().ifNotNull().invoke(entity-> entity.setName(customer.getName()))
            )
            .onItem().ifNotNull().transform(entity -> Response.ok(entity).build())
            .onItem().ifNull().continueWith(Response.ok().status(NOT_FOUND)::build);
    }

    @DELETE
    @Path("{id}")
    public Uni<Response> delete(UUID id){
        return Panache
            .withTransaction(()->Customer.deleteById(id)
            )
            .map(deleted -> deleted
                    ? Response.ok().status(NO_CONTENT).build()
                    : Response.ok().status(NOT_FOUND).build());
    }
}

