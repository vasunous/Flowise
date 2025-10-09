#!/usr/bin/env node

/**
 * Test E2B with cloud service (no local setup required)
 */

const { Sandbox } = require('@e2b/code-interpreter');

async function testE2BCloud() {
    console.log('🔍 Testing E2B Cloud Service\n');
    
    try {
        console.log('📡 Creating sandbox with E2B cloud...');
        // Use E2B cloud service (no local setup required)
        // Replace 'YOUR_API_KEY' with your actual E2B API key
        const sandbox = await Sandbox.create({
            apiKey: 'YOUR_API_KEY'  // Get this from https://e2b.dev/docs/api-key
        });
        
        console.log('✅ Sandbox created successfully!');
        console.log('📊 Sandbox ID:', sandbox.id);
        
        const execution = await sandbox.runCode(`
console.log("Hello from E2B Cloud!");
const result = 5 * 6;
console.log(\`5 * 6 = \${result}\`);
        `.trim(), { language: 'javascript' });
        
        console.log('✅ Code execution successful!');
        console.log('📝 Output:', execution.text);
        
        console.log('\n🧹 Cleaning up...');
        await sandbox.kill(); 
        console.log('✅ Test completed successfully!');
        return true;
        
    } catch (error) {
        console.log('❌ Test failed:', error.message);
        if (error.cause) {
            console.log('Cause:', error.cause);
        }
        return false;
    }
}

testE2BCloud().catch(console.error);
