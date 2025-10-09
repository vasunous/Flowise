#!/bin/bash

# E2B Startup Script for Linux
# This script starts the complete E2B stack

set -e

echo "🚀 Starting E2B Full Stack in Linux..."

# Load environment variables
source /opt/e2b/config/e2b.env

# Start PostgreSQL
echo "🐘 Starting PostgreSQL..."
docker run -d --name e2b-postgres \
  -e POSTGRES_DB=e2b \
  -e POSTGRES_USER=e2b \
  -e POSTGRES_PASSWORD=e2b_password \
  -p 5432:5432 \
  -v /opt/e2b/data/postgres:/var/lib/postgresql/data \
  postgres:15

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Run database migrations
echo "📊 Running database migrations..."
cd /opt/e2b/src/e2bdev/infra/packages/db
POSTGRES_CONNECTION_STRING="$POSTGRES_CONNECTION_STRING" \
go tool goose -table "_migrations" -dir "migrations" postgres "$POSTGRES_CONNECTION_STRING" up

# Start ClickHouse
echo "📊 Starting ClickHouse..."
docker run -d --name e2b-clickhouse \
  -e CLICKHOUSE_DB=e2b \
  -e CLICKHOUSE_USER=e2b \
  -e CLICKHOUSE_PASSWORD=e2b_password \
  -p 8123:8123 \
  -p 9000:9000 \
  -v /opt/e2b/data/clickhouse:/var/lib/clickhouse \
  clickhouse/clickhouse-server:latest

# Start Redis
echo "🔴 Starting Redis..."
docker run -d --name e2b-redis \
  -p 6379:6379 \
  -v /opt/e2b/data/redis:/data \
  redis:7-alpine

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 15

# Start Envd
echo "🔧 Starting E2B Envd..."
cd /opt/e2b
nohup ./bin/envd -isnotfc > /opt/e2b/logs/envd.log 2>&1 &
echo $! > /opt/e2b/logs/envd.pid

# Wait for Envd to start
sleep 5

# Start Orchestrator
echo "🎯 Starting E2B Orchestrator..."
cd /opt/e2b
nohup ./bin/orchestrator --port 3001 > /opt/e2b/logs/orchestrator.log 2>&1 &
echo $! > /opt/e2b/logs/orchestrator.pid

# Wait for Orchestrator to start
sleep 5

# Start API Server
echo "🌐 Starting E2B API Server..."
cd /opt/e2b
nohup ./bin/api --port 3000 > /opt/e2b/logs/api.log 2>&1 &
echo $! > /opt/e2b/logs/api.pid

# Wait for API to start
sleep 5

echo "✅ E2B Full Stack started successfully!"
echo ""
echo "📊 Service Status:"
echo "  - PostgreSQL: localhost:5432"
echo "  - ClickHouse: localhost:8123"
echo "  - Redis: localhost:6379"
echo "  - Envd: localhost:8000"
echo "  - Orchestrator: localhost:3001"
echo "  - API Server: localhost:3000"
echo ""
echo "🔍 To check service health:"
echo "   curl http://localhost:3000/health"
echo "   curl http://localhost:3001/health"
echo ""
echo "📋 To view logs:"
echo "   tail -f /opt/e2b/logs/*.log"
echo ""
echo "🛑 To stop services:"
echo "   ./stop-e2b.sh"

