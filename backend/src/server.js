import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { db as sequelize } from '../db.js'; // zmieniono na alias zgodny z index.js
import {
  User, Client, Invoice, InvoiceBatch, InvoiceSettings,
  MediaType, MediaTemplate, MediaRecord, MediaVariable, MediaAttachment
} from '../models/index.js'; // wymuszenie załadowania modeli i relacji

import { sessionMiddleware } from './session.js';
import { authRouter, authRequired } from './routes/auth.js';
import { invoiceRouter } from './routes/invoices.js';
import mediaRouter from './routes/media.js';

const app = express();

console.log('🚀 Starting server...');

// ── CORS ──────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost',
  'http://localhost:5173',
  'http://bmt.googlenfc.smallhost.pl',
  'https://bmt.googlenfc.smallhost.pl'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ── Middleware ────────────────────────────────────────────────
app.use(express.json());
app.use(sessionMiddleware);

console.log('✅ Middleware configured');

// ── API endpoints ─────────────────────────────────────────────
app.use('/auth', authRouter);
app.use('/invoices', invoiceRouter);
app.use('/media', mediaRouter);

console.log('✅ Routes configured');

// ── Testowe endpointy ─────────────────────────────────────────
app.get('/health', (_, res) => res.send('OK'));
app.get('/secret', authRequired, (_, res) => res.send('Only admin!'));

// ── Init DB + Start server ────────────────────────────────────
const init = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false }); // bezpieczne - nie zmienia struktury
    console.log('✅ DB connected & synced');

    const PORT = process.env.PORT || 3000;

    // Jeśli uruchamiasz przez Passenger, NIE rób listen()
    if (process.env.NODE_ENV === 'production' && process.env.PASSENGER_APP_ENV) {
      console.log('✅ Running under Passenger – Express handler ready');
    } else {
      app.listen(PORT, () => console.log(`🚀 Server running on :${PORT}`));
    }
  } catch (err) {
    console.error('❌ DB error:', err);
    process.exit(1);
  }
};

init();

// 🟡 Export handler do Passenger
export default app;
