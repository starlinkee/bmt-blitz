const { Router } = require('express');
const { Invoice } = require('../../models/Invoice.js');
const { Client } = require('../../models/Client.js'); 
const { authRequired } = require('./auth.js');
const { sendMonthlyInvoices } = require('../../services/sendInvoiceBatch.js');

const invoiceRouter = Router();

// GET /invoices
invoiceRouter.get('/', authRequired, async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      include: { model: Client },
      order: [['periodStart', 'DESC']],
    });
    res.json(invoices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load invoices' });
  }
});

// GET /clients/:id/invoices
invoiceRouter.get('/clients/:id/invoices', authRequired, async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      where: { clientId: req.params.id },
      include: { model: Client }
    });
    res.json(invoices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load client invoices' });
  }
});

// POST /invoices/send-monthly
invoiceRouter.post('/send-monthly', authRequired, async (req, res) => {
  try {
    const { success, message } = await sendMonthlyInvoices();
    if (!success) return res.status(409).json({ message }); // Already sent
    return res.status(200).json({ message });
  } catch (err) {
    console.error('Błąd wysyłki faktur:', err);
    return res.status(500).json({ message: 'Błąd serwera' });
  }
});

module.exports = { invoiceRouter };
