import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

console.log('🚀 Starting server initialization...');

console.log('📦 Importing database...');
import { db as sequelize } from '../db.js'; // zmieniono na alias zgodny z index.js
console.log('✅ Database imported');

console.log('📦 Importing models...');
import {
  User, Client, Invoice, InvoiceBatch, InvoiceSettings,
  MediaType, MediaTemplate, MediaRecord, MediaVariable, MediaAttachment
} from '../models/index.js'; // wymuszenie załadowania modeli i relacji
console.log('✅ Models imported successfully');

console.log('📦 Importing session middleware...');
import { sessionMiddleware } from './session.js';
console.log('✅ Session middleware imported');

console.log('📦 Importing routes...');
import { authRouter, authRequired } from './routes/auth.js';
import { invoiceRouter } from './routes/invoices.js';
import mediaRouter from './routes/media.js';
console.log('✅ Routes imported successfully');

console.log('🏗️ Creating Express app...');
const app = express();
console.log('✅ Express app created');

// ── CORS ──────────────────────────────────────────────────────
console.log('🌐 Setting up CORS...');
const allowedOrigins = [
  'http://localhost',
  'http://localhost:5173',
  'http://bmt.googlenfc.smallhost.pl',
  'https://bmt.googlenfc.smallhost.pl'
];

console.log('Setting up CORS with origins:', allowedOrigins);

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

console.log('✅ CORS configured');

// ── Middleware ────────────────────────────────────────────────
console.log('🔧 Setting up middleware...');
app.use(express.json());
console.log('✅ JSON middleware added');

// Dodaj middleware do logowania wszystkich żądań
app.use((req, res, next) => {
  console.log('🌐 HTTP Request:', req.method, req.url);
  console.log('📅 Timestamp:', new Date().toISOString());
  console.log('🌍 Origin:', req.headers.origin);
  console.log('🍪 Cookies:', req.headers.cookie);
  console.log('---');
  next();
});

console.log('🔧 Adding session middleware...');
app.use(sessionMiddleware);
console.log('✅ Session middleware added');

console.log('✅ All middleware configured');

// ── Testowe endpointy (PRZED routami API) ───────────────────────────────
app.get('/health', (_, res) => {
  console.log('🏥 Health check requested');
  res.send('OK');
});

app.get('/secret', authRequired, (_, res) => {
  console.log('🔒 Secret endpoint accessed');
  res.send('Only admin!');
});

console.log('✅ Test endpoints configured');

// ── API endpoints ─────────────────────────────────────────────
console.log('🛣️ Setting up routes...');
app.use('/auth', authRouter);
app.use('/invoices', invoiceRouter);
app.use('/media', mediaRouter);

console.log('✅ Routes configured');

// ── Init DB + Start server ────────────────────────────────────
const init = async () => {
  try {
    console.log('🗄️ Starting database initialization...');
    await sequelize.authenticate();
    console.log('✅ Database authenticated');
    
    await sequelize.sync({ force: false }); // bezpieczne - nie zmienia struktury
    console.log('✅ Database synced');

    const PORT = process.env.PORT || 3000;

    // Jeśli uruchamiasz przez Passenger, NIE rób listen()
    if (process.env.NODE_ENV === 'production' && process.env.PASSENGER_APP_ENV) {
      console.log('🚀 Running under Passenger – Express handler ready');
    } else {
      app.listen(PORT, () => console.log(`🚀 Server running on :${PORT}`));
    }
  } catch (err) {
    console.error('❌ DB error:', err);
    process.exit(1);
  }
};

console.log('🚀 Starting initialization...');

// W produkcji z Passenger NIE uruchamiaj init() automatycznie
// Passenger sam obsłuży inicjalizację
if (process.env.NODE_ENV === 'production' && process.env.PASSENGER_APP_ENV) {
  console.log('🚀 Production mode with Passenger - skipping automatic init()');
  console.log('🚀 Passenger will handle initialization');
} else {
  console.log('🚀 Development mode - running init()');
  init();
}

console.log('✅ Server initialization complete');

// 🟡 Export handler do Passenger
export default app;
