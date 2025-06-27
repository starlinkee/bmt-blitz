import { DataTypes } from 'sequelize';
import { db } from '../db.js';

export const Invoice = db.define('Invoice', {
  number:      { type: DataTypes.STRING,  allowNull: false, unique: true },
  type:        { type: DataTypes.ENUM('RENT', 'MEDIA'), allowNull: false },
  periodStart: { type: DataTypes.DATE,    allowNull: false },
  periodEnd:   { type: DataTypes.DATE,    allowNull: false },
  netAmount:   { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  vatRate:     { type: DataTypes.DECIMAL(4, 2),  allowNull: false },
  grossAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  pdfPath:     { type: DataTypes.STRING },
  sentAt:      { type: DataTypes.DATE },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'invoices',
  timestamps: true
});


