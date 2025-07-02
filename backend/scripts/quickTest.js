#!/usr/bin/env node

const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

console.log('🧪 Quick endpoint test from server');
console.log('==================================');

const endpoints = ['/ping', '/health', '/test', '/debug'];
const baseUrl = 'https://bmt.googlenfc.smallhost.pl';

async function testEndpoint(endpoint) {
  try {
    console.log(`\n🔍 Testing: ${endpoint}`);
    const { stdout, stderr } = await execAsync(`curl -s -w "Status: %{http_code}, Time: %{time_total}s" ${baseUrl}${endpoint}`, {
      timeout: 10000
    });
    
    if (stderr) {
      console.log(`⚠️  Stderr: ${stderr}`);
    }
    
    console.log(`📄 Response: ${stdout}`);
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

async function runTests() {
  console.log(`🌐 Base URL: ${baseUrl}`);
  console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
  
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n✅ Quick test completed');
}

runTests().catch(console.error); 