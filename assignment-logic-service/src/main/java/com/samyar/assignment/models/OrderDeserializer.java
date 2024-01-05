package com.samyar.assignment.models;

import io.quarkus.kafka.client.serialization.ObjectMapperDeserializer;

public class OrderDeserializer extends ObjectMapperDeserializer<Order> {
    public OrderDeserializer(){
        super(Order.class);
    }
    
}
