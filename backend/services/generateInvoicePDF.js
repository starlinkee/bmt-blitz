const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { getInvoiceSettings } = require('./db/invoiceSettings.js');
const slownieModule = require('slownie');

const slownie = (value) => new slownieModule.Slownie(value).get(value);

async function generateInvoicePDF(invoiceData) {
  const settings = await getInvoiceSettings();
  if (!settings) throw new Error('Brak ustawień faktury w bazie danych');

  const outputDir = path.resolve(__dirname, '../generated', invoiceData.period || 'brak-okresu');
  await fs.mkdir(outputDir, { recursive: true });

  const safeFilename = `rachunek_${invoiceData.invoiceNumber.replaceAll('/', '-')}.pdf`;
  const filePath = path.join(outputDir, safeFilename);

  const doc = new PDFDocument({ 
    margin: 40,
    size: 'A4'
  });

  const stream = fsSync.createWriteStream(filePath);
  doc.pipe(stream);

  const fontPath = path.join(__dirname, '../assets/fonts/DejaVuSans.ttf');
  const fontBoldPath = path.join(__dirname, '../assets/fonts/DejaVuSans-Bold.ttf');
  
  doc.registerFont('DejaVu', fontPath);
  if (fsSync.existsSync(fontBoldPath)) {
    doc.registerFont('DejaVu-Bold', fontBoldPath);
  }

  // Kolory
  const primaryColor = '#2563eb';
  const secondaryColor = '#64748b';
  const accentColor = '#f1f5f9';
  const textColor = '#1e293b';

  const issueDate = new Date(invoiceData.issueDate);
  const dueDate = new Date(issueDate);
  dueDate.setDate(dueDate.getDate() + settings.default_due_in_days);

  const formatDate = (d) => d.toLocaleDateString('pl-PL');
  const formatCurrency = (amount) => new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN'
  }).format(amount);

  // Nagłówek z kolorowym tłem
  doc.rect(0, 0, doc.page.width, 80).fill(primaryColor);
  
  // Tytuł faktury
  doc.fillColor('white')
     .font(fsSync.existsSync(fontBoldPath) ? 'DejaVu-Bold' : 'DejaVu')
     .fontSize(24)
     .text('RACHUNEK', 50, 25);
  
  doc.fontSize(16)
     .text(`Nr ${invoiceData.invoiceNumber}`, 50, 50);

  // Reset pozycji po nagłówku
  doc.y = 100;

  // Sekcja z datami - w ramce
  const dateBoxY = doc.y;
  doc.rect(50, dateBoxY, doc.page.width - 100, 60)
     .fill(accentColor)
     .stroke('#e2e8f0');

  doc.fillColor(textColor)
     .font('DejaVu')
     .fontSize(11);

  const leftCol = 70;
  const rightCol = 350;

  doc.text('Data wystawienia:', leftCol, dateBoxY + 15);
  doc.text(formatDate(issueDate), leftCol + 100, dateBoxY + 15);

  doc.text('Termin płatności:', leftCol, dateBoxY + 35);
  doc.text(formatDate(dueDate), leftCol + 100, dateBoxY + 35);

  doc.text('Miejsce wystawienia:', rightCol, dateBoxY + 15);
  doc.text(settings.default_place_of_issue, rightCol + 120, dateBoxY + 15);

  doc.y = dateBoxY + 80;

  // Sekcja Nabywca i Sprzedawca
  const sectionY = doc.y;
  const sectionHeight = 120;

  // Nabywca
  doc.rect(50, sectionY, (doc.page.width - 120) / 2, sectionHeight)
     .stroke('#e2e8f0');

  doc.fillColor(primaryColor)
     .font(fsSync.existsSync(fontBoldPath) ? 'DejaVu-Bold' : 'DejaVu')
     .fontSize(12)
     .text('NABYWCA', 60, sectionY + 10);

  doc.fillColor(textColor)
     .font('DejaVu')
     .fontSize(10);

  let yPos = sectionY + 30;
  doc.text(invoiceData.client.companyName, 60, yPos);
  yPos += 15;
  doc.text(invoiceData.client.addressLine1, 60, yPos);
  yPos += 15;
  doc.text(invoiceData.client.addressLine2, 60, yPos);
  if (invoiceData.client.nip) {
    yPos += 15;
    doc.text(`NIP: ${invoiceData.client.nip}`, 60, yPos);
  }

  // Sprzedawca
  const sellerX = 50 + (doc.page.width - 120) / 2 + 10;
  doc.rect(sellerX, sectionY, (doc.page.width - 120) / 2, sectionHeight)
     .stroke('#e2e8f0');

  doc.fillColor(primaryColor)
     .font(fsSync.existsSync(fontBoldPath) ? 'DejaVu-Bold' : 'DejaVu')
     .fontSize(12)
     .text('SPRZEDAWCA', sellerX + 10, sectionY + 10);

  doc.fillColor(textColor)
     .font('DejaVu')
     .fontSize(10);

  yPos = sectionY + 30;
  doc.text(settings.seller_name, sellerX + 10, yPos);
  yPos += 15;
  doc.text(settings.seller_address_line1, sellerX + 10, yPos);
  yPos += 15;
  doc.text(settings.seller_address_line2, sellerX + 10, yPos);
  if (settings.seller_nip) {
    yPos += 15;
    doc.text(`NIP: ${settings.seller_nip}`, sellerX + 10, yPos);
  }

  doc.y = sectionY + sectionHeight + 20;

  // Opis usługi
  if (invoiceData.description) {
    doc.fillColor(primaryColor)
       .font(fsSync.existsSync(fontBoldPath) ? 'DejaVu-Bold' : 'DejaVu')
       .fontSize(12)
       .text('Opis usługi:', 50, doc.y);
    
    doc.fillColor(textColor)
       .font('DejaVu')
       .fontSize(10)
       .text(invoiceData.description, 50, doc.y + 15, { width: doc.page.width - 100 });
    
    doc.moveDown(2);
  }

  // Tabela pozycji - ulepszona
  const tableTop = doc.y + 10;
  const columnWidths = [40, 220, 60, 50, 80, 90];
  const tableWidth = columnWidths.reduce((a, b) => a + b);
  const startX = 50;

  // Nagłówek tabeli
  doc.rect(startX, tableTop, tableWidth, 25)
     .fill(primaryColor);

  doc.fillColor('white')
     .font(fsSync.existsSync(fontBoldPath) ? 'DejaVu-Bold' : 'DejaVu')
     .fontSize(9);

  const headers = ['Lp.', 'Opis', 'Ilość', 'j.m.', 'Cena jedn.', 'Wartość'];
  let x = startX;
  
  headers.forEach((header, i) => {
    const align = i > 1 ? 'center' : 'left';
    const textX = align === 'center' ? x + columnWidths[i] / 2 - doc.widthOfString(header) / 2 : x + 5;
    doc.text(header, textX, tableTop + 8);
    x += columnWidths[i];
  });

  // Wiersz z danymi
  const rowY = tableTop + 25;
  doc.rect(startX, rowY, tableWidth, 25)
     .fill('white')
     .stroke('#e2e8f0');

  doc.fillColor(textColor)
     .font('DejaVu')
     .fontSize(9);

  const rowData = [
    '1',
    invoiceData.item.description,
    invoiceData.item.quantity.toString(),
    invoiceData.item.unit,
    formatCurrency(invoiceData.item.unitPrice),
    formatCurrency(invoiceData.item.total)
  ];

  x = startX;
  rowData.forEach((cell, i) => {
    const align = i > 1 ? 'center' : 'left';
    const textX = align === 'center' ? x + columnWidths[i] / 2 - doc.widthOfString(cell) / 2 : x + 5;
    doc.text(cell, textX, rowY + 8);
    x += columnWidths[i];
  });

  doc.y = rowY + 40;

  // Podsumowanie - w ramce
  const summaryY = doc.y;
  const summaryWidth = 200;
  const summaryX = doc.page.width - summaryWidth - 50;

  doc.rect(summaryX, summaryY, summaryWidth, 60)
     .fill(accentColor)
     .stroke('#e2e8f0');

  doc.fillColor(primaryColor)
     .font(fsSync.existsSync(fontBoldPath) ? 'DejaVu-Bold' : 'DejaVu')
     .fontSize(14)
     .text('DO ZAPŁATY:', summaryX + 10, summaryY + 10);

  doc.fontSize(16)
     .text(formatCurrency(invoiceData.item.total), summaryX + 10, summaryY + 30);

  // Kwota słownie
  doc.y = summaryY + 70;
  const words = slownie(invoiceData.item.total);
  doc.fillColor(textColor)
     .font('DejaVu')
     .fontSize(10)
     .text(`Słownie: ${words} złotych 00/100`, 50, doc.y, { 
       width: doc.page.width - 100,
       align: 'left'
     });

  doc.moveDown();

  // Informacje o płatności - w ramce
  const paymentY = doc.y + 10;
  doc.rect(50, paymentY, doc.page.width - 100, 40)
     .fill('#fef3c7')
     .stroke('#f59e0b');

  doc.fillColor('#92400e')
     .font(fsSync.existsSync(fontBoldPath) ? 'DejaVu-Bold' : 'DejaVu')
     .fontSize(10)
     .text('Sposób płatności:', 60, paymentY + 8);

  doc.font('DejaVu')
     .text(`Przelew na rachunek: ${settings.bank_account}`, 60, paymentY + 22);

  // Stopka
  doc.y = doc.page.height - 100;
  doc.fillColor(secondaryColor)
     .fontSize(8)
     .text('Rachunek wygenerowany automatycznie', 50, doc.y, { 
       align: 'center',
       width: doc.page.width - 100
     });

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}

module.exports = { generateInvoicePDF };