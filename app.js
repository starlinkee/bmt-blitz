const dotenv = require('dotenv');
const path = require('path');

// Ładujemy .env z katalogu backend
dotenv.config({ path: path.join(__dirname, 'backend/.env') });

// Ustawiamy zmienne środowiskowe dla Passenger
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PASSENGER_APP_ENV = process.env.PASSENGER_APP_ENV || 'production';

// Importujemy aplikację
const app = require('./backend/src/server.js');

// Eksportujemy dla Passenger
module.exports = app;
