#!/usr/bin/env node

import fetch from 'node-fetch';

const BASE_URL = 'https://bmt.googlenfc.smallhost.pl';

console.log('🧪 Testing endpoints');
console.log('===================');

const endpoints = [
  '/ping',
  '/health',
  '/test', 
  '/debug'
];

async function testEndpoint(endpoint) {
  try {
    console.log(`\n🔍 Testing: ${endpoint}`);
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      timeout: 10000
    });
    
    console.log(`✅ Status: ${response.status}`);
    console.log(`📋 Headers:`, Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.text();
      console.log(`📄 Response: ${data.substring(0, 200)}${data.length > 200 ? '...' : ''}`);
    } else {
      console.log(`❌ Error response: ${response.statusText}`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    if (error.code === 'ECONNREFUSED') {
      console.log('  🔍 Connection refused - server may not be running');
    } else if (error.code === 'ENOTFOUND') {
      console.log('  🔍 Host not found - check domain name');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('  🔍 Request timeout - server may be hanging');
    }
  }
}

async function runTests() {
  console.log(`🌐 Base URL: ${BASE_URL}`);
  console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
  
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint);
    // Krótka przerwa między testami
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n✅ Endpoint testing completed');
}

runTests().catch(console.error); 