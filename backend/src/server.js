// backend/src/server.js
import express from 'express';
import { db }          from '../db.js';
import '../models/index.js';               // rejestruje modele
import { sessionMiddleware } from './session.js';
import { authRouter, authRequired } from './routes/auth.js';

const app = express();

// ── globalne middleware ──────────────────────────────────────
app.use(express.json());
app.use(sessionMiddleware);

// ── routy ─────────────────────────────────────────────────────
app.use('/auth', authRouter);

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
