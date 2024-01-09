package com.samyar.order.clients;

import io.smallrye.mutiny.Uni;
import jakarta.ws.rs.*;

import java.util.List;
import java.util.UUID;

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import com.samyar.order.models.Printer;

@Path("/printers")
@RegisterRestClient(configKey = "printer-api")
public interface PrinterService {

    @GET
    Uni<List<Printer>> getPrinters();

    @GET
    @Path("{printerId}")
    Uni<Printer> getPrinter(@PathParam("printerId") UUID printerId);
}