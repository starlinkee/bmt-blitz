// db.js
import { Sequelize } from 'sequelize';
// import dotenv from 'dotenv'; // usunięte - już załadowane w app.js
import path from 'path';
import { fileURLToPath } from 'url';

// ── ustalamy katalog bieżącego pliku
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── ładujemy .env z katalogu backend
// dotenv.config({ path: path.join(__dirname, '.env') }); // usunięte - już załadowane w app.js

console.log('Database configuration:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('DIALECT:', process.env.DIALECT || 'postgres');

// ── logowanie DATABASE_URL (bez hasła)
if (process.env.DATABASE_URL) {
  const urlParts = process.env.DATABASE_URL.split('@');
  if (urlParts.length === 2) {
    const hostPart = urlParts[1];
    console.log('DATABASE_URL host part:', hostPart);
  }
  
  // ── tymczasowe logowanie hasła (do debugowania)
  try {
    const url = new URL(process.env.DATABASE_URL);
    console.log('Parsed username:', url.username);
    console.log('Parsed password length:', url.password ? url.password.length : 0);
    console.log('Parsed password first char:', url.password ? url.password[0] : 'none');
    console.log('Parsed password last char:', url.password ? url.password[url.password.length - 1] : 'none');
  } catch (err) {
    console.log('Error parsing DATABASE_URL:', err.message);
  }
}

// ── konfiguracja bazy danych
const config = {
  dialect: process.env.DIALECT || 'postgres',
  logging: (msg) => console.log('DB Query:', msg), // logowanie zapytań SQL
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

// ── jeśli mamy DATABASE_URL, parsuj go i ustaw explicitne parametry
if (process.env.DATABASE_URL) {
  console.log('Parsing DATABASE_URL...');
  
  // ── parsuj DATABASE_URL
  const url = new URL(process.env.DATABASE_URL);
  
  config.host = url.hostname;
  config.port = url.port;
  config.database = url.pathname.substring(1); // usuń pierwszy /
  config.username = url.username;
  config.password = url.password;
  
  console.log('Parsed connection params:', {
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
    console.log('PostgreSQL connection WITHOUT SSL (server does not support SSL)');
  } else if (process.env.DATABASE_URL.includes('sqlite')) {
    // ── dla SQLite używamy storage zamiast database
    config.dialect = 'sqlite';
    config.storage = config.database; // używamy ścieżki jako storage
    delete config.database; // usuwamy database dla SQLite
    delete config.host;
    delete config.port;
    delete config.username;
    delete config.password;
    console.log('SQLite connection configured');
  }
} else {
  // ── fallback dla SQLite (development)
  console.log('Using SQLite for development');
  config.storage = './database.sqlite';
}

console.log('Creating Sequelize instance...');
console.log('Final config:', {
  dialect: config.dialect,
  host: config.host,
  port: config.port,
  database: config.database,
  hasSSL: !!config.dialectOptions?.ssl
});

console.log('Ścieżka do pliku bazy:', config.storage || config.database);

export const db = new Sequelize(config);

// ── test połączenia - usunięte, bo może powodować zawieszenie podczas importu
// db.authenticate()
//   .then(() => {
//     console.log('Database connection successful');
//   })
//   .catch(err => {
//     console.error('Database connection failed:', err);
//   });
