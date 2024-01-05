package com.samyar.assignment.models;

import java.time.OffsetDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.UpdateTimestamp;

import io.quarkus.hibernate.reactive.panache.PanacheEntityBase;
import jakarta.persistence.*;


public class PrinterCapability  {

    public UUID capabilityId;

    
    public UUID printerId;

    
    public Printer printer;

    
    public String printType;

    public int volumeCapacity;

    
    public OffsetDateTime createdAt;

    
    public OffsetDateTime updatedAt;

    public UUID createdBy;

    public UUID updatedBy;

    public UUID getCapabilityId() {
        return capabilityId;
    }

    public void setCapabilityId(UUID capabilityId) {
        this.capabilityId = capabilityId;
    }

    public UUID getPrinterId() {
        return printerId;
    }

    public void setPrinterId(UUID printerId) {
        this.printerId = printerId;
    }

    public Printer getPrinter() {
        return printer;
    }

    public void setPrinter(Printer printer) {
        this.printer = printer;
    }

    public String getPrintType() {
        return printType;
    }

    public void setPrintType(String printType) {
        this.printType = printType;
    }

    public int getVolumeCapacity() {
        return volumeCapacity;
    }

    public void setVolumeCapacity(int volumeCapacity) {
        this.volumeCapacity = volumeCapacity;
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
