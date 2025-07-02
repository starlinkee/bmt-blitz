import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Ustawiamy katalog bieżącego pliku
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ładujemy .env z katalogu backend
dotenv.config({ path: path.join(__dirname, 'backend/.env') });

// Ustawiamy zmienne środowiskowe dlaa Passenger
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PASSENGER_APP_ENV = process.env.PASSENGER_APP_ENV || 'production';

// Importujemyy aplikację
import app from './backend/src/server.js';

// Eksportujemy dla Passenger
export default app;
