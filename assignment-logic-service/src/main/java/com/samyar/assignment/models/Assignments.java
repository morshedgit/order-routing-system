package com.samyar.assignment.models;


import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.UpdateTimestamp;

import io.quarkus.hibernate.reactive.panache.PanacheEntityBase;

@Entity
@Table(name = "Assignments")
public class Assignments extends PanacheEntityBase {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID assignmentId;

    @Column(columnDefinition = "uuid")
    private UUID orderId;

    @Column(columnDefinition = "uuid")
    private UUID printerId;

    @Column(columnDefinition = "uuid")
    private UUID criteriaId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "criteriaId", referencedColumnName = "criteriaId", insertable = false, updatable = false)
    private AssignmentCriteria criteria;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private OffsetDateTime updatedAt;

    private UUID createdBy;

    private UUID updatedBy;

    public UUID getAssignmentId() {
        return assignmentId;
    }

    public void setAssignmentId(UUID assignmentId) {
        this.assignmentId = assignmentId;
    }

    public UUID getOrderId() {
        return orderId;
    }

    public void setOrderId(UUID orderId) {
        this.orderId = orderId;
    }

    public UUID getPrinterId() {
        return printerId;
    }

    public void setPrinterId(UUID printerId) {
        this.printerId = printerId;
    }

    public UUID getCriteriaId() {
        return criteriaId;
    }

    public void setCriteriaId(UUID criteriaId) {
        this.criteriaId = criteriaId;
    }

    public AssignmentCriteria getCriteria() {
        return criteria;
    }

    public void setCriteria(AssignmentCriteria criteria) {
        this.criteria = criteria;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public UUID getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UUID createdBy) {
        this.createdBy = createdBy;
    }

    public UUID getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(UUID updatedBy) {
        this.updatedBy = updatedBy;
    }

    // Getters and Setters
}
