package com.samyar.assignment.clients;

import io.smallrye.mutiny.Uni;
import jakarta.ws.rs.*;

import java.util.List;

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import com.samyar.assignment.models.Printer;

@Path("/printers")
@RegisterRestClient(configKey = "printer-api")
public interface PrinterService {

    @GET
    Uni<List<Printer>> getPrinters();

    @GET
    @Path("{printerId}")
    Uni<Printer> getPrinter();
}