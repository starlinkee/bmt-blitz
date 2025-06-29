// scripts/seedInvoices.js

import { Invoice } from '../models/Invoice.js';
import { Client } from '../models/Client.js';
import { db } from '../db.js';
import '../models/index.js';

try {
  await db.sync();

  // Znajdź pierwszego klienta
  const client = await Client.findOne();
  if (!client) throw new Error('Brak klientów w bazie danych');

  // Dodaj przykładowe faktury powiązane z klientem
  await Invoice.bulkCreate([
    {
      clientId: client.id,
      number: '2025-05-001',
      type: 'RENT',
      periodStart: new Date('2025-05-01'),
      periodEnd: new Date('2025-05-31'),
      netAmount: 1200,
      vatRate: 23,
      grossAmount: 1476,
      pdfPath: 'invoices/2025-05-001.pdf',
      sentAt: new Date('2025-06-01')
    },
    {
      clientId: client.id,
      number: '2025-05-002',
      type: 'MEDIA',
      periodStart: new Date('2025-05-01'),
      periodEnd: new Date('2025-05-31'),
      netAmount: 340,
      vatRate: 8,
      grossAmount: 367.2,
      pdfPath: 'invoices/2025-05-002.pdf',
      sentAt: new Date('2025-06-01')
    }
  ]);

  console.log('✅ Faktury zostały dodane');
  process.exit(0);
} catch (err) {
  console.error('❌ Błąd podczas dodawania faktur:', err);
  process.exit(1);
}
