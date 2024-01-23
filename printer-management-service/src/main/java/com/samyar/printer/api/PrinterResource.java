package com.samyar.printer.api;

import java.util.List;
import java.util.UUID;

import com.samyar.printer.models.Printer;

import io.quarkus.hibernate.reactive.panache.Panache;
import io.quarkus.panache.common.Sort;
import io.smallrye.mutiny.Uni;
import jakarta.annotation.security.RolesAllowed;
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

@Path("/printers")
@RolesAllowed("member")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PrinterResource {

    @GET
    public Uni<List<Printer>> getAll() {
        return Printer.listAll(Sort.by("createdAt"));
    }

    @GET
    @Path("{id}")
    public Uni<Printer> getById(UUID id) {
        return Printer.findById(id);
    }

    @POST
    public Uni<Response> create(Printer printer) {
        if (printer == null) {
            throw new WebApplicationException("Printer is required", 422);
        }
        return Panache.withTransaction(printer::persist)
                .replaceWith(Response.ok(printer).status(CREATED)::build);
    }

    @PUT
    @Path("{id}")
    public Uni<Response> update(UUID id, Printer printer) {
        if (printer == null) {
            throw new WebApplicationException("Printer is required", 422);
        }
        return Panache.withTransaction(() -> Printer.<Printer>findById(id)
                .onItem().ifNotNull().invoke(entity -> {
                    entity.setName(printer.getName());
                    // Set other fields as necessary
                })
            )
            .onItem().ifNotNull().transform(entity -> Response.ok(entity).build())
            .onItem().ifNull().continueWith(Response.ok().status(NOT_FOUND)::build);
    }

    @DELETE
    @Path("{id}")
    public Uni<Response> delete(UUID id) {
        return Panache.withTransaction(() -> Printer.deleteById(id))
                .map(deleted -> deleted ? Response.ok().status(NO_CONTENT).build() : Response.ok().status(NOT_FOUND).build());
    }
}

