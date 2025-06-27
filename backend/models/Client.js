// backend/models/Client.js
import { DataTypes } from 'sequelize';
import { db } from '../db.js';

export const Client = db.define('Client', {
  name:       { type: DataTypes.STRING,  allowNull: false },
  email:      { type: DataTypes.STRING,  allowNull: false, validate: { isEmail: true } },
  address:    { type: DataTypes.TEXT },
  rent:       { type: DataTypes.DECIMAL(10,2), allowNull: false }
}, {
  tableName: 'clients',
  timestamps: true
});
