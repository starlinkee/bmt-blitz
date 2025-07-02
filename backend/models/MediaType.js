const { DataTypes } = require('sequelize');
const { db } = require('../db.js');

const MediaType = db.define('MediaType', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'media_types',
  timestamps: true
});

module.exports = { MediaType };