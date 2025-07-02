import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

console.log('🚀 Starting server initialization...');
console.log('📋 Environment variables:');
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  PASSENGER_APP_ENV:', process.env.PASSENGER_APP_ENV);
console.log('  PORT:', process.env.PORT);
console.log('  DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('  SESSION_SECRET exists:', !!process.env.SESSION_SECRET);

import { db as sequelize } from '../db.js'; // zmieniono na alias zgodny z index.js
import {
  User, Client, Invoice, InvoiceBatch, InvoiceSettings,
  MediaType, MediaTemplate, MediaRecord, MediaVariable, MediaAttachment
} from '../models/index.js'; // wymuszenie załadowania modeli i relacji

console.log('Models imported successfully');

import { sessionMiddleware } from './session.js';
import { authRouter, authRequired } from './routes/auth.js';
import { invoiceRouter } from './routes/invoices.js';
import mediaRouter from './routes/media.js';

console.log('Routes imported successfully');

const app = express();

console.log('Express app created');

// ── Endpoint testowy (działa przed wszystkimi middleware) ──────────────────
app.get('/ping', (_, res) => {
  console.log('🏓 Ping endpoint hit');
  res.send('pong');
});

// ── CORS ──────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost',
  'http://localhost:5173',
  'http://bmt.googlenfc.smallhost.pl',
  'https://bmt.googlenfc.smallhost.pl'
];

console.log('Setting up CORS with origins:', allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    console.log('🌍 CORS request from origin:', origin);
    
    // Pozwól na żądania bez origin (np. Postman, curl)
    if (!origin) {
      console.log('✅ Allowing request without origin');
      return callback(null, true);
    }
    
    // Sprawdź czy origin jest na liście dozwolonych
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('✅ Origin allowed:', origin);
      return callback(null, true);
    }
    
    console.log('⚠️  Origin not in allowed list:', origin);
    console.log('✅ Allowing anyway (temporary)');
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

console.log('CORS configured');

// ── Middleware ────────────────────────────────────────────────
console.log('Setting up middleware...');
app.use(express.json());
console.log('JSON middleware added');

// Dodaj middleware do logowania wszystkich żądań
app.use((req, res, next) => {
  try {
    console.log('🌐 HTTP Request:', req.method, req.url);
    console.log('📅 Timestamp:', new Date().toISOString());
    console.log('🌍 Origin:', req.headers.origin || 'none');
    console.log('🍪 Cookies:', req.headers.cookie ? 'present' : 'none');
    console.log('👤 User-Agent:', req.headers['user-agent']?.substring(0, 50) || 'none');
    console.log('---');
    next();
  } catch (error) {
    console.error('❌ Middleware error:', error);
    next();
  }
});

// Dodaj middleware do obsługi błędów
app.use((error, req, res, next) => {
  console.error('❌ Global error handler:', error);
  console.error('📋 Request details:', {
    method: req.method,
    url: req.url,
    headers: req.headers
  });
  
  if (!res.headersSent) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

console.log('Adding session middleware...');
app.use(sessionMiddleware);
console.log('Session middleware added');

console.log('Middleware configured');

// ── API endpoints ─────────────────────────────────────────────
console.log('Setting up routes...');
app.use('/auth', authRouter);
app.use('/invoices', invoiceRouter);
app.use('/media', mediaRouter);

console.log('Routes configured');

// ── Testowe endpointy (działają bez bazy danych) ─────────────────────────
app.get('/health', (_, res) => {
  console.log('🏥 Health check requested');
  res.send('OK');
});

app.get('/test', (_, res) => {
  console.log('🧪 Test endpoint requested');
  res.json({ 
    status: 'OK', 
    message: 'Aplikacja działa!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    passenger: !!process.env.PASSENGER_APP_ENV
  });
});

app.get('/debug', (_, res) => {
  console.log('🐛 Debug endpoint requested');
  res.json({
    nodeEnv: process.env.NODE_ENV,
    passengerAppEnv: process.env.PASSENGER_APP_ENV,
    passengerVersion: process.env.PHUSION_PASSENGER_VERSION,
    port: process.env.PORT,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasSessionSecret: !!process.env.SESSION_SECRET,
    timestamp: new Date().toISOString()
  });
});

app.get('/secret', authRequired, (_, res) => {
  console.log('🔒 Secret endpoint accessed');
  res.send('Only admin!');
});

console.log('✅ Test endpoints configured');

// ── Init DB + Start server ────────────────────────────────────
const init = async () => {
  try {
    console.log('🔄 Starting database initialization...');
    await sequelize.authenticate();
    console.log('✅ Database authenticated');
    
    await sequelize.sync({ force: false }); // bezpieczne - nie zmienia struktury
    console.log('✅ Database synced');

    const PORT = process.env.PORT || 3000;
    console.log('🌐 Port configuration:', PORT);

    // Sprawdzanie czy działamy pod Passenger
    const isPassenger = process.env.PASSENGER_APP_ENV || 
                       process.env.NODE_ENV === 'production' && 
                       process.env.PHUSION_PASSENGER_VERSION;
    
    console.log('🚌 Passenger detection:');
    console.log('  PASSENGER_APP_ENV:', process.env.PASSENGER_APP_ENV);
    console.log('  PHUSION_PASSENGER_VERSION:', process.env.PHUSION_PASSENGER_VERSION);
    console.log('  Is Passenger detected:', isPassenger);

    if (isPassenger) {
      console.log('✅ Running under Passenger – Express handler ready');
      console.log('📝 App exported for Passenger');
      console.log('🚀 Application is ready to handle requests');
    } else {
      console.log('🖥️  Running standalone - starting server...');
      console.log('✅ App ready for Passenger (no listen needed)');
    }
    
    // Dodatkowe sprawdzenie czy aplikacja jest gotowa
    console.log('🎯 Application initialization completed');
    console.log('📊 Available endpoints:');
    console.log('  - GET /health (health check)');
    console.log('  - GET /test (test endpoint)');
    console.log('  - GET /debug (debug info)');
    console.log('  - POST /auth/login (login)');
    console.log('  - GET /invoices (invoices)');
    console.log('  - GET /media (media)');
  } catch (err) {
    console.error('❌ DB error:', err);
    console.error('🔍 Error details:', {
      message: err.message,
      stack: err.stack,
      code: err.code
    });
    process.exit(1);
  }
};

console.log('🚀 Starting initialization...');
init();

// 🟡 Export handler do Passenger
console.log('📤 Exporting app for Passenger');
console.log('📋 App export details:');
console.log('  - App type:', typeof app);
console.log('  - App.use exists:', !!app.use);
console.log('  - App.get exists:', !!app.get);
console.log('  - App.listen exists:', !!app.listen);
console.log('  - App._router exists:', !!app._router);

// Dodaj sprawdzenie czy aplikacja jest gotowa
if (typeof app === 'function' && app.use && app.get) {
  console.log('✅ App is properly configured Express application');
} else {
  console.log('❌ App is not properly configured Express application');
}

export default app;
