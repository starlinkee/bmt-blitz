const session = require('express-session');
const pgSimple = require('connect-pg-simple');
const dotenv = require('dotenv');
const path = require('path');

// ── ładujemy .env z katalogu backend (poziom wyżej)
dotenv.config({ path: path.join(__dirname, '../.env') });   // ważne: absolutny path

console.log('Session configuration:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('SESSION_SECRET exists:', !!process.env.SESSION_SECRET);

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

console.log('Session config created:', {
  secret: !!sessionConfig.secret,
  resave: sessionConfig.resave,
  saveUninitialized: sessionConfig.saveUninitialized,
  cookie: sessionConfig.cookie
});

// Tymczasowo używaj MemoryStore dla wszystkich środowisk
console.log('Using MemoryStore for sessions (temporary)');
console.log('Reason: PostgreSQL store causing hangs');

// sessionConfig.store = new PostgresStore({
//   conObject: {
//     connectionString: process.env.DATABASE_URL,
//     ssl: { rejectUnauthorized: false },
//   },
//   tableName: 'sessions',
//   createTableIfMissing: true
// });

console.log('Session middleware configured');

const sessionMiddleware = session(sessionConfig);

module.exports = { sessionMiddleware };
