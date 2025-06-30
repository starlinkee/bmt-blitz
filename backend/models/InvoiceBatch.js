import { DataTypes } from 'sequelize';
import { db } from '../db.js';

export const InvoiceBatch = db.define('InvoiceBatch', {
  month: {
    type: DataTypes.STRING(7),
    allowNull: false,
    unique: true
  },
  sent_at: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'invoice_batches',
  timestamps: false
});