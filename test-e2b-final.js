#!/usr/bin/env node

/**
 * Final E2B test with correct port configuration
 */

const { Sandbox } = require('@e2b/code-interpreter');

async function testE2BFinal() {
    console.log('🔍 Final E2B Test with Correct Configuration\n');
    
    const config = {
        apiKey: 'local-dummy-key',
        domain: 'localhost:49999',  // Correct port that SDK expects
        debug: true
    };
    
    console.log('Config:', config);
    
    try {
        console.log('\n📡 Creating sandbox...');
        const sandbox = await Sandbox.create(config);
        
        console.log('✅ Sandbox created successfully!');
        console.log('Sandbox ID:', sandbox.sandboxId);
        
        console.log('\n🐍 Testing Python code execution...');
        const execution = await sandbox.runCode(`
print("Hello from E2B Local Docker!")
import sys
print(f"Python version: {sys.version}")

# Test some calculations
result = 2 + 2
print(f"2 + 2 = {result}")

# Test imports
import math
print(f"π = {math.pi:.4f}")
        `.trim(), { language: 'python' });
        
        console.log('✅ Code execution successful!');
        console.log('\n📄 Output:');
        console.log('Text:', execution.text);
        if (execution.logs) {
            console.log('Stdout:', execution.logs.stdout);
            console.log('Stderr:', execution.logs.stderr);
        }
        
        console.log('\n🧪 Testing JavaScript execution...');
        const jsExecution = await sandbox.runCode(`
console.log("Hello from JavaScript!");
const result = 5 * 6;
console.log(\`5 * 6 = \${result}\`);
        `.trim(), { language: 'javascript' });
        
        console.log('✅ JavaScript execution successful!');
        console.log('JS Output:', jsExecution.text);
        
        console.log('\n🧹 Cleaning up...');
        await sandbox.kill();
        
        console.log('\n🎉 ALL TESTS PASSED! E2B Local Docker is working perfectly!');
        console.log('\n✅ Your Flowise E2B integration is ready to use!');
        
        return true;
        
    } catch (error) {
        console.log('❌ Test failed:', error.message);
        if (error.cause) {
            console.log('Cause:', error.cause);
        }
        
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Make sure E2B container is running on port 49999');
        console.log('2. Check: docker ps | grep e2b');
        console.log('3. Check logs: docker logs e2b-local');
        
        return false;
    }
}

// Wait for container to start up
console.log('⏳ Waiting for E2B container to start up...');
setTimeout(() => {
    testE2BFinal().catch(console.error);
}, 5000);