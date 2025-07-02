// backend/models/Client.js
const { DataTypes } = require('sequelize');
const { db } = require('../db.js');

const Client = db.define('Client', {
  name:       { type: DataTypes.STRING,  allowNull: false },
  email:      { type: DataTypes.STRING,  allowNull: false, validate: { isEmail: true } },
  address:    { type: DataTypes.TEXT },
  rent:       { type: DataTypes.DECIMAL(10,2), allowNull: false }
}, {
  tableName: 'clients',
  timestamps: true
});

module.exports = { Client };
