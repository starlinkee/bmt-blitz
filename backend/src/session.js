import session from 'express-session';
import pgSimple from 'connect-pg-simple';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ── ustalamy katalog bieżącego pliku (src)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── ładujemy .env z katalogu backend (poziom wyżej)
dotenv.config({ path: path.join(__dirname, '../.env') });   // ważne: absolutny path

console.log('Session configuration:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);

const PostgresStore = pgSimple(session);

const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'change-me',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 godziny
  }
};

// Tymczasowo używaj MemoryStore dla wszystkich środowisk
console.log('Using MemoryStore for sessions (temporary)');
// sessionConfig.store = new PostgresStore({
//   conObject: {
//     connectionString: process.env.DATABASE_URL,
//     ssl: { rejectUnauthorized: false },
//   },
//   tableName: 'sessions',
//   createTableIfMissing: true
// });

console.log('Session middleware configured');

export const sessionMiddleware = session(sessionConfig);
