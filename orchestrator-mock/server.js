const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'orchestrator-mock' });
});

// Service discovery endpoints that the API server expects
app.get('/v1/service-discovery/nodes/orchestrators', (req, res) => {
    res.json({
        nodes: [
            {
                id: 'local-orchestrator-1',
                address: 'orchestrator:3001',
                status: 'healthy',
                services: ['orchestrator']
            }
        ]
    });
});

// Mock orchestrator endpoints
app.post('/v1/sandboxes', (req, res) => {
    const sandboxId = 'sandbox-' + Date.now();
    res.json({
        id: sandboxId,
        status: 'running',
        createdAt: new Date().toISOString(),
        template: req.body.template || 'base'
    });
});

app.get('/v1/sandboxes/:id', (req, res) => {
    res.json({
        id: req.params.id,
        status: 'running',
        createdAt: new Date().toISOString(),
        template: 'base'
    });
});

app.delete('/v1/sandboxes/:id', (req, res) => {
    res.json({ success: true });
});

// Mock template endpoints
app.get('/v1/templates', (req, res) => {
    res.json({
        templates: [
            {
                id: 'base',
                name: 'Base Template',
                description: 'Basic Python environment',
                status: 'ready'
            }
        ]
    });
});

app.get('/v1/templates/:id', (req, res) => {
    res.json({
        id: req.params.id,
        name: 'Base Template',
        description: 'Basic Python environment',
        status: 'ready'
    });
});

// Mock build endpoints
app.get('/v1/builds', (req, res) => {
    res.json({
        builds: []
    });
});

app.post('/v1/builds', (req, res) => {
    const buildId = 'build-' + Date.now();
    res.json({
        id: buildId,
        status: 'completed',
        createdAt: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`Mock Orchestrator running on http://localhost:${PORT}`);
});

