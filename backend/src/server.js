import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { db } from '../db.js';
import '../models/index.js'; // rejestruje modele
import { sessionMiddleware } from './session.js';
import { authRouter, authRequired } from './routes/auth.js';
import { invoiceRouter } from './routes/invoices.js';

const app = express();

// Dynamiczny origin w zależności od środowiska
const allowedOrigins = [
  'http://localhost:5173',  // dev local
  'http://bmt.googlenfc.smallhost.pl',        // production frontend
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

// ── globalne middleware ──────────────────────────────────────
app.use(express.json());
app.use(sessionMiddleware);

// ── routy API ─────────────────────────────────────────────────
app.use('/auth', authRouter);
app.use('/invoices', invoiceRouter);

// ── frontend ──────────────────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendPath = path.resolve(__dirname, '../../frontend/dist');

app.use(express.static(frontendPath));

// React SPA fallback – zwracaj index.html dla każdej innej ścieżki
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ── start + init DB ───────────────────────────────────────────
(async () => {
  try {
    await db.authenticate();
    await db.sync();
    console.log('DB connected & synced');

    const PORT = process.env.PORT || 3000; // Passenger ustawi PORT
    app.listen(PORT, () => console.log(`Server running on :${PORT}`));
  } catch (err) {
    console.error('DB error:', err);
    process.exit(1);
  }
})();
