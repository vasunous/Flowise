#!/usr/bin/env node

/**
 * Test script to verify local E2B Docker connection
 * Run this script to check if your local E2B Docker is running and accessible
 * 
 * Usage: node test-e2b-connection.js
 */

const { Sandbox } = require('e2b');

async function runCodeInE2BSandbox(jsCode) {
    const config = {
        apiKey: process.env.E2B_APIKEY || 'local-dummy-key',
        domain: process.env.E2B_DOMAIN || 'localhost:49982',
        debug: process.env.E2B_DEBUG === 'true' || true
    };

    // This connects to the E2B cloud service, which manages the secure microVM.
    // (Requires an E2B API Key)
    const sandbox = await Sandbox.create(config); 

    // Use the runCode method, specifying the language
    const execution = await sandbox.commands.run(jsCode, { language: 'javascript' });

    console.log('Output:', execution.stdout);
    console.log('Error:', execution.stderr);

    await sandbox.kill(); // Clean up the sandbox
}


async function testE2BConnection() {
    console.log('🔍 Testing E2B Docker connection...\n');
    
    // Configuration (same as used in Flowise)
    const config = {
        apiKey: process.env.E2B_APIKEY || 'local-dummy-key',
        domain: process.env.E2B_DOMAIN || 'localhost:49982',
        debug: process.env.E2B_DEBUG === 'true' || true
    };
    
    console.log('Configuration:');
    console.log(`  API Key: ${config.apiKey}`);
    console.log(`  Domain: ${config.domain}`);
    console.log(`  Debug: ${config.debug}\n`);
    try {

        await runCodeInE2BSandbox('console.log("Hello from E2B SDK!");');
        console.log('✅ Code execution test passed');
        console.log(`   Output: ${result.stdout.trim()}`);

    } catch (error) {
        console.log('❌ Code execution test failed!');
        console.log(`   Error: ${error.message}`);
        process.exit(1);
    }

    try {
        console.log('📡 Attempting to create sandbox...');
        const sandbox = await Sandbox.create(config);
        
        console.log('✅ E2B Docker is running and accessible!');
        console.log(`📦 Sandbox ID: ${sandbox.sandboxId}`);
        console.log(`🌐 Sandbox Domain: ${sandbox.sandboxDomain || 'N/A'}\n`);
        
        // Test basic functionality
        console.log('🧪 Testing basic sandbox functionality...');
        
        try {

            // Test file system
            await sandbox.filesystem.write('/tmp/test.txt', 'Hello from E2B test!');
            const content = await sandbox.filesystem.read('/tmp/test.txt');
            console.log('✅ File system test passed');
            
            // Test command execution
            const result = await sandbox.commands.run('echo "Hello E2B Docker!"');
            console.log('✅ Command execution test passed');
            console.log(`   Output: ${result.stdout.trim()}`);
            
            // Test Python execution (if available)
            try {
                const pythonResult = await sandbox.commands.run('python3 -c "print(\'Python is available!\')"');
                console.log('✅ Python execution test passed');
                console.log(`   Output: ${pythonResult.stdout.trim()}`);
            } catch (pythonError) {
                console.log('⚠️  Python test failed (might not be available in base image)');
            }
            
        } catch (funcError) {
            console.log('⚠️  Some functionality tests failed:', funcError.message);
        }
        
        console.log('\n🧹 Cleaning up sandbox...');
        await sandbox.kill();
        console.log('✅ Sandbox cleaned up successfully');
        
        console.log('\n🎉 All tests passed! Your E2B Docker is working correctly.');
        
    } catch (error) {
        console.log('❌ E2B Docker connection failed!');
        console.log(`   Error: ${error.message}`);
        
        if (error.message.includes('ECONNREFUSED')) {
            console.log('\n💡 Troubleshooting tips:');
            console.log('   1. Make sure E2B Docker is running: docker ps | grep e2b');
            console.log('   2. Check if port 49982 is accessible: curl http://localhost:49982');
            console.log('   3. Start E2B Docker: docker run -d -p 49982:49982 e2b/base');
        }
        
        if (error.message.includes('timeout')) {
            console.log('\n💡 Troubleshooting tips:');
            console.log('   1. E2B Docker might be starting up, wait a moment and try again');
            console.log('   2. Check Docker logs: docker logs $(docker ps -q --filter "ancestor=e2b/base")');
        }
        
        process.exit(1);
    }
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(`
E2B Docker Connection Test

Usage: node test-e2b-connection.js [options]

Environment Variables:
  E2B_APIKEY    API key for E2B (default: 'local-dummy-key')
  E2B_DOMAIN    E2B domain (default: 'localhost:49982')
  E2B_DEBUG     Enable debug mode (default: true)

Options:
  -h, --help    Show this help message

Examples:
  node test-e2b-connection.js
  E2B_DOMAIN=localhost:8080 node test-e2b-connection.js
`);
    process.exit(0);
}

// Run the test
testE2BConnection().catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
});