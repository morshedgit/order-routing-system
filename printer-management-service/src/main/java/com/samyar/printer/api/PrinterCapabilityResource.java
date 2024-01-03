package com.samyar.printer.api;

import java.util.List;
import java.util.UUID;

import com.samyar.printer.models.Location;
import com.samyar.printer.models.Printer;
import com.samyar.printer.models.PrinterCapability;

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

@Path("/printer-capabilities")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PrinterCapabilityResource {

    @GET
    public Uni<List<PrinterCapability>> getAll() {
        return PrinterCapability.listAll(Sort.by("createdAt"));
    }

    @GET
    @Path("{id}")
    public Uni<PrinterCapability> getById(UUID id) {
        return PrinterCapability.findById(id);
    }

    @POST
    public Uni<Response> create(PrinterCapability capability) {
        if (capability == null) {
            throw new WebApplicationException("Printer Capability is required", 422);
        }
        return Panache.withTransaction(capability::persist)
                .replaceWith(Response.ok(capability).status(CREATED)::build);
    }

    @PUT
    @Path("{id}")
    public Uni<Response> update(UUID id, PrinterCapability capability) {
        if (capability == null) {
            throw new WebApplicationException("Printer Capability is required", 422);
        }
        return Panache.withTransaction(() -> PrinterCapability.<PrinterCapability>findById(id)
                .onItem().ifNotNull().invoke(entity -> {
                    entity.setPrintType(capability.getPrintType());
                    entity.setVolumeCapacity(capability.getVolumeCapacity());
                    // Set other fields as necessary
                })
            )
            .onItem().ifNotNull().transform(entity -> Response.ok(entity).build())
            .onItem().ifNull().continueWith(Response.ok().status(NOT_FOUND)::build);
    }

    @DELETE
    @Path("{id}")
    public Uni<Response> delete(UUID id) {
        return Panache.withTransaction(() -> PrinterCapability.deleteById(id))
                .map(deleted -> deleted ? Response.ok().status(NO_CONTENT).build() : Response.ok().status(NOT_FOUND).build());
    }
}
