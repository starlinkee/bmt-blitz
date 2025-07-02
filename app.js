import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

console.log('🚀 Main app.js loading...');

// Ustawiamy katalog bieżącego pliku (główny katalog)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('📁 Current directory:', __dirname);

// Ładujemy .env z katalogu backend
dotenv.config({ path: path.join(__dirname, 'backend/.env') });

console.log('📄 .env loaded from:', path.join(__dirname, 'backend/.env'));

console.log('🔄 Importing server from backend/src/server.js...');
import app from './backend/src/server.js';

console.log('✅ Server imported successfully');
console.log('📤 Exporting app for Passenger');

export default app;
