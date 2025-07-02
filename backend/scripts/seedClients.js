const { Client } = require('../models/Client.js');
const { db } = require('../db.js');
require('../models/index.js');

await db.sync();

const client = await Client.create({
  name: 'Jan Kowalski',
  email: 'vikbobinski@gmail.com',
  address: 'ul. Przykładowa 12, 00-001 Warszawa',
  rent: 1200 // ← DODAJ TO (albo inna domyślna kwota)
});

console.log('✅ Client seeded:', client.id);
process.exit(0);
