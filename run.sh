#!/bin/bash

# Run docker compose up
docker compose up -d

# Check for errors
if [ $? -ne 0 ]; then
    echo "Error running docker compose up"
    exit 1
fi

# Navigate to the gateway directory and run npm
cd ./apps/gateway
npm run start:dev &

# Check for errors
if [ $? -ne 0 ]; then
    echo "Error running npm in gateway"
    exit 1
fi

# Navigate to the products directory and run npm
cd ../products
npm run start:dev &

# Check for errors
if [ $? -ne 0 ]; then
    echo "Error running npm in products"
    exit 1
fi

# Navigate to the auth directory and run npm
cd ../auth
npm run start:dev &

# Check for errors
if [ $? -ne 0 ]; then
    echo "Error running npm in auth"
    exit 1
fi

# Wait for all background processes
wait

echo "All services have been successfully started."