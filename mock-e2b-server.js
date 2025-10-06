#!/usr/bin/env node

/**
 * Mock E2B Server for testing Flowise E2B integration locally
 * This simulates the E2B API endpoints that Flowise needs
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { spawn } = require('child_process');

const app = express();
app.use(express.json());

// Store active contexts
const contexts = new Map();

// Health check endpoint
app.get('/health', (req, res) => {
    res.json('OK');
});

// Create context endpoint
app.post('/contexts', (req, res) => {
    const contextId = uuidv4();
    const context = {
        id: contextId,
        language: req.body.language || 'python',
        cwd: '/tmp'
    };
    
    contexts.set(contextId, context);
    console.log(`📦 Created context: ${contextId}`);
    res.json(context);
});

// Get context endpoint
app.get('/contexts/:contextId', (req, res) => {
    const context = contexts.get(req.params.contextId);
    if (!context) {
        return res.status(404).json({ error: 'Context not found' });
    }
    res.json(context);
});

// Execute code endpoint
app.post('/execute', async (req, res) => {
    const { code, context_id, language = 'python' } = req.body;
    
    console.log(`🚀 Executing ${language} code:`, code.substring(0, 100) + '...');
    
    try {
        let result;
        
        if (language === 'python') {
            result = await executePython(code);
        } else if (language === 'javascript' || language === 'js') {
            result = await executeJavaScript(code);
        } else {
            result = {
                stdout: `Mock execution for ${language}:\n${code}`,
                stderr: '',
                exit_code: 0
            };
        }
        
        const response = {
            stdout: result.stdout,
            stderr: result.stderr,
            exit_code: result.exit_code || 0,
            execution_time: 0.1
        };
        
        console.log(`✅ Execution completed:`, response.stdout.substring(0, 100));
        res.json(response);
        
    } catch (error) {
        console.log(`❌ Execution failed:`, error.message);
        res.status(500).json({
            error: error.message,
            stdout: '',
            stderr: error.message,
            exit_code: 1
        });
    }
});

// Execute Python code
async function executePython(code) {
    return new Promise((resolve, reject) => {
        const python = spawn('python3', ['-c', code]);
        
        let stdout = '';
        let stderr = '';
        
        python.stdout.on('data', (data) => {
            stdout += data.toString();
        });
        
        python.stderr.on('data', (data) => {
            stderr += data.toString();
        });
        
        python.on('close', (code) => {
            resolve({
                stdout: stdout,
                stderr: stderr,
                exit_code: code
            });
        });
        
        python.on('error', (error) => {
            reject(error);
        });
        
        // Timeout after 10 seconds
        setTimeout(() => {
            python.kill();
            reject(new Error('Execution timeout'));
        }, 10000);
    });
}

// Execute JavaScript code
async function executeJavaScript(code) {
    return new Promise((resolve, reject) => {
        const node = spawn('node', ['-e', code]);
        
        let stdout = '';
        let stderr = '';
        
        node.stdout.on('data', (data) => {
            stdout += data.toString();
        });
        
        node.stderr.on('data', (data) => {
            stderr += data.toString();
        });
        
        node.on('close', (code) => {
            resolve({
                stdout: stdout,
                stderr: stderr,
                exit_code: code
            });
        });
        
        node.on('error', (error) => {
            reject(error);
        });
        
        // Timeout after 10 seconds
        setTimeout(() => {
            node.kill();
            reject(new Error('Execution timeout'));
        }, 10000);
    });
}

// API documentation endpoint
app.get('/openapi.json', (req, res) => {
    res.json({
        openapi: '3.0.0',
        info: {
            title: 'Mock E2B API',
            version: '1.0.0'
        },
        paths: {
            '/health': {
                get: {
                    summary: 'Health check'
                }
            },
            '/contexts': {
                post: {
                    summary: 'Create context'
                }
            },
            '/execute': {
                post: {
                    summary: 'Execute code'
                }
            }
        }
    });
});

const PORT = process.env.PORT || 49999;

app.listen(PORT, () => {
    console.log(`🚀 Mock E2B Server running on http://localhost:${PORT}`);
    console.log(`📋 Available endpoints:`);
    console.log(`   GET  /health - Health check`);
    console.log(`   POST /contexts - Create context`);
    console.log(`   POST /execute - Execute code`);
    console.log(`   GET  /openapi.json - API documentation`);
    console.log(`\n✅ Ready for Flowise E2B testing!`);
});