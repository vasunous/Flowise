const axios = require('axios');

// Test script for E2B Real Stack
async function testE2BRealStack() {
    console.log('🧪 Testing E2B Real Stack...\n');

    const baseURL = 'http://localhost:3000';
    const services = [
        { name: 'E2B API', url: 'http://localhost:3000/health' },
        { name: 'Orchestrator', url: 'http://localhost:3001/health' },
        { name: 'Envd', url: 'http://localhost:8000/health' },
        { name: 'Client Proxy', url: 'http://localhost:3004/health' },
        { name: 'Docker Reverse Proxy', url: 'http://localhost:3005/health' }
    ];

    // Test service health
    console.log('📊 Testing service health...');
    for (const service of services) {
        try {
            const response = await axios.get(service.url, { timeout: 5000 });
            console.log(`✅ ${service.name}: ${response.status} - ${response.data?.status || 'OK'}`);
        } catch (error) {
            console.log(`❌ ${service.name}: ${error.message}`);
        }
    }

    console.log('\n🔧 Testing E2B API functionality...');

    try {
        // Test creating a sandbox
        console.log('Creating sandbox...');
        const sandboxResponse = await axios.post(`${baseURL}/api/sandboxes`, {
            template: 'base',
            envVars: {}
        }, { timeout: 30000 });

        console.log(`✅ Sandbox created: ${sandboxResponse.data.id}`);

        const sandboxId = sandboxResponse.data.id;

        // Test executing code in the sandbox
        console.log('Executing code in sandbox...');
        const executeResponse = await axios.post(`${baseURL}/api/sandboxes/${sandboxId}/execute`, {
            code: 'print("Hello from E2B Real Stack!")',
            language: 'python'
        }, { timeout: 30000 });

        console.log(`✅ Code executed successfully:`);
        console.log(`   Output: ${executeResponse.data.result?.text || 'No output'}`);
        console.log(`   Logs: ${JSON.stringify(executeResponse.data.result?.logs || [])}`);

        // Test terminating the sandbox
        console.log('Terminating sandbox...');
        await axios.delete(`${baseURL}/api/sandboxes/${sandboxId}`, { timeout: 10000 });
        console.log('✅ Sandbox terminated');

    } catch (error) {
        console.log(`❌ API test failed: ${error.message}`);
        if (error.response) {
            console.log(`   Status: ${error.response.status}`);
            console.log(`   Data: ${JSON.stringify(error.response.data)}`);
        }
    }

    console.log('\n🎉 E2B Real Stack test completed!');
}

// Run the test
testE2BRealStack().catch(console.error);
