package com.samyar.pricing.api;

import java.util.List;
import java.util.UUID;

import com.samyar.pricing.models.PricingModel;

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

@Path("/pricing-models")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PricingModelResource {

    @GET
    public Uni<List<PricingModel>> getAll() {
        return PricingModel.listAll(Sort.by("createdAt"));
    }

    @GET
    @Path("{id}")
    public Uni<PricingModel> getById(UUID id) {
        return PricingModel.findById(id);
    }

    @POST
    public Uni<Response> create(PricingModel model) {
        if (model == null) {
            throw new WebApplicationException("Pricing Model is required", 422);
        }
        return Panache.withTransaction(model::persist)
                .replaceWith(Response.ok(model).status(CREATED)::build);
    }

    @PUT
    @Path("{id}")
    public Uni<Response> update(UUID id, PricingModel model) {
        if (model == null) {
            throw new WebApplicationException("Pricing Model is required", 422);
        }
        return Panache.withTransaction(() -> PricingModel.<PricingModel>findById(id)
                .onItem().ifNotNull().invoke(entity -> {
                    entity.setName(model.getName());
                    entity.setDescription(model.getDescription());
                    // Update other fields as necessary
                })
            )
            .onItem().ifNotNull().transform(entity -> Response.ok(entity).build())
            .onItem().ifNull().continueWith(Response.ok().status(NOT_FOUND)::build);
    }

    @DELETE
    @Path("{id}")
    public Uni<Response> delete(UUID id) {
        return Panache.withTransaction(() -> PricingModel.deleteById(id))
                .map(deleted -> deleted ? Response.ok().status(NO_CONTENT).build() : Response.ok().status(NOT_FOUND).build());
    }
}