#!/bin/bash

# Start backend services
cd eigen-protected-avs-backend
yarn start &

# Start frontend
cd ../eigen-protected-avs-frontend
yarn dev &

# Start monitoring
cd ..
yarn ts-node scripts/monitor.ts &

# Wait for all background processes
wait 