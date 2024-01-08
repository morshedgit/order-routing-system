#!/bin/bash
set -e

# Perform all actions as $POSTGRES_USER
export PGPASSWORD=$POSTGRES_PASSWORD

# Connect to the 'ors' database and create the schema and table
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "ors" <<-EOSQL
  CREATE SCHEMA IF NOT EXISTS assignments;
  SET search_path TO assignments;

  CREATE TABLE IF NOT EXISTS AssignmentCriteria (
      cost NUMERIC(38,2),
      productionTime NUMERIC(21,0),
      createdAt TIMESTAMP(6) WITH TIME ZONE NOT NULL,
      updatedAt TIMESTAMP(6) WITH TIME ZONE NOT NULL,
      createdBy UUID,
      criteriaId UUID NOT NULL,
      updatedBy UUID,
      quality VARCHAR(255),
      PRIMARY KEY (criteriaId)
  );
EOSQL
