#!/usr/bin/env node

/**
 * Fixed E2B test with correct configuration for local Docker
 */

const { Sandbox } = require('@e2b/code-interpreter');

async function testE2BFixed() {
    console.log('🔍 Testing E2B with Fixed Configuration\n');
    
    // Try different configuration approaches
    const configs = [
        {
            name: 'Config 1: HTTP URL',
            config: {
                apiKey: 'local-dummy-key',
                domain: 'http://localhost:49982',
                debug: true
            }
        },
        {
            name: 'Config 2: Domain only',
            config: {
                apiKey: 'local-dummy-key', 
                domain: 'localhost:49982',
                debug: true
            }
        },
        {
            name: 'Config 3: With template',
            config: {
                apiKey: 'local-dummy-key',
                domain: 'localhost:49982',
                debug: true,
                template: 'code-interpreter'
            }
        }
    ];
    
    for (const { name, config } of configs) {
        console.log(`\n--- ${name} ---`);
        console.log('Config:', config);
        
        try {
            console.log('📡 Creating sandbox...');
            const sandbox = await Sandbox.create(config);
            
            console.log('✅ Sandbox created successfully!');
            console.log('Sandbox ID:', sandbox.sandboxId);
            
            console.log('🐍 Testing Python code execution...');
            const execution = await sandbox.runCode('print("Hello World!")', { language: 'python' });
            
            console.log('✅ Code execution successful!');
            console.log('Text output:', execution.text);
            console.log('Stdout:', execution.logs?.stdout);
            console.log('Stderr:', execution.logs?.stderr);
            
            console.log('🧹 Cleaning up...');
            await sandbox.kill();
            
            console.log('🎉 SUCCESS with this configuration!');
            return; // Exit on first success
            
        } catch (error) {
            console.log('❌ Failed with this config:', error.message);
            if (error.cause) {
                console.log('Cause:', error.cause.code || error.cause.message);
            }
        }
    }
    
    console.log('\n❌ All configurations failed. Let me try direct HTTP API...');
    await testDirectAPI();
}

async function testDirectAPI() {
    console.log('\n🔧 Testing Direct HTTP API');
    
    try {
        // Test creating a context
        const contextResponse = await fetch('http://localhost:49982/contexts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({})
        });
        
        if (!contextResponse.ok) {
            throw new Error(`HTTP ${contextResponse.status}: ${contextResponse.statusText}`);
        }
        
        const context = await contextResponse.json();
        console.log('✅ Context created:', context);
        
        // Test code execution
        const executeResponse = await fetch('http://localhost:49982/execute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: 'print("Hello from direct API!")',
                language: 'python',
                context_id: context.id
            })
        });
        
        if (!executeResponse.ok) {
            throw new Error(`HTTP ${executeResponse.status}: ${executeResponse.statusText}`);
        }
        
        const result = await executeResponse.json();
        console.log('✅ Direct API execution successful!');
        console.log('Result:', result);
        
    } catch (error) {
        console.log('❌ Direct API test failed:', error.message);
    }
}

testE2BFixed().catch(console.error);