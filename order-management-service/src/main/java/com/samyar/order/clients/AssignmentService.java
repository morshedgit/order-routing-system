package com.samyar.order.clients;

import io.smallrye.mutiny.Uni;
import jakarta.ws.rs.*;

import java.util.UUID;

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import com.samyar.order.models.Assignment;

@Path("/assignments")
@RegisterRestClient(configKey = "assignments-api")
public interface AssignmentService {

    @GET
    @Path("/order/{orderId}")
    Uni<Assignment> getAssignment(@PathParam("orderId") UUID orderId);
}