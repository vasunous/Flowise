#!/bin/bash

# E2B Full Linux Deployment Setup Script
# This script sets up a complete E2B environment in a Linux container

set -e

echo "🚀 Setting up E2B Full Linux Deployment..."

# Update system
echo "📦 Updating system packages..."
apt-get update
apt-get install -y curl wget git build-essential

# Install Docker
echo "🐳 Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
usermod -aG docker root

# Install Go
echo "🔧 Installing Go..."
wget https://go.dev/dl/go1.21.5.linux-amd64.tar.gz
tar -C /usr/local -xzf go1.21.5.linux-amd64.tar.gz
export PATH=$PATH:/usr/local/go/bin
echo 'export PATH=$PATH:/usr/local/go/bin' >> /root/.bashrc

# Install Firecracker
echo "🔥 Installing Firecracker..."
mkdir -p /opt/firecracker
cd /opt/firecracker
wget https://github.com/firecracker-microvm/firecracker/releases/download/v1.4.0/firecracker-v1.4.0-x86_64.tgz
tar -xzf firecracker-v1.4.0-x86_64.tgz
mv release-v1.4.0-x86_64/* .
chmod +x firecracker jailer
ln -s /opt/firecracker/firecracker /usr/local/bin/firecracker
ln -s /opt/firecracker/jailer /usr/local/bin/jailer

# Install additional dependencies
echo "📚 Installing additional dependencies..."
apt-get install -y \
    ca-certificates \
    gnupg \
    lsb-release \
    python3 \
    python3-pip \
    nodejs \
    npm \
    postgresql-client \
    redis-tools

# Create E2B directories
echo "📁 Creating E2B directories..."
mkdir -p /opt/e2b/{data,logs,config}
mkdir -p /opt/e2b/data/{postgres,clickhouse,redis}

# Set up environment variables
echo "🔧 Setting up environment variables..."
cat > /opt/e2b/config/e2b.env << EOF
# E2B Environment Configuration
POSTGRES_CONNECTION_STRING=postgresql://e2b:e2b_password@localhost:5432/e2b?sslmode=disable
CLICKHOUSE_CONNECTION_STRING=http://localhost:8123
REDIS_URL=redis://localhost:6379
ENVIRONMENT=local
NODE_ID=linux-orchestrator-1
ORCHESTRATOR_PORT=5008
LOCAL_CLUSTER_ENDPOINT=localhost:3001
LOCAL_CLUSTER_TOKEN=linux-token-123
SANDBOX_ACCESS_TOKEN_HASH_SEED=linux-seed-key-123
TEMPLATE_BUCKET_NAME=local-templates
ENVD_TIMEOUT=300s
ORCHESTRATOR_SERVICES=all
GCP_DOCKER_REPOSITORY_NAME=local
GOOGLE_SERVICE_ACCOUNT_BASE64=
OTEL_COLLECTOR_GRPC_ENDPOINT=
MAX_PARALLEL_MEMFILE_SNAPSHOTTING=1
EOF

echo "✅ E2B Linux environment setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Copy E2B source code to /opt/e2b/src"
echo "2. Build E2B services"
echo "3. Start the full E2B stack"
echo ""
echo "🔧 To continue setup, run:"
echo "   cd /opt/e2b && ./build-e2b.sh"

