// backend/models/index.js
import { User }   from './User.js';
import { Client } from './Client.js';
import { Invoice } from './Invoice.js';

// 1-∞ relacja
Client.hasMany(Invoice, { foreignKey: 'clientId' });
Invoice.belongsTo(Client, { foreignKey: 'clientId' });

export { User, Client, Invoice };
