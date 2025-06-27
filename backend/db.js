import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// wczytaj zmienne z pliku .env (DATABASE_URL)ddd
dotenv.config();

export const db = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,        
});

