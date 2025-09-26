#!/bin/bash
set -e

echo "Starting build process..."

# Install dependencies
npm install --legacy-peer-deps

# Make vite executable
chmod +x node_modules/.bin/vite

# Run the build
npm run build

echo "Build completed successfully!"
