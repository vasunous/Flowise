#!/bin/bash

# E2B Real Stack Startup Script
# This script starts the complete E2B infrastructure using real components

set -e

echo "🚀 Starting E2B Real Stack..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if required binaries exist
BINARIES=(
    "../e2bdev/infra/packages/api/bin/api-linux"
    "../e2bdev/infra/packages/orchestrator/bin/orchestrator"
    "../e2bdev/infra/packages/envd/bin/envd"
    "../e2bdev/infra/packages/client-proxy/bin/client-proxy"
    "../e2bdev/infra/packages/docker-reverse-proxy/bin/docker-reverse-proxy-linux"
)

echo "🔍 Checking for required binaries..."
for binary in "${BINARIES[@]}"; do
    if [ ! -f "$binary" ]; then
        echo "❌ Missing binary: $binary"
        echo "Please run 'make build' in the e2bdev/infra directory first."
        exit 1
    fi
done

echo "✅ All required binaries found"

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.e2b-real.yml down --remove-orphans

# Start the services
echo "🏗️  Starting E2B services..."
docker-compose -f docker-compose.e2b-real.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."

# Wait for PostgreSQL
echo "📊 Waiting for PostgreSQL..."
until docker-compose -f docker-compose.e2b-real.yml exec -T postgres pg_isready -U e2b -d e2b > /dev/null 2>&1; do
    sleep 2
done
echo "✅ PostgreSQL is ready"

# Wait for ClickHouse
echo "📊 Waiting for ClickHouse..."
until docker-compose -f docker-compose.e2b-real.yml exec -T clickhouse wget --no-verbose --tries=1 --spider http://localhost:8123/ping > /dev/null 2>&1; do
    sleep 2
done
echo "✅ ClickHouse is ready"

# Wait for Redis
echo "📊 Waiting for Redis..."
until docker-compose -f docker-compose.e2b-real.yml exec -T redis redis-cli ping > /dev/null 2>&1; do
    sleep 2
done
echo "✅ Redis is ready"

# Run database migrations
echo "🔄 Running database migrations..."
docker-compose -f docker-compose.e2b-real.yml up db-migrator clickhouse-migrator

# Wait for E2B services
echo "⏳ Waiting for E2B services..."

# Wait for Envd
echo "🔧 Waiting for Envd..."
until curl -f http://localhost:8000/health > /dev/null 2>&1; do
    sleep 2
done
echo "✅ Envd is ready"

# Wait for Orchestrator
echo "🎯 Waiting for Orchestrator..."
until curl -f http://localhost:3001/health > /dev/null 2>&1; do
    sleep 2
done
echo "✅ Orchestrator is ready"

# Wait for API
echo "🌐 Waiting for E2B API..."
until curl -f http://localhost:3000/health > /dev/null 2>&1; do
    sleep 2
done
echo "✅ E2B API is ready"

echo ""
echo "🎉 E2B Real Stack is now running!"
echo ""
echo "📋 Service URLs:"
echo "  • E2B API: http://localhost:3000"
echo "  • Orchestrator: http://localhost:3001"
echo "  • Envd: http://localhost:8000"
echo "  • Client Proxy: http://localhost:3004"
echo "  • Docker Reverse Proxy: http://localhost:3005"
echo "  • PostgreSQL: localhost:5432"
echo "  • ClickHouse: http://localhost:8123"
echo "  • Redis: localhost:6379"
echo ""
echo "🔧 To test the API:"
echo "  curl http://localhost:3000/health"
echo ""
echo "🛑 To stop all services:"
echo "  docker-compose -f docker-compose.e2b-real.yml down"
echo ""
echo "📊 To view logs:"
echo "  docker-compose -f docker-compose.e2b-real.yml logs -f"
