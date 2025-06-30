import { DataTypes } from 'sequelize';
import { db } from '../db.js';

export const InvoiceSettings = db.define('InvoiceSettings', {
  seller_name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  seller_address_line1: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  seller_address_line2: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  seller_nip: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  default_place_of_issue: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  default_due_in_days: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10
  },
  bank_account: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'invoice_settings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
}); 