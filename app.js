import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Ustawiamy katalog bieżącego pliku (główny katalog)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ładujemy .env z katalogu backend
dotenv.config({ path: path.join(__dirname, 'backend/.env') });

import app from './backend/src/server.js';

export default app;
