#!/usr/bin/env node

/**
 * Test Current E2B Setup
 * This script tests the current mock E2B setup
 */

const axios = require('axios');

const ORCHESTRATOR_URL = 'http://localhost:3001';

async function testCurrentSetup() {
    console.log('🔍 Testing Current E2B Setup (Mock Orchestrator)\n');

    try {
        // Test 1: Check orchestrator health
        console.log('📡 Checking orchestrator health...');
        const healthResponse = await axios.get(`${ORCHESTRATOR_URL}/health`);
        console.log('✅ Orchestrator Health:', healthResponse.data);

        // Test 2: List available templates
        console.log('\n📡 Listing available templates...');
        const templatesResponse = await axios.get(`${ORCHESTRATOR_URL}/v1/templates`);
        console.log('✅ Available Templates:', JSON.stringify(templatesResponse.data, null, 2));

        // Test 3: Create a sandbox (mock)
        console.log('\n📡 Creating a sandbox (mock)...');
        const sandboxResponse = await axios.post(`${ORCHESTRATOR_URL}/v1/sandboxes`, {
            template: 'base'
        });
        const sandbox = sandboxResponse.data;
        console.log('✅ Sandbox Created (Mock):', JSON.stringify(sandbox, null, 2));

        // Test 4: Get sandbox details
        console.log('\n📡 Getting sandbox details...');
        const sandboxDetailsResponse = await axios.get(`${ORCHESTRATOR_URL}/v1/sandboxes/${sandbox.id}`);
        console.log('✅ Sandbox Details:', JSON.stringify(sandboxDetailsResponse.data, null, 2));

        // Test 5: Create a build
        console.log('\n📡 Creating a build...');
        const buildResponse = await axios.post(`${ORCHESTRATOR_URL}/v1/builds`, {
            template: 'base',
            description: 'Test build from current setup'
        });
        console.log('✅ Build Created:', JSON.stringify(buildResponse.data, null, 2));

        // Test 6: Clean up
        console.log('\n📡 Cleaning up sandbox...');
        const deleteResponse = await axios.delete(`${ORCHESTRATOR_URL}/v1/sandboxes/${sandbox.id}`);
        console.log('✅ Sandbox Deleted:', deleteResponse.data);

        console.log('\n🎉 Current E2B Setup Test Completed!');
        console.log('\n📊 What We Tested:');
        console.log('  ✅ Mock orchestrator API endpoints');
        console.log('  ✅ Template management (mock)');
        console.log('  ✅ Sandbox CRUD operations (mock)');
        console.log('  ✅ Build management (mock)');
        console.log('  ✅ Service discovery');
        console.log('\n⚠️  Limitations of Current Setup:');
        console.log('  ❌ No real code execution');
        console.log('  ❌ No actual containers');
        console.log('  ❌ No real file operations');
        console.log('  ❌ No security isolation');
        console.log('\n🚀 To get full functionality, set up the Linux environment:');
        console.log('   1. Follow LINUX_SETUP_GUIDE.md');
        console.log('   2. Run the Linux setup scripts');
        console.log('   3. Then run test-full-e2b-functionality.js');

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
testCurrentSetup().catch(console.error);

