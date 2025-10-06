#!/usr/bin/env node

/**
 * Working E2B test with correct API usage
 */

const { Sandbox } = require('@e2b/code-interpreter');

async function testWorkingE2B() {
    console.log('🔍 Testing E2B with Working Configuration\n');
    
    // Test direct HTTP API first (this should work)
    console.log('=== Testing Direct HTTP API ===');
    await testDirectAPI();
    
    console.log('\n=== Testing E2B SDK with corrected config ===');
    await testE2BSDKCorrected();
}

async function testDirectAPI() {
    try {
        // Create context
        console.log('📡 Creating context...');
        const contextResponse = await fetch('http://localhost:49982/contexts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        
        const context = await contextResponse.json();
        console.log('✅ Context created:', context.id);
        
        // Execute code with correct parameters
        console.log('🐍 Executing Python code...');
        const executeResponse = await fetch('http://localhost:49982/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code: 'print("Hello from E2B!")\nresult = 2 + 2\nprint(f"2 + 2 = {result}")',
                context_id: context.id,
                language: 'python'
            })
        });
        
        if (!executeResponse.ok) {
            const errorText = await executeResponse.text();
            throw new Error(`HTTP ${executeResponse.status}: ${errorText}`);
        }
        
        const result = await executeResponse.json();
        console.log('✅ Direct API execution successful!');
        console.log('📄 Result:', JSON.stringify(result, null, 2));
        
        return true;
        
    } catch (error) {
        console.log('❌ Direct API test failed:', error.message);
        return false;
    }
}

async function testE2BSDKCorrected() {
    // The issue might be that the E2B SDK expects a different URL format
    // Let's try with the correct API URL
    const config = {
        apiKey: 'local-dummy-key',
        // Try different URL formats that might work with the SDK
        domain: 'localhost:49982',
        debug: true
    };
    
    console.log('Config:', config);
    
    try {
        console.log('📡 Creating sandbox with E2B SDK...');
        const sandbox = await Sandbox.create(config);
        
        console.log('✅ Sandbox created:', sandbox.sandboxId);
        
        // The SDK might be trying to connect to a different port internally
        // Let's see if we can override the internal connection
        console.log('🐍 Testing code execution...');
        
        // Try with a simple code first
        const execution = await sandbox.runCode('print("Hello from SDK!")', { 
            language: 'python'
        });
        
        console.log('✅ SDK execution successful!');
        console.log('📄 Text:', execution.text);
        console.log('📄 Logs:', execution.logs);
        
        await sandbox.kill();
        return true;
        
    } catch (error) {
        console.log('❌ SDK test failed:', error.message);
        
        // Let's examine the error more closely
        if (error.cause && error.cause.code === 'ECONNREFUSED') {
            console.log('🔍 Connection refused - the SDK might be trying to connect to a different port');
            console.log('💡 This suggests the SDK connection logic needs to be updated in Flowise');
        }
        
        return false;
    }
}

// Also test what the E2B SDK is actually trying to connect to
async function debugE2BConnection() {
    console.log('\n=== Debugging E2B SDK Connection ===');
    
    // Let's see if we can intercept the fetch calls
    const originalFetch = global.fetch;
    global.fetch = async (url, options) => {
        console.log('🔍 SDK trying to fetch:', url);
        console.log('🔍 Options:', options?.method || 'GET');
        return originalFetch(url, options);
    };
    
    try {
        const { Sandbox } = require('@e2b/code-interpreter');
        const sandbox = await Sandbox.create({
            apiKey: 'local-dummy-key',
            domain: 'localhost:49982',
            debug: true
        });
        
        await sandbox.runCode('print("test")', { language: 'python' });
        
    } catch (error) {
        console.log('Debug error:', error.message);
    } finally {
        global.fetch = originalFetch;
    }
}

testWorkingE2B()
    .then(() => debugE2BConnection())
    .catch(console.error);