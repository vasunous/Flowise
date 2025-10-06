#!/usr/bin/env node

/**
 * Simple E2B Docker connection test
 * This is a minimal test to verify E2B Docker is working
 */

const { Sandbox } = require('e2b');

async function simpleE2BTest() {
    console.log('🔍 Simple E2B Docker Test\n');
    
    const config = {
        apiKey: 'local-dummy-key',
        domain: 'localhost:49982',
        debug: true
    };
    
    console.log('Config:', config);
    
    try {
        console.log('\n📡 Creating sandbox...');
        const sandbox = await Sandbox.create(config);
        
        console.log('✅ Sandbox created successfully!');
        console.log('Sandbox ID:', sandbox.sandboxId);
        
        console.log('\n🧪 Testing command execution...');
        const result = await sandbox.commands.run('echo "Hello E2B!"');
        console.log('Command output:', result.stdout.trim());
        
        console.log('\n🧹 Cleaning up...');
        await sandbox.kill();
        
        console.log('✅ Test completed successfully!');
        
    } catch (error) {
        console.log('❌ Test failed:', error.message);
        console.log('\nTroubleshooting:');
        console.log('1. Make sure E2B Docker is running: docker ps | grep e2b');
        console.log('2. Start E2B: ./start-e2b-docker.sh');
        console.log('3. Check logs: docker logs e2b-local');
        process.exit(1);
    }
}

simpleE2BTest();