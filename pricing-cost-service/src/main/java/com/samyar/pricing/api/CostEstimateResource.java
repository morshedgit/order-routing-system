package com.samyar.pricing.api;

import java.util.List;
import java.util.UUID;

import com.samyar.pricing.models.CostEstimate;

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

@Path("/cost-estimates")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CostEstimateResource {

    @GET
    public Uni<List<CostEstimate>> getAll() {
        return CostEstimate.listAll(Sort.by("createdAt"));
    }

    @GET
    @Path("{id}")
    public Uni<CostEstimate> getById(UUID id) {
        return CostEstimate.findById(id);
    }

    @POST
    public Uni<Response> create(CostEstimate estimate) {
        if (estimate == null) {
            throw new WebApplicationException("Cost Estimate is required", 422);
        }
        return Panache.withTransaction(estimate::persist)
                .replaceWith(Response.ok(estimate).status(CREATED)::build);
    }

    @PUT
    @Path("{id}")
    public Uni<Response> update(UUID id, CostEstimate estimate) {
        if (estimate == null) {
            throw new WebApplicationException("Cost Estimate is required", 422);
        }
        return Panache.withTransaction(() -> CostEstimate.<CostEstimate>findById(id)
                .onItem().ifNotNull().invoke(entity -> {
                    entity.setCost(estimate.getCost());
                    // Update other fields as necessary
                })
            )
            .onItem().ifNotNull().transform(entity -> Response.ok(entity).build())
            .onItem().ifNull().continueWith(Response.ok().status(NOT_FOUND)::build);
    }

    @DELETE
    @Path("{id}")
    public Uni<Response> delete(UUID id) {
        return Panache.withTransaction(() -> CostEstimate.deleteById(id))
                .map(deleted -> deleted ? Response.ok().status(NO_CONTENT).build() : Response.ok().status(NOT_FOUND).build());
    }
}
