import { Sequelize } from 'sequelize';
import { db as sequelize } from '../db.js';

// Modele główne
import { User } from './User.js';
import { Client } from './Client.js';
import { Invoice } from './Invoice.js';
import { InvoiceBatch } from './InvoiceBatch.js';
import { InvoiceSettings } from './InvoiceSettings.js';
import { MediaBatch } from './MediaBatch.js';

// Modele mediów
import MediaTypeModel from './MediaType.js';
import MediaTemplateModel from './MediaTemplate.js';
import MediaRecordModel from './MediaRecord.js';
import MediaVariableModel from './MediaVariable.js';
import MediaAttachmentModel from './MediaAttachment.js';
import ClientMediaTemplateModel from './ClientMediaTemplate.js';

// Inicjalizacja modeli
const MediaType = MediaTypeModel(sequelize, Sequelize.DataTypes);
const MediaTemplate = MediaTemplateModel(sequelize, Sequelize.DataTypes);
const MediaRecord = MediaRecordModel(sequelize, Sequelize.DataTypes);
const MediaVariable = MediaVariableModel(sequelize, Sequelize.DataTypes);
const MediaAttachment = MediaAttachmentModel(sequelize, Sequelize.DataTypes);
const ClientMediaTemplate = ClientMediaTemplateModel(sequelize, Sequelize.DataTypes);

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
export {
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
