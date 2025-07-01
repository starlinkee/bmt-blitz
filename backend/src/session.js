import session from 'express-session';
import pgSimple from 'connect-pg-simple';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ── ustalamy katalog bieżącego pliku (src)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── ładujemy .env z katalogu backend (poziom wyżej)
dotenv.config({ path: path.join(__dirname, '../.env') });   // ważne: absolutny path

const PostgresStore = pgSimple(session);

export const sessionMiddleware = session({
  store: new PostgresStore({
    conObject: {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    },
    tableName: 'sessions',
    createTableIfMissing: true
  }),
  secret: process.env.SESSION_SECRET || 'change-me',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 godziny
  }
});
