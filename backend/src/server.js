import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { db } from '../db.js';
import '../models/index.js';
import { sessionMiddleware } from './session.js';
import { authRouter, authRequired } from './routes/auth.js';
import { invoiceRouter } from './routes/invoices.js';

const app = express();

// ── CORS (dostosuj jeśli potrzeba) ───────────────────────────
const allowedOrigins = [
  'http://localhost:5173',  // dev local
  'http://bmt.googlenfc.smallhost.pl:5173',  // production frontend
  'https://bmt.googlenfc.smallhost.pl:5173'  // production frontend (HTTPS)
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

// ── API endpoints ─────────────────────────────────────────────
app.use('/auth', authRouter);
app.use('/invoices', invoiceRouter);

// ── Serwowanie frontendu z Reacta ─────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendPath = path.resolve(__dirname, '../../frontend/dist');
app.use(express.static(frontendPath));

// ── Fallback SPA (dla React Router) – musi być NA KOŃCU ──────
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ── Testowe endpointy ─────────────────────────────────────────
app.get('/health', (_, res) => res.send('OK'));
app.get('/secret', authRequired, (_, res) => res.send('Only admin!'));

// ── Init DB + Start server ────────────────────────────────────
(async () => {
  try {
    await db.authenticate();
    await db.sync();
    console.log('DB connected & synced');

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on :${PORT}`));
  } catch (err) {
    console.error('DB error:', err);
    process.exit(1);
  }
})();
