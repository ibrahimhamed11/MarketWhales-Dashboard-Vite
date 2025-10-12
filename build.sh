#!/bin/bash
# Build script for deployment
set -e

echo "Installing dependencies with npm..."
npm ci

echo "Building the application..."
npm run build

echo "Build completed successfully!"
