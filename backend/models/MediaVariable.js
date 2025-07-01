import { DataTypes } from 'sequelize';
import { db } from '../db.js';

export const MediaVariable = db.define('MediaVariable', {
  name: DataTypes.STRING,
  value: DataTypes.DECIMAL(10, 2)
}, {
  tableName: 'media_variables',
  timestamps: true
});
  