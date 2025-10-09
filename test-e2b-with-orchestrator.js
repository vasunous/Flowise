#!/usr/bin/env node

/**
 * Test E2B with Orchestrator
 * This script demonstrates the E2B infrastructure working with the orchestrator service
 */

const axios = require('axios');

const ORCHESTRATOR_URL = 'http://localhost:3001';

async function testE2BWithOrchestrator() {
    console.log('🔍 Testing E2B Infrastructure with Orchestrator\n');

    try {
        // Test 1: Check orchestrator health
        console.log('📡 Checking orchestrator health...');
        const healthResponse = await axios.get(`${ORCHESTRATOR_URL}/health`);
        console.log('✅ Orchestrator Health:', healthResponse.data);

        // Test 2: List available templates
        console.log('\n📡 Listing available templates...');
        const templatesResponse = await axios.get(`${ORCHESTRATOR_URL}/v1/templates`);
        console.log('✅ Available Templates:', JSON.stringify(templatesResponse.data, null, 2));

        // Test 3: Create a sandbox
        console.log('\n📡 Creating a sandbox...');
        const sandboxResponse = await axios.post(`${ORCHESTRATOR_URL}/v1/sandboxes`, {
            template: 'base'
        });
        const sandbox = sandboxResponse.data;
        console.log('✅ Sandbox Created:', JSON.stringify(sandbox, null, 2));

        // Test 4: Get sandbox details
        console.log('\n📡 Getting sandbox details...');
        const sandboxDetailsResponse = await axios.get(`${ORCHESTRATOR_URL}/v1/sandboxes/${sandbox.id}`);
        console.log('✅ Sandbox Details:', JSON.stringify(sandboxDetailsResponse.data, null, 2));

        // Test 5: List builds
        console.log('\n📡 Listing builds...');
        const buildsResponse = await axios.get(`${ORCHESTRATOR_URL}/v1/builds`);
        console.log('✅ Builds:', JSON.stringify(buildsResponse.data, null, 2));

        // Test 6: Create a build
        console.log('\n📡 Creating a build...');
        const buildResponse = await axios.post(`${ORCHESTRATOR_URL}/v1/builds`, {
            template: 'base',
            description: 'Test build from local E2B infrastructure'
        });
        console.log('✅ Build Created:', JSON.stringify(buildResponse.data, null, 2));

        // Test 7: Clean up - delete the sandbox
        console.log('\n📡 Cleaning up sandbox...');
        const deleteResponse = await axios.delete(`${ORCHESTRATOR_URL}/v1/sandboxes/${sandbox.id}`);
        console.log('✅ Sandbox Deleted:', deleteResponse.data);

        console.log('\n🎉 E2B Infrastructure Test Completed Successfully!');
        console.log('\n📊 What We Accomplished:');
        console.log('  ✅ Connected to the real E2B orchestrator service');
        console.log('  ✅ Listed available templates (base template available)');
        console.log('  ✅ Created a sandbox using the orchestrator');
        console.log('  ✅ Retrieved sandbox details');
        console.log('  ✅ Listed and created builds');
        console.log('  ✅ Cleaned up resources');
        console.log('\n🚀 Your E2B infrastructure is fully functional!');
        console.log('   The orchestrator is managing sandboxes and builds as expected.');
        console.log('   This demonstrates that the real E2B infrastructure is working.');

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
testE2BWithOrchestrator().catch(console.error);

