const axios = require('axios');

// Simple E2B JavaScript Test
async function testE2BJavaScript() {
    const baseURL = 'http://localhost:3000';
    
    console.log('🧪 Testing E2B JavaScript Execution\n');

    try {
        // Test 1: Check API health
        console.log('1️⃣ Testing API health...');
        const healthResponse = await axios.get(`${baseURL}/health`);
        console.log(`✅ API is healthy: ${healthResponse.data.status}\n`);

        // Test 2: Create sandbox
        console.log('2️⃣ Creating sandbox...');
        const sandboxResponse = await axios.post(`${baseURL}/api/sandboxes`, {
            template: 'base',
            envVars: { TEST_MODE: 'true' }
        });
        
        const sandboxId = sandboxResponse.data.id;
        console.log(`✅ Sandbox created: ${sandboxId}\n`);

        // Test 3: Execute simple JavaScript
        console.log('3️⃣ Executing JavaScript code...');
        const jsCode = `
console.log("Hello from E2B!");
console.log("2 + 2 =", 2 + 2);
console.log("Current time:", new Date().toISOString());

// Array operations
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((a, b) => a + b, 0);
console.log("Sum of [1,2,3,4,5] =", sum);

// Object operations
const person = { name: "Alice", age: 30 };
console.log("Person:", person.name, "is", person.age, "years old");
`;

        const executeResponse = await axios.post(`${baseURL}/api/sandboxes/${sandboxId}/execute`, {
            code: jsCode,
            language: 'javascript'
        });

        console.log('✅ JavaScript executed successfully:');
        console.log('Output:');
        console.log(executeResponse.data.result?.text || 'No output');
        console.log('');

        // Test 4: Execute more complex JavaScript
        console.log('4️⃣ Executing complex JavaScript...');
        const complexCode = `
// Function definition
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci sequence:");
for (let i = 0; i < 8; i++) {
    console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}

// Async simulation
console.log("Starting async operation...");
setTimeout(() => {
    console.log("Async operation completed!");
}, 50);

// JSON operations
const data = {
    users: [
        { name: "John", score: 95 },
        { name: "Jane", score: 87 },
        { name: "Bob", score: 92 }
    ]
};

const topScorer = data.users.reduce((max, user) => 
    user.score > max.score ? user : max
);

console.log("Top scorer:", topScorer.name, "with score", topScorer.score);
`;

        const complexResponse = await axios.post(`${baseURL}/api/sandboxes/${sandboxId}/execute`, {
            code: complexCode,
            language: 'javascript'
        });

        console.log('✅ Complex JavaScript executed:');
        console.log('Output:');
        console.log(complexResponse.data.result?.text || 'No output');
        console.log('');

        // Test 5: Get sandbox status
        console.log('5️⃣ Getting sandbox status...');
        const statusResponse = await axios.get(`${baseURL}/api/sandboxes/${sandboxId}`);
        console.log(`✅ Sandbox status: ${statusResponse.data.status}\n`);

        // Test 6: Terminate sandbox
        console.log('6️⃣ Terminating sandbox...');
        await axios.delete(`${baseURL}/api/sandboxes/${sandboxId}`);
        console.log('✅ Sandbox terminated successfully\n');

        console.log('🎉 All tests passed! E2B JavaScript execution is working!');

    } catch (error) {
        console.log('❌ Test failed:', error.message);
        if (error.response) {
            console.log('Response status:', error.response.status);
            console.log('Response data:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

// Run the test
testE2BJavaScript();