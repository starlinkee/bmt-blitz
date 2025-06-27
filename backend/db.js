// backend/db.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ──────────────────────────────────────────────────────────────
// 1. Ustal katalog pliku db.js  →  …/public_nodejs/backend
//    (__dirname nie istnieje w ES-modules, trzeba wyliczyć)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 2. Załaduj .env z tego katalogu
const envPath = path.join(__dirname, '.env');
dotenv.config({ path: envPath });

// 3. Utwórz instancję Sequelize
export const db = new Sequelize(process.env.DATABASE_URL, {
  dialect : process.env.DIALECT || 'postgres', // 'sqlite' w dev, 'postgres' w prod
  logging : false
});
