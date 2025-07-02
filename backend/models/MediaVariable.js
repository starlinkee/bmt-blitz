const { DataTypes } = require('sequelize');
const { db } = require('../db.js');

const MediaVariable = db.define('MediaVariable', {
  name: DataTypes.STRING,
  value: DataTypes.DECIMAL(10, 2)
}, {
  tableName: 'media_variables',
  timestamps: true
});

module.exports = { MediaVariable };