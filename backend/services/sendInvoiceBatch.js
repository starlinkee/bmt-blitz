import { Client } from '../models/Client.js';
import { InvoiceBatch } from '../models/InvoiceBatch.js';
import { generateInvoicePDF } from './generateInvoicePDF.js';
import { sendInvoiceEmail } from './sendInvoice.js';

export async function sendMonthlyInvoices() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const monthKey = `${year}-${month}`; // np. 2025-06

  // 🔎 Sprawdź, czy już wysłano faktury za ten miesiąc
  const existingBatch = await InvoiceBatch.findOne({
    where: { month: monthKey }
  });

  if (existingBatch) {
    return { success: false, message: `Faktury za ${monthKey} już zostały wysłane.` };
  }

  // 📤 Pobierz klientów
  const clients = await Client.findAll();
  if (clients.length === 0) {
    return { success: false, message: 'Brak klientów do fakturowania.' };
  }

  for (const [index, client] of clients.entries()) {
    const invoiceNumber = `${year}-${month}-${String(index + 1).padStart(3, '0')}`;
    
    // Konwertuj rent ze stringa na liczbę (Sequelize DECIMAL zwraca string)
    const rentAmount = parseFloat(client.rent);

    const invoiceData = {
      invoiceNumber,
      issueDate: now.toISOString().slice(0, 10),
      dueDate: `${year}-${month}-20`,
      period: monthKey,
      clientName: client.name,
      clientCompany: client.name, // możesz rozdzielić jeśli masz firmę osobno
      clientAddress: client.address,
      sellerName: 'Jerzy Bobiński',
      sellerAddress: 'ul. Jana Pawła II 66 lok. 2, 47-232 Kędzierzyn-Koźle',
      sellerNIP: '7491021184',
      description: `Opłata za wynajem lokalu – ${monthKey}`,
      itemDescription: `Czynsz – ${monthKey}`,
      quantity: '1',
      unit: 'm-c',
      unitPrice: rentAmount.toFixed(2),
      totalNet: rentAmount.toFixed(2),
      totalGross: rentAmount.toFixed(2),
      amountInWords: toWords(rentAmount),
      bankAccount: '22 1240 1659 1111 0010 2591 2002',
      placeOfIssue: 'Kędzierzyn-Koźle'
    };

    const pdfPath = await generateInvoicePDF(invoiceData);
    await sendInvoiceEmail(client.email, pdfPath);
  }

  // ✅ Zapisz log wysyłki
  await InvoiceBatch.create({
    month: monthKey,
    sent_at: new Date()
  });

  return { success: true, message: `Faktury za ${monthKey} zostały pomyślnie wysłane.` };
}

// Pomocnicza funkcja – zamień liczbę na słownie
function toWords(value) {
  const [zł, gr] = value.toFixed(2).split('.');
  return `słownie: ${parseInt(zł)} zł ${gr}/100`; // Możesz użyć biblioteki pełnej np. 'slownie'
}
