package com.samyar.printer.api;

import java.util.List;
import java.util.UUID;

import com.samyar.printer.models.Location;

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

@Path("/locations")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class LocationResource {

    @GET
    public Uni<List<Location>> getAll() {
        return Location.listAll(Sort.by("createdAt"));
    }

    @GET
    @Path("{id}")
    public Uni<Location> getById(UUID id) {
        return Location.findById(id);
    }

    @POST
    public Uni<Response> create(Location location) {
        if (location == null) {
            throw new WebApplicationException("Location is required", 422);
        }
        return Panache.withTransaction(location::persist)
                .replaceWith(Response.ok(location).status(CREATED)::build);
    }

    @PUT
    @Path("{id}")
    public Uni<Response> update(UUID id, Location location) {
        if (location == null) {
            throw new WebApplicationException("Location is required", 422);
        }
        return Panache.withTransaction(() -> Location.<Location>findById(id)
                .onItem().ifNotNull().invoke(entity -> {
                    entity.setAddress(location.getAddress());
                    entity.setCity(location.getCity());
                    // Set other fields as necessary
                })
            )
            .onItem().ifNotNull().transform(entity -> Response.ok(entity).build())
            .onItem().ifNull().continueWith(Response.ok().status(NOT_FOUND)::build);
    }

    @DELETE
    @Path("{id}")
    public Uni<Response> delete(UUID id) {
        return Panache.withTransaction(() -> Location.deleteById(id))
                .map(deleted -> deleted ? Response.ok().status(NO_CONTENT).build() : Response.ok().status(NOT_FOUND).build());
    }
}

