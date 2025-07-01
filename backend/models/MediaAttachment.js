import { DataTypes } from 'sequelize';
import { db } from '../db.js';

export const MediaAttachment = db.define('MediaAttachment', {
  file_path: DataTypes.STRING,
  original_name: DataTypes.STRING,
  uploaded_at: DataTypes.DATE
}, {
  tableName: 'media_attachments',
  timestamps: true
});
  