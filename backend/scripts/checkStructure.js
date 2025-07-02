#!/usr/bin/env node

const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const execAsync = promisify(exec);

console.log('📁 Directory Structure Check');
console.log('============================');

async function checkStructure() {
  try {
    // Sprawdź strukturę katalogów
    console.log('\n🔍 Checking directory structure...');
    
    const basePath = process.cwd();
    console.log('📍 Current directory:', basePath);
    
    const paths = [
      '../app.js',
      '../public/.htaccess',
      '../package.json',
      '../backend/.env',
      '../backend/src/server.js',
      '../backend/db.js'
    ];
    
    for (const filePath of paths) {
      const fullPath = path.join(basePath, filePath);
      const exists = fs.existsSync(fullPath);
      console.log(`${exists ? '✅' : '❌'} ${filePath}: ${exists}`);
      
      if (exists && filePath.includes('.htaccess')) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          console.log('📄 .htaccess content:');
          console.log(content);
        } catch (error) {
          console.log('❌ Error reading .htaccess:', error.message);
        }
      }
    }
    
    // Sprawdź uprawnienia
    console.log('\n🔐 Checking permissions...');
    try {
      const { stdout } = await execAsync('ls -la ../');
      console.log('📁 Parent directory permissions:');
      console.log(stdout);
    } catch (error) {
      console.log('❌ Permission check failed:', error.message);
    }
    
    // Sprawdź czy Passenger może znaleźć aplikację
    console.log('\n🚌 Checking Passenger configuration...');
    try {
      const { stdout } = await execAsync('pwd');
      console.log('📍 Current working directory:', stdout.trim());
      
      const { stdout: lsOutput } = await execAsync('ls -la ../');
      console.log('📁 Files in parent directory:');
      console.log(lsOutput);
      
    } catch (error) {
      console.log('❌ Directory check failed:', error.message);
    }
    
    // Sprawdź zmienne środowiskowe
    console.log('\n🌍 Environment variables:');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('PASSENGER_APP_ENV:', process.env.PASSENGER_APP_ENV);
    console.log('PHUSION_PASSENGER_VERSION:', process.env.PHUSION_PASSENGER_VERSION);
    console.log('PORT:', process.env.PORT);
    
  } catch (error) {
    console.error('❌ Error during structure check:', error);
  }
}

checkStructure(); 