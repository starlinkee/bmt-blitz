import session from 'express-session';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });     // ważne: absolutny pathd

export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'change-me',
  resave: false,
  saveUninitialized: false,
  cookie: { sameSite: 'lax' }
});
