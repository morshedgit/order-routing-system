package com.samyar.assignment.blm;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.hibernate.reactive.mutiny.Mutiny;

import com.samyar.assignment.clients.PrinterService;
import com.samyar.assignment.models.AssignmentCriteria;
import com.samyar.assignment.models.Assignments;
import com.samyar.assignment.models.Order;
import com.samyar.assignment.models.Printer;

import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class OrderService {

    @Inject
    @RestClient
    PrinterService printerService;

    @Inject
    Mutiny.SessionFactory sessionFactory;    

    @Transactional
    public Uni<Void> processOrder(Order order) {
        return printerService.getPrinters()
            .onItem().transformToUni(printers -> 
                processPrintersAndCreateCriteria(printers, order)
            )
            .replaceWithVoid();
    }

    private Uni<Void> processPrintersAndCreateCriteria(List<Printer> printers, Order order) {
        AssignmentCriteria assignmentCriteria = createAssignmentCriteria(order);
        return sessionFactory.withTransaction(session ->
            session.persist(assignmentCriteria)
                .onItem().transformToUni(ignored -> {
                    Assignments assignment = createAssignments(order, assignmentCriteria, printers);
                    return session.persist(assignment);
                })
        );
    }

    private AssignmentCriteria createAssignmentCriteria(Order order) {        
            AssignmentCriteria assignmentCriteria = new AssignmentCriteria();
            assignmentCriteria.setCost(BigDecimal.valueOf(100));
            assignmentCriteria.setQuality("GREAT");
            String durationString = "PT20M"; // Replace with your duration string
            Duration duration = Duration.parse(durationString);
            assignmentCriteria.setProductionTime(duration);
            return assignmentCriteria;
    }

    private Assignments createAssignments(Order order, AssignmentCriteria assignmentCriteria,List<Printer> printers) {
        // System.out.println("OrderId: " + order.getOrderId() + 
        //                 ", CriteriaId: " + assignmentCriteria.getCriteriaId() + 
        //                 ", Printers Size: " + printers.size() + 
        //                 ", PrinterIds: " + 
        //                 printers.stream()
        //                         .map(p -> "Id: " + p.getPrinterId())
        //                         .collect(Collectors.joining(", ")));
        // Logic to create Assignments based on order
        Assignments assignments = new Assignments();
        assignments.setCriteriaId(assignmentCriteria.getCriteriaId());
        assignments.setOrderId(order.getOrderId());
        assignments.setPrinterId(printers.getFirst().getPrinterId());
        return assignments;
    }
}
