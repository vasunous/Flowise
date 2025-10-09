#!/usr/bin/env node

/**
 * Final E2B test with correct port configuration
 */

const { Sandbox } = require('@e2b/code-interpreter');

async function testE2BFinal() {
    console.log('🔍 Final E2B Test with Correct Configuration\n');
    
    const config = {
        // For local development, we can try without API key
        debug: true,
        // Try connecting to the local envd container
        host: 'localhost:8000'
    };
    
   
    
    try {
        console.log('\n📡 Creating sandbox...');
        const sandbox = await Sandbox.create(config);
        
        console.log('✅ Sandbox created successfully!');
       
        const execution = await sandbox.runCode(`
console.log("Hello from JavaScript!");
const result = 5 * 6;
console.log(\`5 * 6 = \${result}\`);
        `.trim(), { language: 'javascript' });
        
        console.log('✅ Code execution successful!');
       
        console.log('\n🧹 Cleaning up...');
        await sandbox.kill(); 
        return true;
        
    } catch (error) {
        console.log('❌ Test failed:', error.message);
        if (error.cause) {
            console.log('Cause:', error.cause);
        }
        return false;
    }
}

// Wait for container to start up
console.log('⏳ Waiting for E2B container to start up...');
setTimeout(() => {
    testE2BFinal().catch(console.error);
}, 5000);