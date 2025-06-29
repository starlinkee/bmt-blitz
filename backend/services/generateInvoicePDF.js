import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function generateInvoicePDF(invoiceData) {
    // 1. Wczytaj szablon HTML
    const htmlTemplatePath = path.resolve(__dirname, '../templates/invoice.html');
    let html = await fs.readFile(htmlTemplatePath, 'utf-8');

    // 2. Podmień zmienne {{...}} w HTML
    for (const [key, value] of Object.entries(invoiceData)) {
        html = html.replaceAll(`{{${key}}}`, value);
    }

    // 3. Ustal ścieżkę i nazwę pliku PDF
    const outputDir = path.resolve(__dirname, '../generated', invoiceData.period || '2025-06');
    await fs.mkdir(outputDir, { recursive: true });

    const safeFilename = `rachunek_${invoiceData.invoiceNumber.replaceAll('/', '-')}.pdf`;
    const filePath = path.join(outputDir, safeFilename);

    // 4. Wygeneruj PDF za pomocą Puppeteer
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.pdf({
        path: filePath,
        format: 'A4',
        printBackground: true,
        margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' }
    });

    await browser.close();
    return filePath;
}
