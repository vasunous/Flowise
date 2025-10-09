# E2B Real Stack Local Setup

This document describes how to run the complete E2B infrastructure locally using real components instead of mock services.

## 🏗️ What's Included

The real E2B stack includes:

- **E2B API Server** - Main API for sandbox management
- **E2B Orchestrator** - Manages sandbox lifecycle and resource allocation
- **E2B Envd** - Environment daemon for sandbox execution
- **E2B Client Proxy** - Handles client connections to sandboxes
- **E2B Docker Reverse Proxy** - Manages Docker container networking
- **PostgreSQL** - Primary database for E2B metadata
- **ClickHouse** - Analytics and metrics database
- **Redis** - Caching and session storage

## 🚀 Quick Start

### Prerequisites

1. **Docker and Docker Compose** - For running the services
2. **Go 1.25+** - For building E2B components
3. **Make** - For build automation

### Step 1: Build E2B Components

```bash
cd /Users/vasudevan.ramasamy/code/flw_pg/e2bdev/infra

# Build all E2B components
make build/api
make build/orchestrator
make build/envd
make build/client-proxy
make build/docker-reverse-proxy
```

### Step 2: Start the Real E2B Stack

```bash
cd /Users/vasudevan.ramasamy/code/flw_pg/Flowise

# Start all services
./start-e2b-real.sh
```

### Step 3: Test the Setup

```bash
# Test the complete stack
node test-e2b-real.js
```

## 📋 Service URLs

Once running, the following services will be available:

| Service | URL | Description |
|---------|-----|-------------|
| E2B API | http://localhost:3000 | Main API endpoint |
| Orchestrator | http://localhost:3001 | Sandbox orchestration |
| Envd | http://localhost:8000 | Environment daemon |
| Client Proxy | http://localhost:3004 | Client connection proxy |
| Docker Reverse Proxy | http://localhost:3005 | Docker networking |
| PostgreSQL | localhost:5432 | Primary database |
| ClickHouse | http://localhost:8123 | Analytics database |
| Redis | localhost:6379 | Cache and sessions |

## 🔧 Configuration

### Environment Variables

The setup uses the following key environment variables:

```bash
# Database connections
POSTGRES_CONNECTION_STRING=postgresql://e2b:e2b_password@postgres:5432/e2b?sslmode=disable
CLICKHOUSE_CONNECTION_STRING=http://clickhouse:8123
REDIS_URL=redis://redis:6379

# E2B configuration
ENVIRONMENT=local
NODE_ID=local-api-1
LOCAL_CLUSTER_ENDPOINT=orchestrator:3001
LOCAL_CLUSTER_TOKEN=local-token-123
SANDBOX_ACCESS_TOKEN_HASH_SEED=local-seed-key-123
```

### Customization

You can modify the configuration by editing:
- `docker-compose.e2b-real.yml` - Service configuration
- `start-e2b-real.sh` - Startup script
- Environment variables in the docker-compose file

## 🧪 Testing

### Health Checks

```bash
# Check API health
curl http://localhost:3000/health

# Check orchestrator health
curl http://localhost:3001/health

# Check envd health
curl http://localhost:8000/health
```

### Create and Test Sandbox

```bash
# Create a sandbox
curl -X POST http://localhost:3000/api/sandboxes \
  -H "Content-Type: application/json" \
  -d '{"template": "base", "envVars": {}}'

# Execute code in sandbox (replace {sandbox_id})
curl -X POST http://localhost:3000/api/sandboxes/{sandbox_id}/execute \
  -H "Content-Type: application/json" \
  -d '{"code": "print(\"Hello E2B!\")", "language": "python"}'
```

## 🐛 Troubleshooting

### Common Issues

1. **Services not starting**
   ```bash
   # Check logs
   docker-compose -f docker-compose.e2b-real.yml logs
   
   # Restart services
   docker-compose -f docker-compose.e2b-real.yml restart
   ```

2. **Database connection issues**
   ```bash
   # Check database health
   docker-compose -f docker-compose.e2b-real.yml exec postgres pg_isready -U e2b -d e2b
   docker-compose -f docker-compose.e2b-real.yml exec clickhouse wget --spider http://localhost:8123/ping
   ```

3. **Binary not found**
   ```bash
   # Rebuild components
   cd /Users/vasudevan.ramasamy/code/flw_pg/e2bdev/infra
   make build/api build/orchestrator build/envd build/client-proxy build/docker-reverse-proxy
   ```

### Logs

```bash
# View all logs
docker-compose -f docker-compose.e2b-real.yml logs -f

# View specific service logs
docker-compose -f docker-compose.e2b-real.yml logs -f e2b-api
docker-compose -f docker-compose.e2b-real.yml logs -f orchestrator
docker-compose -f docker-compose.e2b-real.yml logs -f envd
```

## 🛑 Stopping Services

```bash
# Stop all services
docker-compose -f docker-compose.e2b-real.yml down

# Stop and remove volumes (WARNING: This will delete all data)
docker-compose -f docker-compose.e2b-real.yml down -v
```

## 🔄 Development Workflow

1. **Make changes to E2B components**
2. **Rebuild the affected components**
   ```bash
   cd /Users/vasudevan.ramasamy/code/flw_pg/e2bdev/infra
   make build/{component-name}
   ```
3. **Restart the affected services**
   ```bash
   docker-compose -f docker-compose.e2b-real.yml restart {service-name}
   ```

## 📊 Monitoring

The setup includes basic health checks and logging. For production use, consider adding:

- Prometheus metrics collection
- Grafana dashboards
- Structured logging with ELK stack
- Distributed tracing with Jaeger

## 🔗 Integration with Flowise

To integrate this E2B stack with Flowise:

1. Update Flowise configuration to use `http://localhost:3000` as the E2B API endpoint
2. Ensure proper authentication tokens are configured
3. Test the integration using the Flowise E2B nodes

## 📚 Additional Resources

- [E2B Documentation](https://docs.e2b.dev/)
- [E2B Infrastructure Repository](https://github.com/e2b-dev/infra)
- [E2B Self-hosting Guide](https://github.com/e2b-dev/infra/blob/main/self-host.md)
