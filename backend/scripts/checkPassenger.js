#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

console.log('🚌 Passenger Configuration Check');
console.log('================================');

async function checkPassenger() {
  try {
    // Sprawdź czy Passenger działa
    console.log('\n🔍 Checking Passenger status...');
    try {
      const { stdout } = await execAsync('passenger-status');
      console.log('✅ Passenger is running');
      console.log('📊 Passenger status:');
      console.log(stdout.substring(0, 500) + '...');
    } catch (error) {
      console.log('❌ Passenger status check failed:', error.message);
    }

    // Sprawdź logi Passenger
    console.log('\n📋 Checking Passenger logs...');
    const logPaths = [
      '~/domains/bmt.googlenfc.smallhost.pl/logs/error.log',
      '~/domains/bmt.googlenfc.smallhost.pl/logs/app.log',
      '/var/log/passenger.log'
    ];

    for (const logPath of logPaths) {
      try {
        const expandedPath = logPath.replace('~', process.env.HOME);
        if (fs.existsSync(expandedPath)) {
          console.log(`📄 Found log file: ${logPath}`);
          const { stdout } = await execAsync(`tail -20 ${expandedPath}`);
          console.log('📝 Last 20 lines:');
          console.log(stdout);
        } else {
          console.log(`❌ Log file not found: ${logPath}`);
        }
      } catch (error) {
        console.log(`⚠️  Error reading log ${logPath}:`, error.message);
      }
    }

    // Sprawdź konfigurację Passenger
    console.log('\n⚙️  Checking Passenger configuration...');
    try {
      const { stdout } = await execAsync('passenger-config --root');
      console.log('✅ Passenger root:', stdout.trim());
    } catch (error) {
      console.log('❌ Passenger config check failed:', error.message);
    }

    // Sprawdź procesy Node.js
    console.log('\n🔍 Checking Node.js processes...');
    try {
      const { stdout } = await execAsync('ps aux | grep node | grep -v grep');
      console.log('📊 Node.js processes:');
      console.log(stdout || 'No Node.js processes found');
    } catch (error) {
      console.log('❌ Process check failed:', error.message);
    }

    // Sprawdź porty
    console.log('\n🌐 Checking ports...');
    try {
      const { stdout } = await execAsync('netstat -tlnp | grep :80');
      console.log('📊 Port 80:');
      console.log(stdout || 'No process on port 80');
    } catch (error) {
      console.log('❌ Port check failed:', error.message);
    }

    // Sprawdź uprawnienia
    console.log('\n🔐 Checking permissions...');
    try {
      const appPath = '~/domains/bmt.googlenfc.smallhost.pl/public_nodejs';
      const expandedPath = appPath.replace('~', process.env.HOME);
      const { stdout } = await execAsync(`ls -la ${expandedPath}`);
      console.log('📁 App directory permissions:');
      console.log(stdout);
    } catch (error) {
      console.log('❌ Permission check failed:', error.message);
    }

  } catch (error) {
    console.error('❌ Error during Passenger check:', error);
  }
 