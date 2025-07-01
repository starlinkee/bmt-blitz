import { DataTypes } from 'sequelize';
import { db } from '../db.js';

export const MediaType = db.define('MediaType', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'media_types',
  timestamps: true
});
  