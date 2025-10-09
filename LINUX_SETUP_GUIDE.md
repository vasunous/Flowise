# E2B Full Linux Deployment Guide

## Overview
This guide sets up a complete E2B infrastructure with real code execution, container management, and all advanced features in a Linux environment.

## Prerequisites
- Docker Desktop with Linux containers enabled
- At least 8GB RAM available
- 20GB free disk space
- macOS with Docker Desktop

## Setup Options

### Option A: Linux VM with Docker Desktop
1. **Enable Linux containers in Docker Desktop**
2. **Create a Linux VM** using Docker Desktop's built-in Linux environment
3. **Follow the setup scripts** provided

### Option B: Local Linux VM (Recommended)
1. **Install VirtualBox or VMware**
2. **Create Ubuntu 22.04 VM** with:
   - 4GB RAM minimum
   - 20GB disk space
   - Enable virtualization features
3. **Install Docker in the VM**
4. **Follow the setup scripts**

## Quick Start

### 1. Start Linux Environment
```bash
# Option A: Using Docker Desktop Linux container
docker run -it --privileged --name e2b-linux-vm \
  -p 3000:3000 -p 3001:3001 -p 5008:5008 \
  -p 8000:8000 -p 8001:8001 -p 9999:9999 \
  -p 2345:2345 -p 49983:49983 \
  -p 5432:5432 -p 8123:8123 -p 6379:6379 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  ubuntu:22.04 /bin/bash

# Option B: Use existing Linux VM
ssh your-linux-vm
```

### 2. Copy Setup Files
```bash
# Copy the setup scripts to your Linux environment
# (You'll need to transfer these files to your Linux VM)
```

### 3. Run Setup Script
```bash
chmod +x setup-e2b-linux.sh
./setup-e2b-linux.sh
```

### 4. Copy E2B Source Code
```bash
# Copy the E2B source code to /opt/e2b/src
# This should include the entire e2bdev/infra directory
```

### 5. Build E2B Services
```bash
chmod +x build-e2b-linux.sh
./build-e2b-linux.sh
```

### 6. Start E2B Stack
```bash
chmod +x start-e2b-linux.sh
./start-e2b-linux.sh
```

## Alternative: Docker Compose Setup

If you prefer using Docker Compose:

```bash
# Copy the E2B source code to the Linux environment
# Then run:
docker-compose -f docker-compose.e2b-linux.yml up -d
```

## Verification

### Check Service Health
```bash
# API Server
curl http://localhost:3000/health

# Orchestrator
curl http://localhost:3001/health

# Envd Service
curl http://localhost:8000/health
```

### Test Real Code Execution
```bash
# Create a sandbox
curl -X POST http://localhost:3001/v1/sandboxes \
  -H "Content-Type: application/json" \
  -d '{"template": "base"}'

# Execute code (this will create a real container)
curl -X POST http://localhost:3000/api/v1/sandboxes/{sandbox-id}/execute \
  -H "Content-Type: application/json" \
  -d '{"code": "print(\"Hello from real E2B!\")", "language": "python"}'
```

## What You Get

### ✅ Full E2B Functionality
- **Real Code Execution**: Actual Python/Node.js environments
- **Container Management**: Real Docker container lifecycle
- **Security Isolation**: Firecracker microVM isolation
- **Network Management**: Isolated networking
- **Resource Monitoring**: CPU/memory limits and monitoring
- **File System Operations**: Real file upload/download
- **Template Building**: Custom environment creation
- **Snapshot Management**: State persistence

### 🚀 Advanced Features
- **Multi-language Support**: Python, Node.js, Go, etc.
- **Custom Templates**: Build your own environments
- **Resource Limits**: CPU, memory, disk quotas
- **Network Isolation**: Secure sandbox networking
- **State Persistence**: Save and restore sandbox states
- **Real-time Monitoring**: Live resource usage tracking

## Troubleshooting

### Common Issues

1. **Permission Denied**
   ```bash
   # Make sure Docker daemon is running
   sudo systemctl start docker
   
   # Add user to docker group
   sudo usermod -aG docker $USER
   ```

2. **Firecracker Not Found**
   ```bash
   # Install Firecracker
   wget https://github.com/firecracker-microvm/firecracker/releases/download/v1.4.0/firecracker-v1.4.0-x86_64.tgz
   tar -xzf firecracker-v1.4.0-x86_64.tgz
   sudo mv firecracker jailer /usr/local/bin/
   ```

3. **Port Conflicts**
   ```bash
   # Check what's using the ports
   netstat -tulpn | grep :3000
   
   # Kill conflicting processes
   sudo kill -9 <PID>
   ```

### Logs
```bash
# View service logs
tail -f /opt/e2b/logs/*.log

# View Docker logs
docker logs e2b-postgres
docker logs e2b-clickhouse
docker logs e2b-redis
```

## Stopping Services
```bash
chmod +x stop-e2b-linux.sh
./stop-e2b-linux.sh
```

## Next Steps

1. **Test the full functionality** with real code execution
2. **Create custom templates** for your specific needs
3. **Integrate with your applications** using the E2B API
4. **Monitor resource usage** and optimize performance
5. **Set up production deployment** if needed

## Support

If you encounter issues:
1. Check the logs in `/opt/e2b/logs/`
2. Verify all services are running: `docker ps`
3. Check network connectivity: `netstat -tulpn`
4. Review the E2B documentation for advanced configuration

