#!/bin/bash

# Script to start E2B Docker container for local development
# This script provides multiple options to run E2B locally

set -e

echo "🚀 Starting E2B Docker Container for Local Development"
echo "=================================================="

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker first."
        exit 1
    fi
    echo "✅ Docker is running"
}

# Function to stop existing E2B containers
stop_existing() {
    echo "🛑 Stopping existing E2B containers..."
    docker stop e2b-local 2>/dev/null || true
    docker rm e2b-local 2>/dev/null || true
    echo "✅ Cleaned up existing containers"
}

# Function to start E2B with docker-compose
start_with_compose() {
    echo "🐳 Starting E2B with Docker Compose..."
    docker-compose -f docker-compose.e2b.yml up -d
    echo "✅ E2B started with Docker Compose"
}

# Function to start E2B with plain Docker
start_with_docker() {
    echo "🐳 Starting E2B with plain Docker..."
    docker run -d \
        --name e2b-local \
        -p 49982:49982 \
        -e E2B_API_KEY=local-dummy-key \
        -e E2B_DEBUG=true \
        -e E2B_DOMAIN=localhost:49982 \
        --restart unless-stopped \
        e2bdev/e2b:latest
    echo "✅ E2B started with Docker"
}

# Function to try alternative E2B images
start_alternative() {
    echo "🐳 Trying alternative E2B base image..."
    docker run -d \
        --name e2b-local \
        -p 49982:49982 \
        -e E2B_API_KEY=local-dummy-key \
        -e E2B_DEBUG=true \
        --restart unless-stopped \
        e2b/base:latest
    echo "✅ E2B base image started"
}

# Function to check container status
check_status() {
    echo "📊 Checking E2B container status..."
    if docker ps | grep -q e2b-local; then
        echo "✅ E2B container is running"
        docker ps --filter "name=e2b-local" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    else
        echo "❌ E2B container is not running"
        return 1
    fi
}

# Function to test connection
test_connection() {
    echo "🧪 Testing E2B connection..."
    sleep 5  # Wait for container to fully start
    
    # Test HTTP endpoint
    if curl -f -s http://localhost:49982/health > /dev/null 2>&1; then
        echo "✅ E2B HTTP endpoint is accessible"
    else
        echo "⚠️  E2B HTTP endpoint test failed, but container might still work"
    fi
    
    # Run the Node.js test if available
    if [ -f "test-e2b-connection.js" ]; then
        echo "🧪 Running Node.js connection test..."
        node test-e2b-connection.js
    else
        echo "ℹ️  Node.js test file not found, skipping"
    fi
}

# Function to show logs
show_logs() {
    echo "📋 E2B Container logs:"
    docker logs e2b-local --tail 50
}

# Main execution
main() {
    check_docker
    stop_existing
    
    case "${1:-compose}" in
        "compose")
            start_with_compose
            ;;
        "docker")
            start_with_docker
            ;;
        "base")
            start_alternative
            ;;
        "logs")
            show_logs
            exit 0
            ;;
        "stop")
            echo "🛑 Stopping E2B container..."
            docker stop e2b-local 2>/dev/null || true
            docker rm e2b-local 2>/dev/null || true
            echo "✅ E2B container stopped"
            exit 0
            ;;
        "status")
            check_status
            exit 0
            ;;
        *)
            echo "Usage: $0 [compose|docker|base|logs|stop|status]"
            echo ""
            echo "Options:"
            echo "  compose  - Start with docker-compose (default)"
            echo "  docker   - Start with plain docker run"
            echo "  base     - Try e2b/base image"
            echo "  logs     - Show container logs"
            echo "  stop     - Stop the container"
            echo "  status   - Check container status"
            exit 1
            ;;
    esac
    
    sleep 3
    check_status
    test_connection
    
    echo ""
    echo "🎉 E2B Docker setup complete!"
    echo ""
    echo "📝 Next steps:"
    echo "  1. Test with: node test-e2b-connection.js"
    echo "  2. Check logs: ./start-e2b-docker.sh logs"
    echo "  3. Stop container: ./start-e2b-docker.sh stop"
    echo ""
    echo "🌐 E2B should be accessible at: http://localhost:49982"
}

# Run main function with all arguments
main "$@"