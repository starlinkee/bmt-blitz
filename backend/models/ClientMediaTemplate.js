const { DataTypes } = require('sequelize');
const { db } = require('../db.js');

const ClientMediaTemplate = db.define('ClientMediaTemplate', {
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

module.exports = { ClientMediaTemplate };