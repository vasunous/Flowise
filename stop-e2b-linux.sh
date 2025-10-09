#!/bin/bash

# E2B Stop Script for Linux
# This script stops all E2B services

echo "🛑 Stopping E2B Full Stack..."

# Stop API Server
if [ -f /opt/e2b/logs/api.pid ]; then
    echo "🌐 Stopping API Server..."
    kill $(cat /opt/e2b/logs/api.pid) 2>/dev/null || true
    rm -f /opt/e2b/logs/api.pid
fi

# Stop Orchestrator
if [ -f /opt/e2b/logs/orchestrator.pid ]; then
    echo "🎯 Stopping Orchestrator..."
    kill $(cat /opt/e2b/logs/orchestrator.pid) 2>/dev/null || true
    rm -f /opt/e2b/logs/orchestrator.pid
fi

# Stop Envd
if [ -f /opt/e2b/logs/envd.pid ]; then
    echo "🔧 Stopping Envd..."
    kill $(cat /opt/e2b/logs/envd.pid) 2>/dev/null || true
    rm -f /opt/e2b/logs/envd.pid
fi

# Stop Docker containers
echo "🐳 Stopping Docker containers..."
docker stop e2b-redis e2b-clickhouse e2b-postgres 2>/dev/null || true
docker rm e2b-redis e2b-clickhouse e2b-postgres 2>/dev/null || true

echo "✅ E2B Full Stack stopped successfully!"

