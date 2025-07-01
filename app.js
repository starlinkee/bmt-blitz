// Główny plik aplikacji dla Small.pl
// Importuje i eksportuje aplikację Express

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Ustawiamy katalog bieżącego pliku (główny katalog)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ładujemy .env z katalogu backend PRZED importem server.js
dotenv.config({ path: path.join(__dirname, 'backend/.env') });

// Teraz importujemy server.js - zmienne środowiskowe są już załadowane
import app from './backend/src/server.js';

export default app;
