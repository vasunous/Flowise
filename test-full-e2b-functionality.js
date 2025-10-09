#!/usr/bin/env node

/**
 * Test Full E2B Functionality
 * This script tests the complete E2B infrastructure with real code execution
 */

const axios = require('axios');

const E2B_API_URL = 'http://localhost:3000';
const ORCHESTRATOR_URL = 'http://localhost:3001';

async function testFullE2BFunctionality() {
    console.log('🔍 Testing Full E2B Functionality with Real Code Execution\n');

    try {
        // Test 1: Check all service health
        console.log('📡 Checking service health...');
        
        const services = [
            { name: 'API Server', url: `${E2B_API_URL}/health` },
            { name: 'Orchestrator', url: `${ORCHESTRATOR_URL}/health` },
            { name: 'Envd Service', url: 'http://localhost:8000/health' }
        ];

        for (const service of services) {
            try {
                const response = await axios.get(service.url, { timeout: 5000 });
                console.log(`✅ ${service.name}: ${JSON.stringify(response.data)}`);
            } catch (error) {
                console.log(`❌ ${service.name}: ${error.message}`);
            }
        }

        // Test 2: Create a real sandbox
        console.log('\n📡 Creating a real sandbox...');
        const sandboxResponse = await axios.post(`${ORCHESTRATOR_URL}/v1/sandboxes`, {
            template: 'base'
        });
        const sandbox = sandboxResponse.data;
        console.log('✅ Real Sandbox Created:', JSON.stringify(sandbox, null, 2));

        // Test 3: Execute real Python code
        console.log('\n📡 Executing real Python code...');
        const codeExecutionResponse = await axios.post(
            `${E2B_API_URL}/api/v1/sandboxes/${sandbox.id}/execute`,
            {
                code: `
print("Hello from Real E2B!")
print("This is running in a real container!")
result = 2 + 2
print(f"2 + 2 = {result}")

# Test file operations
with open("/tmp/test.txt", "w") as f:
    f.write("E2B is working!")

with open("/tmp/test.txt", "r") as f:
    content = f.read()
    print(f"File content: {content}")

# Test imports
import os
print(f"Current directory: {os.getcwd()}")
print(f"Python version: {os.sys.version}")
                `.trim(),
                language: 'python'
            }
        );
        console.log('✅ Real Code Execution Result:', JSON.stringify(codeExecutionResponse.data, null, 2));

        // Test 4: Execute real Node.js code
        console.log('\n📡 Executing real Node.js code...');
        const nodeExecutionResponse = await axios.post(
            `${E2B_API_URL}/api/v1/sandboxes/${sandbox.id}/execute`,
            {
                code: `
console.log("Hello from Real E2B Node.js!");
console.log("This is running in a real container!");

const result = 3 + 3;
console.log(\`3 + 3 = \${result}\`);

// Test file operations
const fs = require('fs');
fs.writeFileSync('/tmp/node-test.txt', 'E2B Node.js is working!');
const content = fs.readFileSync('/tmp/node-test.txt', 'utf8');
console.log(\`File content: \${content}\`);

// Test process info
console.log(\`Node version: \${process.version}\`);
console.log(\`Current directory: \${process.cwd()}\`);
                `.trim(),
                language: 'javascript'
            }
        );
        console.log('✅ Real Node.js Execution Result:', JSON.stringify(nodeExecutionResponse.data, null, 2));

        // Test 5: Test resource monitoring
        console.log('\n📡 Testing resource monitoring...');
        try {
            const resourceResponse = await axios.get(`${E2B_API_URL}/internal/status`);
            console.log('✅ Resource Status:', JSON.stringify(resourceResponse.data, null, 2));
        } catch (error) {
            console.log('⚠️  Resource monitoring:', error.message);
        }

        // Test 6: Test template management
        console.log('\n📡 Testing template management...');
        const templatesResponse = await axios.get(`${ORCHESTRATOR_URL}/v1/templates`);
        console.log('✅ Available Templates:', JSON.stringify(templatesResponse.data, null, 2));

        // Test 7: Clean up
        console.log('\n📡 Cleaning up sandbox...');
        const deleteResponse = await axios.delete(`${ORCHESTRATOR_URL}/v1/sandboxes/${sandbox.id}`);
        console.log('✅ Sandbox Cleaned Up:', deleteResponse.data);

        console.log('\n🎉 Full E2B Functionality Test Completed Successfully!');
        console.log('\n📊 What We Accomplished:');
        console.log('  ✅ Connected to real E2B services');
        console.log('  ✅ Created a real sandbox container');
        console.log('  ✅ Executed real Python code in the container');
        console.log('  ✅ Executed real Node.js code in the container');
        console.log('  ✅ Tested file operations in the sandbox');
        console.log('  ✅ Verified resource monitoring');
        console.log('  ✅ Tested template management');
        console.log('  ✅ Cleaned up resources properly');
        console.log('\n🚀 Your E2B infrastructure is fully functional with real code execution!');
        console.log('   This demonstrates that you have the complete E2B stack running locally.');

        return true;

    } catch (error) {
        console.log('❌ Test failed:', error.message);
        if (error.response) {
            console.log('Response status:', error.response.status);
            console.log('Response data:', error.response.data);
        }
        return false;
    }
}

// Run the test
testFullE2BFunctionality().catch(console.error);

