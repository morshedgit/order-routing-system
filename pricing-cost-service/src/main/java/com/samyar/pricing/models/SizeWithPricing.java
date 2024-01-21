package com.samyar.pricing.models;

import java.time.OffsetDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.UpdateTimestamp;

import io.quarkus.hibernate.reactive.panache.PanacheEntityBase;
import jakarta.persistence.*;

@Entity
@Table(name = "SizeWithPricing", schema = "pricing")
public class SizeWithPricing extends PanacheEntityBase {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID sizePricingId;
    
    private String sizeLabel;
    private String sizeDescription;
    private double sizeRelativePricing; 
    private double sizeFixedPricing; 

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private OffsetDateTime updatedAt;

    private UUID createdBy;

    private UUID updatedBy;

    public UUID getId() {
        return sizePricingId;
    }

    public void setId(UUID id) {
        this.sizePricingId = id;
    }

    public String getSizeLabel() {
        return sizeLabel;
    }

    public void setSizeLabel(String sizeLabel) {
        this.sizeLabel = sizeLabel;
    }

    public String getSizeDescription() {
        return sizeDescription;
    }

    public void setSizeDescription(String sizeDescription) {
        this.sizeDescription = sizeDescription;
    }

    public double getSizeRelativePricing() {
        return sizeRelativePricing;
    }

    public void setSizeRelativePricing(double sizeRelativePricing) {
        this.sizeRelativePricing = sizeRelativePricing;
    }

    public double getSizeFixedPricing() {
        return sizeFixedPricing;
    }

    public void setSizeFixedPricing(double sizeFixedPricing) {
        this.sizeFixedPricing = sizeFixedPricing;
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
    
    
}
