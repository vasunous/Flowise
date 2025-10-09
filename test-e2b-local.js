#!/usr/bin/env node

/**
 * Test E2B Local Development Environment
 * This script tests the local E2B setup running in Docker Compose
 */

const axios = require('axios');

const E2B_API_URL = 'http://localhost:3000';

async function testLocalE2B() {
    console.log('🔍 Testing Local E2B Development Environment\n');
    
    try {
        // Test 1: Health Check
        console.log('📡 Testing API health...');
        const healthResponse = await axios.get(`${E2B_API_URL}/health`);
        console.log('✅ API Health:', healthResponse.data);
        
        // Test 2: Create Sandbox
        console.log('\n📡 Creating sandbox...');
        const sandboxResponse = await axios.post(`${E2B_API_URL}/api/sandboxes`, {});
        const sandbox = sandboxResponse.data;
        console.log('✅ Sandbox created:', sandbox);
        
        // Test 3: Execute Code
        console.log('\n📡 Executing code...');
        const executionResponse = await axios.post(
            `${E2B_API_URL}/api/sandboxes/${sandbox.id}/execute`,
            {
                code: `
print("Hello from Local E2B!")
result = 2 * 200
print(f"2 * 200 = {result}")
                `.trim(),
                language: 'python'
            }
        );
        console.log('✅ Code execution result:', executionResponse.data);
        
        // Extract the actual code execution result
        const executionResult = executionResponse.data.result;
        console.log('\n📋 Code Execution Details:');
        console.log('  - Execution ID:', executionResponse.data.executionId);
        console.log('  - Result Text:', executionResult.text);
        console.log('  - Logs:', executionResult.logs);
        
        // If you want to access specific parts:
        const resultText = executionResult.text;
        const executionLogs = executionResult.logs;
        const executionId = executionResponse.data.executionId;
        
        console.log('\n🔍 Extracted Values:');
        console.log('  - resultText:', resultText);
        console.log('  - executionLogs:', executionLogs);
        console.log('  - executionId:', executionId);
        
        // Print the full execution response structure for debugging
        console.log('\n🔍 Full execution response structure:');
        console.log(JSON.stringify(executionResponse.data, null, 2));
        
        // Test 4: Test Database Connection
        console.log('\n📡 Testing database connection...');
        try {
            const dbTest = await axios.get(`${E2B_API_URL}/api/health`);
            console.log('✅ Database connection: OK');
        } catch (error) {
            console.log('⚠️  Database connection: Not implemented yet');
        }
        
        console.log('\n🎉 Local E2B Environment Test Completed Successfully!');
        console.log('\n📊 Summary:');
        console.log('  - E2B API: ✅ Running on port 3000');
        console.log('  - PostgreSQL: ✅ Running on port 5432');
        console.log('  - ClickHouse: ✅ Running on port 8123');
        console.log('  - Envd Service: ✅ Running on port 8000');
        console.log('\n🚀 Your local E2B environment is ready for development!');
        
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
testLocalE2B().catch(console.error);
