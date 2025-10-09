#!/bin/bash

# E2B Hybrid Stack Startup Script
# This script starts E2B with real databases but enhanced mock API

set -e

echo "🚀 Starting E2B Hybrid Stack..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.e2b-hybrid.yml down --remove-orphans

# Start the services
echo "🏗️  Starting E2B hybrid services..."
docker-compose -f docker-compose.e2b-hybrid.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."

# Wait for PostgreSQL
echo "📊 Waiting for PostgreSQL..."
until docker-compose -f docker-compose.e2b-hybrid.yml exec -T postgres pg_isready -U e2b -d e2b > /dev/null 2>&1; do
    sleep 2
done
echo "✅ PostgreSQL is ready"

# Wait for ClickHouse
echo "📊 Waiting for ClickHouse..."
until docker-compose -f docker-compose.e2b-hybrid.yml exec -T clickhouse wget --no-verbose --tries=1 --spider http://localhost:8123/ping > /dev/null 2>&1; do
    sleep 2
done
echo "✅ ClickHouse is ready"

# Wait for Redis
echo "📊 Waiting for Redis..."
until docker-compose -f docker-compose.e2b-hybrid.yml exec -T redis redis-cli ping > /dev/null 2>&1; do
    sleep 2
done
echo "✅ Redis is ready"

# Run database migrations
echo "🔄 Running database migrations..."
docker-compose -f docker-compose.e2b-hybrid.yml up db-migrator clickhouse-migrator

# Wait for E2B API
echo "⏳ Waiting for E2B API..."
until curl -f http://localhost:3000/health > /dev/null 2>&1; do
    sleep 2
done
echo "✅ E2B API is ready"

echo ""
echo "🎉 E2B Hybrid Stack is now running!"
echo ""
echo "📋 Service URLs:"
echo "  • E2B API: http://localhost:3000"
echo "  • PostgreSQL: localhost:5432"
echo "  • ClickHouse: http://localhost:8123"
echo "  • Redis: localhost:6379"
echo ""
echo "🔧 To test the API:"
echo "  curl http://localhost:3000/health"
echo ""
echo "🧪 To test sandbox creation:"
echo "  curl -X POST http://localhost:3000/api/sandboxes -H 'Content-Type: application/json' -d '{\"template\": \"base\"}'"
echo ""
echo "🛑 To stop all services:"
echo "  docker-compose -f docker-compose.e2b-hybrid.yml down"
echo ""
echo "📊 To view logs:"
echo "  docker-compose -f docker-compose.e2b-hybrid.yml logs -f"
