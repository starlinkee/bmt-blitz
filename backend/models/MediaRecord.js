import { DataTypes } from 'sequelize';
import { db } from '../db.js';

export const MediaRecord = db.define('MediaRecord', {
  client_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  media_type_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  media_template_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  year: DataTypes.INTEGER,
  month: DataTypes.INTEGER,
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending'
  },
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE
}, {
  tableName: 'media_records',
  underscored: true,
  timestamps: false
});
  