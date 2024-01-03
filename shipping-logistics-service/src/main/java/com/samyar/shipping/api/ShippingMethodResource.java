package com.samyar.shipping.api;

import java.util.List;
import java.util.UUID;

import com.samyar.shipping.models.ShippingMethod;

import io.quarkus.hibernate.reactive.panache.Panache;
import io.quarkus.panache.common.Sort;
import io.smallrye.mutiny.Uni;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.MediaType;
import static jakarta.ws.rs.core.Response.Status.*;

@Path("/shipping-methods")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ShippingMethodResource {

    @GET
    public Uni<List<ShippingMethod>> getAll() {
        return ShippingMethod.listAll(Sort.by("createdAt"));
    }

    @GET
    @Path("{id}")
    public Uni<ShippingMethod> getById(UUID id) {
        return ShippingMethod.findById(id);
    }

    @POST
    public Uni<Response> create(ShippingMethod method) {
        if (method == null) {
            throw new WebApplicationException("Shipping Method is required", 422);
        }
        return Panache.withTransaction(method::persist)
                .replaceWith(Response.ok(method).status(CREATED)::build);
    }

    @PUT
    @Path("{id}")
    public Uni<Response> update(UUID id, ShippingMethod method) {
        if (method == null) {
            throw new WebApplicationException("Shipping Method is required", 422);
        }
        return Panache.withTransaction(() -> ShippingMethod.<ShippingMethod>findById(id)
                .onItem().ifNotNull().invoke(entity -> {
                    entity.setName(method.getName());
                    entity.setEstimatedDeliveryTime(method.getEstimatedDeliveryTime());
                    // Update other fields as necessary
                })
            )
            .onItem().ifNotNull().transform(entity -> Response.ok(entity).build())
            .onItem().ifNull().continueWith(Response.ok().status(NOT_FOUND)::build);
    }

    @DELETE
    @Path("{id}")
    public Uni<Response> delete(UUID id) {
        return Panache.withTransaction(() -> ShippingMethod.deleteById(id))
                .map(deleted -> deleted ? Response.ok().status(NO_CONTENT).build() : Response.ok().status(NOT_FOUND).build());
    }
}

