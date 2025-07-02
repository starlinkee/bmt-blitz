const { DataTypes } = require('sequelize');
const { db } = require('../db.js');

const MediaAttachment = db.define('MediaAttachment', {
  file_path: DataTypes.STRING,
  original_name: DataTypes.STRING,
  uploaded_at: DataTypes.DATE
}, {
  tableName: 'media_attachments',
  timestamps: true
});

module.exports = { MediaAttachment };