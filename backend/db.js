// db.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ── ustalamy katalog bieżącego pliku
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── ładujemy .env z katalogu backend
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('🔧 Database configuration:');
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('  DIALECT:', process.env.DIALECT || 'postgres');
console.log('  .env file path:', path.join(__dirname, '.env'));

// ── logowanie DATABASE_URL (bez hasła)
if (process.env.DATABASE_URL) {
  const urlParts = process.env.DATABASE_URL.split('@');
  if (urlParts.length === 2) {
    const hostPart = urlParts[1];
    console.log('  DATABASE_URL host part:', hostPart);
  }
  
  // ── tymczasowe logowanie hasła (do debugowania)
  try {
    const url = new URL(process.env.DATABASE_URL);
    console.log('  Parsed username:', url.username);
    console.log('  Parsed password length:', url.password ? url.password.length : 0);
    console.log('  Parsed password first char:', url.password ? url.password[0] : 'none');
    console.log('  Parsed password last char:', url.password ? url.password[url.password.length - 1] : 'none');
  } catch (err) {
    console.log('  ❌ Error parsing DATABASE_URL:', err.message);
  }
} else {
  console.log('  ⚠️  No DATABASE_URL found - will use SQLite fallback');
}

// ── konfiguracja bazy danych
const config = {
  dialect: process.env.DIALECT || 'postgres',
  logging: (msg) => console.log('🔍 DB Query:', msg), // logowanie zapytań SQL
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

// ── jeśli mamy DATABASE_URL, parsuj go i ustaw explicitne parametry
if (process.env.DATABASE_URL) {
  console.log('🔗 Parsing DATABASE_URL...');
  
  try {
    // ── parsuj DATABASE_URL
    const url = new URL(process.env.DATABASE_URL);
    
    config.host = url.hostname;
    config.port = url.port;
    config.database = url.pathname.substring(1); // usuń pierwszy /
    config.username = url.username;
    config.password = url.password;
    
    console.log('✅ Parsed connection params:', {
      host: config.host,
      port: config.port,
      database: config.database,
      username: config.username,
      hasPassword: !!config.password
    });
    
    // ── sprawdź czy to PostgreSQL
    if (process.env.DATABASE_URL.includes('postgres')) {
      config.dialect = 'postgres';
      // Wyłącz SSL - serwer nie obsługuje
      config.dialectOptions = {
        ssl: false
      };
      console.log('✅ PostgreSQL connection WITHOUT SSL (server does not support SSL)');
    } else if (process.env.DATABASE_URL.includes('sqlite')) {
      // ── dla SQLite używamy storage zamiast database
      config.dialect = 'sqlite';
      config.storage = config.database; // używamy ścieżki jako storage
      delete config.database; // usuwamy database dla SQLite
      delete config.host;
      delete config.port;
      delete config.username;
      delete config.password;
      console.log('✅ SQLite connection configured');
    }
  } catch (err) {
    console.error('❌ Error parsing DATABASE_URL:', err);
    console.log('🔄 Falling back to SQLite...');
    config.dialect = 'sqlite';
    config.storage = './database.sqlite';
  }
} else {
  // ── fallback dla SQLite (development)
  console.log('🔄 Using SQLite for development');
  config.storage = './database.sqlite';
}

console.log('🔧 Creating Sequelize instance...');
console.log('📋 Final config:', {
  dialect: config.dialect,
  host: config.host,
  port: config.port,
  database: config.database,
  storage: config.storage,
  hasSSL: !!config.dialectOptions?.ssl
});

console.log('💾 Database file path:', config.storage || config.database);

export const db = new Sequelize(config);

// ── test połączenia z lepszym logowaniem
db.authenticate()
  .then(() => {
    console.log('✅ Database connection successful');
  })
  .catch(err => {
    console.error('❌ Database connection failed:');
    console.error('  Error message:', err.message);
    console.error('  Error code:', err.code);
    console.error('  Error details:', err);
    
    // Dodatkowe informacje diagnostyczne
    if (err.code === 'ECONNREFUSED') {
      console.error('  🔍 Connection refused - check if database server is running');
    } else if (err.code === 'ENOTFOUND') {
      console.error('  🔍 Host not found - check DATABASE_URL hostname');
    } else if (err.message.includes('password authentication failed')) {
      console.error('  🔍 Authentication failed - check username/password in DATABASE_URL');
    } else if (err.message.includes('database') && err.message.includes('does not exist')) {
      console.error('  🔍 Database does not exist - check database name in DATABASE_URL');
    }
  });
