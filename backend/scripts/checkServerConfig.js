#!/usr/bin/env node

const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

console.log('🔍 Server Configuration Check');
console.log('============================');

// Sprawdź plik .env
const envPath = path.join(__dirname, '..', '.env');
console.log('📁 .env file path:', envPath);

try {
  const envExists = fs.existsSync(envPath);
  console.log('✅ .env file exists:', envExists);
  
  if (envExists) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    console.log('📄 .env content:');
    console.log(envContent);
  }
} catch (err) {
  console.log('❌ Error reading .env:', err.message);
}

// Załaduj zmienne środowiskowe
dotenv.config({ path: envPath });

console.log('\n🌍 Environment Variables:');
console.log('========================');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PASSENGER_APP_ENV:', process.env.PASSENGER_APP_ENV);
console.log('PHUSION_PASSENGER_VERSION:', process.env.PHUSION_PASSENGER_VERSION);
console.log('PORT:', process.env.PORT);
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('SESSION_SECRET exists:', !!process.env.SESSION_SECRET);

if (process.env.DATABASE_URL) {
  try {
    const url = new URL(process.env.DATABASE_URL);
    console.log('🔗 DATABASE_URL parsed:');
    console.log('  Protocol:', url.protocol);
    console.log('  Hostname:', url.hostname);
    console.log('  Port:', url.port);
    console.log('  Database:', url.pathname.substring(1));
    console.log('  Username:', url.username);
    console.log('  Password length:', url.password ? url.password.length : 0);
  } catch (err) {
    console.log('❌ Error parsing DATABASE_URL:', err.message);
  }
}

console.log('\n📂 File System Check:');
console.log('====================');
try {
  const files = [
    '../app.js',
    '../src/server.js',
    '../db.js',
    '../models/index.js'
  ];
  
  for (const file of files) {
    const filePath = path.join(__dirname, file);
    const exists = fs.existsSync(filePath);
    console.log(`${exists ? '✅' : '❌'} ${file}: ${exists}`);
  }
} catch (err) {
  console.log('❌ Error checking files:', err.message);
}

console.log('\n🔧 Node.js Info:');
console.log('===============');
console.log('Node version:', process.version);
console.log('Platform:', process.platform);
console.log('Architecture:', process.arch);
console.log('Current working directory:', process.cwd());

console.log('\n✅ Configuration check completed'); 