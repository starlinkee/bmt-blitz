// backend/src/server.js
import express from 'express';
import cors from 'cors';
import { db }          from '../db.js';
import '../models/index.js';               // rejestruje modele
import { sessionMiddleware } from './session.js';
import { authRouter, authRequired } from './routes/auth.js';
import { invoiceRouter } from './routes/invoices.js';

const app = express();

// Dynamiczny origin w zależności od środowiska
const allowedOrigins = [
  'http://localhost:5173',  // dev local
  'http://bmt.googlenfc.smallhost.pl:5173',  // production frontend
  'https://bmt.googlenfc.smallhost.pl:5173'  // production frontend (HTTPS)
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


// ── globalne middleware ──────────────────────────────────────
app.use(express.json());
app.use(sessionMiddleware);

// ── routy ─────────────────────────────────────────────────────
app.use('/auth', authRouter);
app.use('/invoices', invoiceRouter);

app.get('/health', (_, res) => res.send('OK'));          // publiczne
app.get('/secret', authRequired, (_, res) => res.send('Only admin!')); // chronione

// ── start + init DB ──────────────────────────────────────────
(async () => {
  try {
    await db.authenticate();
    await db.sync();                 // CREATE tabel, jeśli brak
    console.log('DB connected & synced');

    const PORT = process.env.PORT || 3000;   // Passenger ustawi PORT
    app.listen(PORT, () => console.log(`Server running on :${PORT}`));
  } catch (err) {
    console.error('DB error:', err);
    process.exit(1);
  }
})();