import { Client } from '../models/Client.js';
import { InvoiceBatch } from '../models/InvoiceBatch.js';
import { generateInvoicePDF } from './generateInvoicePDF.js';
import { sendInvoiceEmail } from './sendInvoice.js';
import { getInvoiceSettings } from './db/invoiceSettings.js';
import slownie from 'slownie';

export async function sendMonthlyInvoices() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const monthKey = `${year}-${month}`; // np. 2025-06

  const existingBatch = await InvoiceBatch.findOne({ where: { month: monthKey } });
  if (existingBatch) {
    return { success: false, message: `Faktury za ${monthKey} już zostały wysłane.` };
  }

  const clients = await Client.findAll();
  if (clients.length === 0) {
    return { success: false, message: 'Brak klientów do fakturowania.' };
  }

  const settings = await getInvoiceSettings();
  if (!settings) {
    return { success: false, message: 'Brak konfiguracji sprzedawcy w bazie danych.' };
  }

  for (const [index, client] of clients.entries()) {
    const invoiceNumber = `${year}/${month}/${String(index + 1).padStart(3, '0')}`;
    const issueDate = now.toISOString().split('T')[0];

    // Oblicz termin płatności na podstawie ustawień
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + settings.default_due_in_days);
    const formattedDueDate = dueDate.toISOString().split('T')[0];

    const rentAmount = parseFloat(client.rent);

    const invoiceData = {
      invoiceNumber,
      issueDate,
      period: monthKey,

      client: {
        companyName: client.name,
        addressLine1: client.address,
        addressLine2: '', // jeśli masz dodatkową linię
        nip: client.nip || '' // jeśli masz
      },

      description: `Opłaty wynikające z umowy najmu z dnia 22.09.2014r w lokalu użytkowym przy al. Jana Pawła II 66/2 w Kędzierzynie-Koźlu, zgodnie z załączonym rozliczeniem, w miesiącu ${getPolishMonthName(month)} ${year}`,

      item: {
        description: `Czynsz – ${monthKey}`,
        quantity: 1,
        unit: 'm-c',
        unitPrice: rentAmount,
        total: rentAmount
      }
    };

    const pdfPath = await generateInvoicePDF(invoiceData);
    await sendInvoiceEmail(client.email, pdfPath);
  }

  await InvoiceBatch.create({
    month: monthKey,
    sent_at: new Date()
  });

  return { success: true, message: `Faktury za ${monthKey} zostały pomyślnie wysłane.` };
}

// pomocnicza
function getPolishMonthName(month) {
  const months = [
    '', 'styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec',
    'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień'
  ];
  return months[parseInt(month, 10)];
}
