const { DataTypes } = require('sequelize');
const { db } = require('../db.js');

const MediaBatch = db.define('MediaBatch', {
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

module.exports = { MediaBatch };