import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function generateInvoicePDF(invoiceData) {
  const outputDir = path.resolve(__dirname, '../generated', invoiceData.period || '2025-06');
  await fs.mkdir(outputDir, { recursive: true });

  const safeFilename = `rachunek_${invoiceData.invoiceNumber.replaceAll('/', '-')}.pdf`;
  const filePath = path.join(outputDir, safeFilename);

  const doc = new PDFDocument({ margin: 50 });
  const stream = fsSync.createWriteStream(filePath);
  doc.pipe(stream);

  // Prosty szkielet faktury (możesz rozbudować)
  doc.fontSize(20).text(`RACHUNEK nr ${invoiceData.invoiceNumber}`, { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).text(`Data wystawienia: ${invoiceData.issueDate}`);
  doc.text(`Termin płatności: ${invoiceData.dueDate}`);
  doc.text(`Miejsce wystawienia: ${invoiceData.placeOfIssue}`);
  doc.moveDown();

  doc.fontSize(14).text('NABYWCA:', { underline: true });
  doc.fontSize(12).text(`${invoiceData.clientName}`);
  doc.text(`${invoiceData.clientCompany}`);
  doc.text(`${invoiceData.clientAddress}`);
  doc.moveDown();

  doc.fontSize(14).text('SPRZEDAWCA:', { underline: true });
  doc.fontSize(12).text(`${invoiceData.sellerName}`);
  doc.text(`${invoiceData.sellerAddress}`);
  doc.text(`NIP: ${invoiceData.sellerNIP}`);
  doc.moveDown();

  doc.fontSize(14).text('OPIS:', { underline: true });
  doc.fontSize(12).text(`${invoiceData.description}`);
  doc.moveDown();

  doc.text(`Pozycja: ${invoiceData.itemDescription}`);
  doc.text(`Ilość: ${invoiceData.quantity} ${invoiceData.unit}`);
  doc.text(`Cena jednostkowa: ${invoiceData.unitPrice} zł`);
  doc.text(`Kwota: ${invoiceData.totalGross} zł`);
  doc.moveDown();

  doc.fontSize(14).text(`DO ZAPŁATY: ${invoiceData.totalGross} zł`, { align: 'right' });
  doc.text(`${invoiceData.amountInWords}`, { align: 'right' });
  doc.moveDown();

  doc.text(`Sposób zapłaty: przelew na ${invoiceData.bankAccount}`);

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}
