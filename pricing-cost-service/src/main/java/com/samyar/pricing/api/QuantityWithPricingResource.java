package com.samyar.pricing.api;

import java.util.List;
import java.util.UUID;

import com.samyar.pricing.models.QuantityWithPricing;

import io.quarkus.hibernate.reactive.panache.Panache;
import io.quarkus.panache.common.Sort;
import io.smallrye.mutiny.Uni;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.MediaType;
import static jakarta.ws.rs.core.Response.Status.*;

@Path("/pricing-models/quantity-pricings")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class QuantityWithPricingResource {


    @GET
    public Uni<List<QuantityWithPricing>> getAll() {
        return QuantityWithPricing.listAll(Sort.by("createdAt"));
    }

    @GET
    @Path("{id}")
    public Uni<QuantityWithPricing> getById(UUID id) {
        return QuantityWithPricing.findById(id);
    }

    @POST
    public Uni<Response> create(QuantityWithPricing model) {
        if (model == null) {
            throw new WebApplicationException("Pricing Model is required", 422);
        }
        
        return Panache.withTransaction(model::persist)
                .replaceWith(Response.ok(model).status(CREATED)::build);
    }

    @DELETE
    @Path("{id}")
    public Uni<Response> delete(UUID id) {
        return Panache.withTransaction(() -> QuantityWithPricing.deleteById(id))
                .map(deleted -> deleted ? Response.ok().status(NO_CONTENT).build() : Response.ok().status(NOT_FOUND).build());
    }
}
