package com.samyar.pricing.models;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.UpdateTimestamp;

import io.quarkus.hibernate.reactive.panache.PanacheEntityBase;
import jakarta.persistence.*;

@Entity
@Table(name = "PricingModels", schema = "pricing")
public class PricingModel extends PanacheEntityBase {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID modelId;

    @Column(length = 255)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "PricingModelQuantityPricings",
        schema="pricing",
        joinColumns = @JoinColumn(name = "modelId"),
        inverseJoinColumns = @JoinColumn(name = "quantityPricingId")
    )
    private List<QuantityWithPricing> quantityPricings = new ArrayList<>();

    // @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    // @JoinTable(
    //     name = "PricingModelSizePricings",
    //     joinColumns = @JoinColumn(name = "modelId"),
    //     inverseJoinColumns = @JoinColumn(name = "sizePricingId")
    // )
    // private List<SizeWithPricing> sizePricings = new ArrayList<>();

    // @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    // @JoinTable(
    //     name = "PricingModelTypePricings",
    //     joinColumns = @JoinColumn(name = "modelId"),
    //     inverseJoinColumns = @JoinColumn(name = "typePricingId")
    // )
    // private List<TypeWithPricing> typePricings = new ArrayList<>();

    // @OneToMany(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    // @JoinTable(
    //     name = "PricingModelQualityPricings",
    //     joinColumns = @JoinColumn(name = "modelId"),
    //     inverseJoinColumns = @JoinColumn(name = "qualityPricingId")
    // )
    // private List<QualityWithPricing> qualityPricings = new ArrayList<>();
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private OffsetDateTime updatedAt;

    private UUID createdBy;

    private UUID updatedBy;

    public UUID getModelId() {
        return modelId;
    }

    public void setModelId(UUID modelId) {
        this.modelId = modelId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<QuantityWithPricing> getQuantityPricings() {
        return quantityPricings;
    }

    public void setQuantityPricings(List<QuantityWithPricing> quantityPricings) {
        this.quantityPricings = quantityPricings;
    }

    // public List<SizeWithPricing> getSizePricings() {
    //     return sizePricings;
    // }

    // public void setSizePricings(List<SizeWithPricing> sizePricings) {
    //     this.sizePricings = sizePricings;
    // }

    // public List<TypeWithPricing> getTypePricings() {
    //     return typePricings;
    // }

    // public void setTypePricings(List<TypeWithPricing> typePricings) {
    //     this.typePricings = typePricings;
    // }

    // public List<QualityWithPricing> getQualityPricings() {
    //     return qualityPricings;
    // }

    // public void setQualityPricings(List<QualityWithPricing> qualityPricings) {
    //     this.qualityPricings = qualityPricings;
    // }

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

