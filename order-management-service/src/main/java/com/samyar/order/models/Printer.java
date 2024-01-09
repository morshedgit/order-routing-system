package com.samyar.order.models;

import java.util.UUID;

public class Printer {

    public UUID printerId;
    
    public String name;

    public Location location;

    public UUID getPrinterId() {
        return printerId;
    }

    public void setPrinterId(UUID printerId) {
        this.printerId = printerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    
    
}
