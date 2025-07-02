const { db } = require('../db.js');
const { Client } = require('../models/Client.js');

(async () => {
  try {
    const client = await Client.findOne({ where: { name: 'Jan Kowalski' } });
    if (!client) {
      console.log('Nie znaleziono klienta.');
      process.exit(1);
    }

    client.email = 'vikbobinski@gmail.com';
    await client.save();

    console.log('Email zaktualizowany pomyślnie.');
  } catch (err) {
    console.error('Błąd podczas aktualizacji:', err);
  } finally {
    await db.close();
  }
})();
