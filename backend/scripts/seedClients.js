import { Client } from '../models/Client.js';
import { db } from '../db.js';
import '../models/index.js';

await db.sync();

const client = await Client.create({
  name: 'Jan Kowalski',
  email: 'jan@example.com',
  address: 'ul. Przykładowa 12, 00-001 Warszawa',
  rent: 1200 // ← DODAJ TO (albo inna domyślna kwota)
});

console.log('✅ Client seeded:', client.id);
process.exit(0);
