#!/bin/bash

# E2B Build Script for Linux
# This script builds all E2B services in the Linux environment

set -e

echo "🔨 Building E2B services in Linux environment..."

# Set environment
export PATH=$PATH:/usr/local/go/bin
export GOPATH=/opt/e2b/go
export GOCACHE=/opt/e2b/go/cache

# Create Go workspace
mkdir -p $GOPATH/{src,bin,pkg}
mkdir -p $GOCACHE

# Copy E2B source code
echo "📂 Copying E2B source code..."
cp -r /opt/e2b/src/e2bdev/infra/packages/* $GOPATH/src/

# Build API server
echo "🔨 Building E2B API server..."
cd $GOPATH/src/api
go mod download
CGO_ENABLED=0 go build -o /opt/e2b/bin/api .

# Build Orchestrator
echo "🔨 Building E2B Orchestrator..."
cd $GOPATH/src/orchestrator
go mod download
CGO_ENABLED=1 go build -o /opt/e2b/bin/orchestrator .

# Build Envd
echo "🔨 Building E2B Envd..."
cd $GOPATH/src/envd
go mod download
CGO_ENABLED=0 go build -o /opt/e2b/bin/envd .

# Make binaries executable
chmod +x /opt/e2b/bin/*

echo "✅ E2B services built successfully!"
echo ""
echo "📋 Built services:"
echo "  - API Server: /opt/e2b/bin/api"
echo "  - Orchestrator: /opt/e2b/bin/orchestrator"
echo "  - Envd: /opt/e2b/bin/envd"
echo ""
echo "🚀 To start E2B services, run:"
echo "   cd /opt/e2b && ./start-e2b.sh"

