const { DataTypes } = require('sequelize');
const { db } = require('../db.js');

const MediaTemplate = db.define('MediaTemplate', {
  media_type_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  formula: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  variables_json: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: '[]'
  }
}, {
  tableName: 'media_templates',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = { MediaTemplate };