#!/bin/bash
set -e

# Perform all actions as $POSTGRES_USER
export PGPASSWORD=$POSTGRES_PASSWORD

# Connect to the 'ors' database and create the schema and table
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "ors" <<-EOSQL
  -- Create the 'assignments' schema
  CREATE SCHEMA IF NOT EXISTS assignments;

  -- Set the search path to the 'assignments' schema
  SET search_path TO assignments;

  -- Create tables within the 'assignments' schema
  CREATE TABLE assignments.AssignmentCriteria (
      criteriaId UUID NOT NULL PRIMARY KEY,
      cost NUMERIC(38,2),
      productionTime NUMERIC(21,0),
      createdAt TIMESTAMP WITH TIME ZONE NOT NULL,
      updatedAt TIMESTAMP WITH TIME ZONE NOT NULL,
      createdBy UUID,
      updatedBy UUID,
      quality VARCHAR(255)
  );

  CREATE TABLE assignments.Assignments (
      assignmentId UUID NOT NULL PRIMARY KEY,
      createdAt TIMESTAMP WITH TIME ZONE NOT NULL,
      updatedAt TIMESTAMP WITH TIME ZONE NOT NULL,
      createdBy UUID,
      criteriaId UUID,
      orderId UUID,
      printerId UUID,
      updatedBy UUID,
      FOREIGN KEY (criteriaId) REFERENCES assignments.AssignmentCriteria(criteriaId)
  );

  -- Create the 'orders' schema
  CREATE SCHEMA IF NOT EXISTS orders;

  -- Set the search path to the 'orders' schema
  SET search_path TO orders;

  -- Create Customers table
  CREATE TABLE Customers (
      customerId UUID NOT NULL PRIMARY KEY,
      name VARCHAR(255),
      contactDetails JSONB,
      createdAt TIMESTAMP WITH TIME ZONE NOT NULL,
      updatedAt TIMESTAMP WITH TIME ZONE NOT NULL,
      createdBy UUID,
      updatedBy UUID
  );

  -- Create OrderSpecifications table
  CREATE TABLE OrderSpecifications (
      specificationsId UUID NOT NULL PRIMARY KEY,
      paperType VARCHAR(255),
      size VARCHAR(255),
      quantity INTEGER NOT NULL,
      createdAt TIMESTAMP WITH TIME ZONE NOT NULL,
      updatedAt TIMESTAMP WITH TIME ZONE NOT NULL,
      createdBy UUID,
      updatedBy UUID
  );

  -- Create Orders table
  CREATE TABLE Orders (
      orderId UUID NOT NULL PRIMARY KEY,
      customerId UUID,
      specificationsId UUID,
      status VARCHAR(255),
      createdAt TIMESTAMP WITH TIME ZONE NOT NULL,
      updatedAt TIMESTAMP WITH TIME ZONE NOT NULL,
      createdBy UUID,
      updatedBy UUID,
      FOREIGN KEY (customerId) REFERENCES Customers(customerId),
      FOREIGN KEY (specificationsId) REFERENCES OrderSpecifications(specificationsId)
  );

  

  -- Create the 'printers' schema
  CREATE SCHEMA IF NOT EXISTS printers;

  -- Set the search path to the 'printers' schema
  SET search_path TO printers;

  -- Create Locations table
    CREATE TABLE Locations (
        locationId UUID NOT NULL PRIMARY KEY,
        address TEXT,
        city VARCHAR(255),
        createdAt TIMESTAMP WITH TIME ZONE NOT NULL,
        updatedAt TIMESTAMP WITH TIME ZONE NOT NULL,
        createdBy UUID,
        updatedBy UUID
    );

    -- Create PrinterCapabilities table
    CREATE TABLE PrinterCapabilities (
        capabilityId UUID NOT NULL PRIMARY KEY,
        printType VARCHAR(255),
        volumeCapacity INTEGER NOT NULL,
        createdAt TIMESTAMP WITH TIME ZONE NOT NULL,
        updatedAt TIMESTAMP WITH TIME ZONE NOT NULL,
        createdBy UUID,
        updatedBy UUID
    );

    -- Create Printers table
    CREATE TABLE Printers (
        printerId UUID NOT NULL PRIMARY KEY,
        name VARCHAR(255),
        locationId UUID,
        capabilityId UUID,
        createdAt TIMESTAMP WITH TIME ZONE NOT NULL,
        updatedAt TIMESTAMP WITH TIME ZONE NOT NULL,
        createdBy UUID,
        updatedBy UUID,
        FOREIGN KEY (locationId) REFERENCES Locations(locationId),
        FOREIGN KEY (capabilityId) REFERENCES PrinterCapabilities(capabilityId)
    );


EOSQL
