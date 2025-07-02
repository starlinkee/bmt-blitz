const { Sequelize } = require('sequelize');
const { db: sequelize } = require('../db.js');

// Modele główne
const { User } = require('./User.js');
const { Client } = require('./Client.js');
const { Invoice } = require('./Invoice.js');
const { InvoiceBatch } = require('./InvoiceBatch.js');
const { InvoiceSettings } = require('./InvoiceSettings.js');
const { MediaBatch } = require('./MediaBatch.js');

// Modele mediów
const { MediaType } = require('./MediaType.js');
const { MediaTemplate } = require('./MediaTemplate.js');
const { MediaRecord } = require('./MediaRecord.js');
const { MediaVariable } = require('./MediaVariable.js');
const { MediaAttachment } = require('./MediaAttachment.js');
const { ClientMediaTemplate } = require('./ClientMediaTemplate.js');

// Wszystkie modele są już zainicjalizowane w swoich plikach

// Relacje
Client.hasMany(Invoice, { foreignKey: 'clientId' });
Invoice.belongsTo(Client, { foreignKey: 'clientId' });

MediaType.hasMany(MediaTemplate, { foreignKey: 'media_type_id', as: 'MediaTemplates' });
MediaTemplate.belongsTo(MediaType, { foreignKey: 'media_type_id', as: 'MediaType' });

MediaType.hasMany(MediaRecord, { foreignKey: 'media_type_id', as: 'MediaRecords' });
MediaRecord.belongsTo(MediaType, { foreignKey: 'media_type_id', as: 'MediaType' });

MediaTemplate.hasMany(MediaRecord, { foreignKey: 'media_template_id', as: 'MediaRecords' });
MediaRecord.belongsTo(MediaTemplate, { foreignKey: 'media_template_id', as: 'MediaTemplate' });

Client.hasMany(MediaRecord, { foreignKey: 'client_id', as: 'MediaRecords' });
MediaRecord.belongsTo(Client, { foreignKey: 'client_id', as: 'Client' });

MediaRecord.hasMany(MediaVariable, { foreignKey: 'media_record_id' });
MediaVariable.belongsTo(MediaRecord, { foreignKey: 'media_record_id' });

MediaRecord.hasMany(MediaAttachment, { foreignKey: 'media_record_id' });
MediaAttachment.belongsTo(MediaRecord, { foreignKey: 'media_record_id' });

Client.hasMany(ClientMediaTemplate, { foreignKey: 'client_id', as: 'ClientMediaTemplates' });
ClientMediaTemplate.belongsTo(Client, { foreignKey: 'client_id', as: 'Client' });

MediaTemplate.hasMany(ClientMediaTemplate, { foreignKey: 'media_template_id', as: 'ClientMediaTemplates' });
ClientMediaTemplate.belongsTo(MediaTemplate, { foreignKey: 'media_template_id', as: 'MediaTemplate' });

// Eksport
module.exports = {
  sequelize,
  User,
  Client,
  Invoice,
  InvoiceBatch,
  InvoiceSettings,
  MediaBatch,
  MediaType,
  MediaTemplate,
  MediaRecord,
  MediaVariable,
  MediaAttachment,
  ClientMediaTemplate
};
