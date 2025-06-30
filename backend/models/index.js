// backend/models/index.js
import { User }   from './User.js';
import { Client } from './Client.js';
import { Invoice } from './Invoice.js';
import { InvoiceBatch } from './InvoiceBatch.js';
import { InvoiceSettings } from './InvoiceSettings.js';

// 1-∞ relacja a
Client.hasMany(Invoice, { foreignKey: 'clientId' });
Invoice.belongsTo(Client, { foreignKey: 'clientId' });

export { User, Client, Invoice, InvoiceBatch, InvoiceSettings };
