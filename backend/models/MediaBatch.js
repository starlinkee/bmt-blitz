import { DataTypes } from 'sequelize';
import { db } from '../db.js';

export const MediaBatch = db.define('MediaBatch', {
  month: {
    type: DataTypes.STRING(7), // format: "2025-07"
    allowNull: false,
    unique: true
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'media_batches',
  timestamps: false
}); 