#!/usr/bin/env node

/**
 * Test E2B Code Interpreter (same as used in Flowise)
 */

const { Sandbox } = require('@e2b/code-interpreter');

async function testCodeInterpreter() {
    console.log('🔍 Testing E2B Code Interpreter (Flowise style)\n');
    
    const config = {
        apiKey: 'local-dummy-key',
        domain: 'localhost:49982',
        debug: true
    };
    
    console.log('Config:', config);
    
    try {
        console.log('\n📡 Creating code interpreter sandbox...');
        const sandbox = await Sandbox.create(config);
        
        console.log('✅ Code Interpreter sandbox created successfully!');
        console.log('Sandbox ID:', sandbox.sandboxId);
        
        console.log('\n🐍 Testing Python code execution...');
        const execution = await sandbox.runCode('print("Hello from E2B Code Interpreter!")', { language: 'python' });
        
        console.log('✅ Python execution successful!');
        console.log('Output:', execution.text || 'No text output');
        console.log('Logs:', execution.logs);
        
        console.log('\n🧹 Cleaning up...');
        await sandbox.kill();
        
        console.log('✅ Code Interpreter test completed successfully!');
        
    } catch (error) {
        console.log('❌ Code Interpreter test failed:', error.message);
        console.log('Error details:', error);
        process.exit(1);
    }
}

testCodeInterpreter();