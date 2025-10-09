const axios = require('axios');

// E2B JavaScript Code Execution Test
class E2BTester {
    constructor(baseURL = 'http://localhost:3000') {
        this.baseURL = baseURL;
        this.sandboxId = null;
    }

    async testConnection() {
        console.log('🔍 Testing E2B API connection...');
        try {
            const response = await axios.get(`${this.baseURL}/health`);
            console.log(`✅ E2B API is healthy: ${response.data.status}`);
            return true;
        } catch (error) {
            console.log(`❌ E2B API connection failed: ${error.message}`);
            return false;
        }
    }

    async createSandbox() {
        console.log('🏗️  Creating E2B sandbox...');
        try {
            const response = await axios.post(`${this.baseURL}/api/sandboxes`, {
                template: 'base',
                envVars: {
                    NODE_ENV: 'development',
                    TEST_MODE: 'true'
                }
            }, { timeout: 30000 });

            this.sandboxId = response.data.id;
            console.log(`✅ Sandbox created: ${this.sandboxId}`);
            console.log(`   Status: ${response.data.status}`);
            console.log(`   Template: ${response.data.template}`);
            return true;
        } catch (error) {
            console.log(`❌ Failed to create sandbox: ${error.message}`);
            if (error.response) {
                console.log(`   Status: ${error.response.status}`);
                console.log(`   Data: ${JSON.stringify(error.response.data)}`);
            }
            return false;
        }
    }

    async executeJavaScript(code, description) {
        if (!this.sandboxId) {
            console.log('❌ No sandbox available. Create a sandbox first.');
            return false;
        }

        console.log(`\n📝 Executing JavaScript: ${description}`);
        console.log(`   Code: ${code.replace(/\n/g, ' ').substring(0, 100)}...`);

        try {
            const response = await axios.post(`${this.baseURL}/api/sandboxes/${this.sandboxId}/execute`, {
                code: code,
                language: 'javascript'
            }, { timeout: 30000 });

            console.log(`✅ Execution successful:`);
            console.log(`   Output: ${response.data.result?.text || 'No output'}`);
            if (response.data.result?.logs && response.data.result.logs.length > 0) {
                console.log(`   Logs: ${JSON.stringify(response.data.result.logs)}`);
            }
            return true;
        } catch (error) {
            console.log(`❌ Execution failed: ${error.message}`);
            if (error.response) {
                console.log(`   Status: ${error.response.status}`);
                console.log(`   Data: ${JSON.stringify(error.response.data)}`);
            }
            return false;
        }
    }

    async getSandboxStatus() {
        if (!this.sandboxId) {
            console.log('❌ No sandbox available.');
            return false;
        }

        console.log('📊 Getting sandbox status...');
        try {
            const response = await axios.get(`${this.baseURL}/api/sandboxes/${this.sandboxId}`);
            console.log(`✅ Sandbox status:`);
            console.log(`   ID: ${response.data.id}`);
            console.log(`   Status: ${response.data.status}`);
            console.log(`   Template: ${response.data.template}`);
            console.log(`   Created: ${response.data.createdAt}`);
            return true;
        } catch (error) {
            console.log(`❌ Failed to get sandbox status: ${error.message}`);
            return false;
        }
    }

    async terminateSandbox() {
        if (!this.sandboxId) {
            console.log('❌ No sandbox available.');
            return false;
        }

        console.log('🛑 Terminating sandbox...');
        try {
            await axios.delete(`${this.baseURL}/api/sandboxes/${this.sandboxId}`, { timeout: 10000 });
            console.log('✅ Sandbox terminated successfully');
            this.sandboxId = null;
            return true;
        } catch (error) {
            console.log(`❌ Failed to terminate sandbox: ${error.message}`);
            return false;
        }
    }

    async runJavaScriptTests() {
        console.log('🧪 Running JavaScript execution tests...\n');

        // Test 1: Basic JavaScript
        await this.executeJavaScript(
            'console.log("Hello from E2B JavaScript!");\nconsole.log("Current time:", new Date().toISOString());',
            'Basic console output and date'
        );

        // Test 2: Mathematical operations
        await this.executeJavaScript(
            'const a = 10;\nconst b = 20;\nconst result = a + b;\nconsole.log(`${a} + ${b} = ${result}`);\nconsole.log("Math.sqrt(16) =", Math.sqrt(16));',
            'Mathematical operations'
        );

        // Test 3: Array operations
        await this.executeJavaScript(
            'const numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(n => n * 2);\nconst sum = numbers.reduce((acc, n) => acc + n, 0);\nconsole.log("Original:", numbers);\nconsole.log("Doubled:", doubled);\nconsole.log("Sum:", sum);',
            'Array operations'
        );

        // Test 4: Object manipulation
        await this.executeJavaScript(
            'const person = {\n  name: "John Doe",\n  age: 30,\n  city: "New York"\n};\n\nconsole.log("Person:", person);\nconsole.log("Name:", person.name);\nconsole.log("Keys:", Object.keys(person));\nconsole.log("Values:", Object.values(person));',
            'Object manipulation'
        );

        // Test 5: Async operations (simulated)
        await this.executeJavaScript(
            'console.log("Starting async simulation...");\nsetTimeout(() => {\n  console.log("Async operation completed!");\n}, 100);\nconsole.log("Async operation initiated");',
            'Async operations simulation'
        );

        // Test 6: Error handling
        await this.executeJavaScript(
            'try {\n  console.log("Attempting risky operation...");\n  const result = 10 / 0;\n  console.log("Result:", result);\n} catch (error) {\n  console.log("Caught error:", error.message);\n}\nconsole.log("Error handling test completed");',
            'Error handling'
        );

        // Test 7: JSON operations
        await this.executeJavaScript(
            'const data = {\n  users: [\n    { id: 1, name: "Alice", active: true },\n    { id: 2, name: "Bob", active: false },\n    { id: 3, name: "Charlie", active: true }\n  ]\n};\n\nconsole.log("JSON data:", JSON.stringify(data, null, 2));\nconst activeUsers = data.users.filter(user => user.active);\nconsole.log("Active users:", activeUsers.length);',
            'JSON operations'
        );

        // Test 8: String manipulation
        await this.executeJavaScript(
            'const text = "Hello, E2B JavaScript World!";\nconsole.log("Original:", text);\nconsole.log("Uppercase:", text.toUpperCase());\nconsole.log("Lowercase:", text.toLowerCase());\nconsole.log("Length:", text.length);\nconsole.log("Words:", text.split(" ").length);\nconsole.log("Reversed:", text.split("").reverse().join(""));',
            'String manipulation'
        );
    }

    async runCompleteTest() {
        console.log('🚀 Starting E2B JavaScript Test Suite\n');
        console.log('=' .repeat(50));

        // Test connection
        const connected = await this.testConnection();
        if (!connected) {
            console.log('❌ Cannot proceed without API connection');
            return false;
        }

        // Create sandbox
        const sandboxCreated = await this.createSandbox();
        if (!sandboxCreated) {
            console.log('❌ Cannot proceed without sandbox');
            return false;
        }

        // Get initial status
        await this.getSandboxStatus();

        // Run JavaScript tests
        await this.runJavaScriptTests();

        // Get final status
        await this.getSandboxStatus();

        // Terminate sandbox
        await this.terminateSandbox();

        console.log('\n' + '=' .repeat(50));
        console.log('🎉 E2B JavaScript Test Suite completed!');
        return true;
    }
}

// Run the test if this file is executed directly
if (require.main === module) {
    const tester = new E2BTester();
    tester.runCompleteTest().catch(console.error);
}

module.exports = E2BTester;
