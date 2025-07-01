// db.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ── ustalamy katalog bieżącego pliku
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── ładujemy .env z katalogu backend
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('Database configuration:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('DIALECT:', process.env.DIALECT || 'postgres');

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

// ── jeśli mamy DATABASE_URL, używamy go
if (process.env.DATABASE_URL) {
  console.log('Using DATABASE_URL for connection');
  
  // ── sprawdź czy to PostgreSQL
  if (process.env.DATABASE_URL.includes('postgres')) {
    config.dialect = 'postgres';
    config.dialectOptions = {
      ssl: { rejectUnauthorized: false }
    };
    console.log('PostgreSQL connection with SSL');
    
    // ── użyj DATABASE_URL bezpośrednio
    config.url = process.env.DATABASE_URL;
  }
} else {
  // ── fallback dla SQLite (development)
  console.log('Using SQLite for development');
  config.storage = './database.sqlite';
}

console.log('Creating Sequelize instance...');

export const db = new Sequelize(config);

// ── test połączenia
db.authenticate()
  .then(() => {
    console.log('Database connection successful');
  })
  .catch(err => {
    console.error('Database connection failed:', err);
  });
