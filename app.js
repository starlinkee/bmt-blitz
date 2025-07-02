import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

console.log('🚀 Main app.js loading...');

// Ustawiamy katalog bieżącego pliku (główny katalog)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('📁 Current directory:', __dirname);

// Sprawdź zmienne Passenger
console.log('🚌 Passenger environment check:');
console.log('  PASSENGER_APP_ENV:', process.env.PASSENGER_APP_ENV);
console.log('  PHUSION_PASSENGER_VERSION:', process.env.PHUSION_PASSENGER_VERSION);
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  PORT:', process.env.PORT);

// Ładujemy .env z katalogu backend
dotenv.config({ path: path.join(__dirname, 'backend/.env') });

console.log('📄 .env loaded from:', path.join(__dirname, 'backend/.env'));

console.log('🔄 Importing server from backend/src/server.js...');
import app from './backend/src/server.js';

console.log('✅ Server imported successfully');
console.log('📤 Exporting app for Passenger');

// Sprawdź czy app jest poprawnie załadowany
if (app && typeof app === 'function') {
  console.log('✅ App is properly loaded and ready for Passenger');
} else {
  console.log('❌ App is not properly loaded');
}

export default app;
