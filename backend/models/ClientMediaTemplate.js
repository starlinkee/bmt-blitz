import { DataTypes } from 'sequelize';
import { db } from '../db.js';

export const ClientMediaTemplate = db.define('ClientMediaTemplate', {
  label: {
    type: DataTypes.STRING,
    allowNull: false
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'client_media_templates',
  underscored: true,
  timestamps: false
});