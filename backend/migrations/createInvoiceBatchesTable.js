import { db } from '../db.js';

const createInvoiceBatchesTable = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS invoice_batches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        month TEXT NOT NULL UNIQUE,
        sent_at TEXT NOT NULL
      );
    `);
    console.log('Tabela invoice_batches utworzona (jeśli nie istniała).');
  } catch (error) {
    console.error('Błąd przy tworzeniu tabeli:', error);
  } finally {
    await db.close();
  }
};

createInvoiceBatchesTable();
