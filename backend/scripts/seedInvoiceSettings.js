import { InvoiceSettings } from '../models/InvoiceSettings.js';
import { db } from '../db.js';
import '../models/index.js';

await db.sync();

const settings = await InvoiceSettings.create({
  seller_name: 'Jerzy Bobiński',
  seller_address_line1: 'ul. Jana Pawła II 66 lok. 2',
  seller_address_line2: '47-232 Kędzierzyn-Koźle',
  seller_nip: '7491021184',
  default_place_of_issue: 'Kędzierzyn-Koźle',
  default_due_in_days: 10,
  bank_account: '22 1240 1659 1111 0010 2591 2002'
});

console.log('✅ Invoice settings seeded:', settings.id);
process.exit(0); 