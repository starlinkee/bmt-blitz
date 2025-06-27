// backend/src/server.js
import express from 'express';
import { db } from '../db.js';          // instancja Sequelize
import '../models/index.js';           // rejestruje User, Client, Invoice

const app = express();

// ---------- middleware ----------
app.use(express.json());               // body parser JSON

// ---------- routy testowe ----------
app.get('/health', (_, res) => res.send('OK'));

// ---------- start + init DB ----------
(async () => {
  try {
    await db.authenticate();           // test połączenia
    await db.sync();                   // jeśli tabel brak → CREATE
    console.log('DB connected & synced');

    const PORT = process.env.PORT || 3000;   // Passenger ustawia PORT
    app.listen(PORT, () => console.log(`Server running on :${PORT}`));
  } catch (err) {
    console.error('DB error:', err);
    process.exit(1);
  }
})();
