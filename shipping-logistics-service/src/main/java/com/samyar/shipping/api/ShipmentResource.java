package com.samyar.shipping.api;

import java.util.List;
import java.util.UUID;

import com.samyar.shipping.models.Shipment;

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

@Path("/shipments")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ShipmentResource {

    @GET
    public Uni<List<Shipment>> getAll() {
        return Shipment.listAll(Sort.by("createdAt"));
    }

    @GET
    @Path("{id}")
    public Uni<Shipment> getById(UUID id) {
        return Shipment.findById(id);
    }

    @POST
    public Uni<Response> create(Shipment shipment) {
        if (shipment == null) {
            throw new WebApplicationException("Shipment is required", 422);
        }
        return Panache.withTransaction(shipment::persist)
                .replaceWith(Response.ok(shipment).status(CREATED)::build);
    }

    @PUT
    @Path("{id}")
    public Uni<Response> update(UUID id, Shipment shipment) {
        if (shipment == null) {
            throw new WebApplicationException("Shipment is required", 422);
        }
        return Panache.withTransaction(() -> Shipment.<Shipment>findById(id)
                .onItem().ifNotNull().invoke(entity -> {
                    // Update the necessary fields
                })
            )
            .onItem().ifNotNull().transform(entity -> Response.ok(entity).build())
            .onItem().ifNull().continueWith(Response.ok().status(NOT_FOUND)::build);
    }

    @DELETE
    @Path("{id}")
    public Uni<Response> delete(UUID id) {
        return Panache.withTransaction(() -> Shipment.deleteById(id))
                .map(deleted -> deleted ? Response.ok().status(NO_CONTENT).build() : Response.ok().status(NOT_FOUND).build());
    }
}
