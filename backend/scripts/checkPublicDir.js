#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

console.log('📂 Public Directory Check');
console.log('========================');

async function checkPublicDir() {
  try {
    // Sprawdź katalog public
    console.log('\n🔍 Checking public directory...');
    
    const publicPath = path.join(process.cwd(), '..', 'public');
    console.log('📍 Public directory path:', publicPath);
    
    if (fs.existsSync(publicPath)) {
      console.log('✅ Public directory exists');
      
      const files = fs.readdirSync(publicPath);
      console.log('📁 Files in public directory:');
      files.forEach(file => {
        console.log(`  - ${file}`);
      });
      
      // Sprawdź .htaccess
      const htaccessPath = path.join(publicPath, '.htaccess');
      if (fs.existsSync(htaccessPath)) {
        console.log('✅ .htaccess exists');
        const content = fs.readFileSync(htaccessPath, 'utf8');
        console.log('📄 .htaccess content:');
        console.log(content);
      } else {
        console.log('❌ .htaccess not found');
      }
      
    } else {
      console.log('❌ Public directory not found');
    }
    
    // Sprawdź czy Passenger może obsługiwać żądania
    console.log('\n🚌 Checking Passenger request handling...');
    try {
      const { stdout } = await execAsync('curl -I https://bmt.googlenfc.smallhost.pl/ 2>/dev/null | head -5');
      console.log('📊 HTTP response headers:');
      console.log(stdout);
    } catch (error) {
      console.log('❌ HTTP check failed:', error.message);
    }
    
    // Sprawdź logi Apache/Passenger
    console.log('\n📋 Checking Apache/Passenger logs...');
    const logPaths = [
      '/var/log/apache2/error.log',
      '/var/log/httpd/error_log',
      '~/domains/bmt.googlenfc.smallhost.pl/logs/error.log'
    ];
    
    for (const logPath of logPaths) {
      try {
        const expandedPath = logPath.replace('~', process.env.HOME);
        if (fs.existsSync(expandedPath)) {
          console.log(`📄 Found log: ${logPath}`);
          const { stdout } = await execAsync(`tail -10 ${expandedPath}`);
          console.log('📝 Last 10 lines:');
          console.log(stdout);
        }
      } catch (error) {
        // Ignore errors for non-existent logs
      }
    }
    
  } catch (error) {
    console.error('❌ Error during public directory check:', error);
  }
}

checkPublicDir(); 