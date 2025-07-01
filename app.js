// Główny plik aplikacji dla Small.pl
// Importuje i eksportuje aplikację Express

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Ustawiamy katalog bieżącego pliku (główny katalog)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ścieżka do pliku .env
const envPath = path.join(__dirname, 'backend/.env');
console.log('🔧 App.js: Ładowanie zmiennych środowiskowych...');
console.log('📁 Katalog bieżący:', __dirname);
console.log('📁 Ścieżka do .env:', envPath);

// Sprawdź czy plik istnieje
if (fs.existsSync(envPath)) {
  console.log('✅ Plik .env istnieje');
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('📄 Zawartość .env (pierwsze linie):', envContent.split('\n').slice(0, 3).join('\n'));
} else {
  console.log('❌ Plik .env NIE istnieje!');
}

// Ładujemy .env z katalogu backend PRZED importem server.js
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('❌ Błąd ładowania .env:', result.error);
} else {
  console.log('✅ .env załadowany pomyślnie');
  console.log('📦 NODE_ENV:', process.env.NODE_ENV);
  console.log('📦 DATABASE_URL exists:', !!process.env.DATABASE_URL);
  console.log('📦 SESSION_SECRET exists:', !!process.env.SESSION_SECRET);
  if (process.env.DATABASE_URL) {
    console.log('📦 DATABASE_URL (początek):', process.env.DATABASE_URL.substring(0, 20) + '...');
  }
}

// Teraz importujemy server.js - zmienne środowiskowe są już załadowane
import app from './backend/src/server.js';

export default app;
