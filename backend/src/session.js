import session from 'express-session';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ── ustalamy katalog bieżącego pliku (src)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── ładujemy .env z katalogu backend (poziom wyżej)
dotenv.config({ path: path.join(__dirname, '../.env') });   // ważne: absolutny path

export const sessionMiddleware = session({
  secret           : process.env.SESSION_SECRET || 'change-me',
  resave           : false,
  saveUninitialized: false,
  cookie           : { sameSite: 'lax' }
});
