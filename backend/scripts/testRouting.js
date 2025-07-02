#!/usr/bin/env node

const { createServer } = require('http');

console.log('🧪 Testing app routing');
console.log('======================');

try {
  console.log('🔄 Importing app...');
  const app = await import('../app.js');
  
  if (!app.default) {
    console.log('❌ App.default not found');
    process.exit(1);
  }
  
  console.log('✅ App imported successfully');
  
  // Stwórz prosty serwer testowy
  const server = createServer(app.default);
  
  console.log('🔄 Starting test server on port 3001...');
  server.listen(3001, () => {
    console.log('✅ Test server started on port 3001');
    
    // Testuj endpointy lokalnie
    testEndpoints();
  });
  
  async function testEndpoints() {
    const endpoints = ['/ping', '/health', '/test', '/debug'];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`\n🔍 Testing ${endpoint}...`);
        
        const response = await fetch(`http://localhost:3001${endpoint}`);
        console.log(`✅ Status: ${response.status}`);
        
        const text = await response.text();
        console.log(`📄 Response: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`);
        
      } catch (error) {
        console.log(`❌ Error testing ${endpoint}:`, error.message);
      }
    }
    
    console.log('\n✅ Routing test completed');
    server.close(() => {
      console.log('🔄 Test server closed');
      process.exit(0);
    });
  }
  
} catch (error) {
  console.error('❌ Error during routing test:', error);
  process.exit(1);
} 