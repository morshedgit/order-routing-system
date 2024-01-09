#!/bin/bash

# Stop all running Docker containers
echo "Stoping docker compose..."
docker compose down

# Stop all running Docker containers
echo "Stopping all running Docker containers..."
docker stop $(docker ps -aq)

# Remove all Docker containers
echo "Removing all Docker containers..."
docker rm $(docker ps -aq)

# List all Docker volumes
echo "Listing all Docker volumes..."
docker volume ls

# Remove specific Docker volume
VOLUME_NAME="order-routing-system_postgres-data"
echo "Removing Docker volume: $VOLUME_NAME"
docker volume rm $VOLUME_NAME

echo "Cleanup complete."

cd assignment-logic-service
echo "Building assignment service..."
./mvnw clean package 
cd ..

cd order-management-service
echo "Building order service..."
./mvnw clean package 
cd ..

cd printer-management-service
echo "Building printer service..."
./mvnw clean package 
cd ..

# Start Docker Compose
echo "Docker Compose Building..."
docker compose build --no-cache

# Start Docker Compose
echo "Starting Docker Compose..."
docker compose up -d

echo "Docker Compose started."
