// db.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Załaduj .env z odpowiedniej lokalizacji
const envPath = path.join(__dirname, '.env');
dotenv.config({ path: envPath });

// Automatyczne wykrycie typu bazy na podstawie DATABASE_URL
const dialect = process.env.DATABASE_URL.includes('sqlite') ? 'sqlite' :
                process.env.DATABASE_URL.includes('postgres') ? 'postgres' :
                process.env.DIALECT || 'sqlite';

export const db = new Sequelize(process.env.DATABASE_URL, {
  dialect,
  logging: false
});
