import { db } from '../db.js';

const createInvoiceSettingsTable = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS invoice_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        seller_name TEXT NOT NULL,
        seller_address_line1 TEXT NOT NULL,
        seller_address_line2 TEXT,
        seller_nip TEXT,
        default_place_of_issue TEXT,
        default_due_in_days INTEGER DEFAULT 10,
        bank_account TEXT NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tabela invoice_settings utworzona (jeśli nie istniała).');
  } catch (error) {
    console.error('Błąd przy tworzeniu tabeli:', error);
  } finally {
    await db.close();
  }
};

createInvoiceSettingsTable(); 