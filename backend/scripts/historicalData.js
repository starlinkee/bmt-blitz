const { db: sequelize } = require('../db.js');

// Import modeli z index.js (gdzie są już zainicjalizowane)
const { 
  Client, 
  Invoice, 
  MediaType, 
  MediaTemplate, 
  MediaRecord, 
  MediaVariable, 
  MediaAttachment 
} = require('../models/index.js');

const run = async () => {
  console.log('🔍 Debug - sprawdzanie modeli:');
  console.log('MediaType:', typeof MediaType);
  console.log('MediaType.create:', typeof MediaType?.create);
  console.log('Client:', typeof Client);
  console.log('Client.create:', typeof Client?.create);
  
  console.log('🔁 Synchronizacja DB (bezpieczna)...');
  await sequelize.sync({ force: false }); // bezpieczne - nie usuwa istniejących danych

  console.log('📦 Sprawdzanie i tworzenie typu mediów...');
  
  // Sprawdź czy typ "Internet" już istnieje
  let internetType = await MediaType.findOne({ where: { name: 'Internet' } });
  if (!internetType) {
    console.log('Tworzenie nowego typu mediów: Internet');
    internetType = await MediaType.create({ name: 'Internet' });
    console.log('✅ MediaType utworzony:', internetType.toJSON());
  } else {
    console.log('✅ Typ mediów "Internet" już istnieje');
  }

  // Sprawdź czy szablon już istnieje
  let internetTemplate = await MediaTemplate.findOne({ 
    where: { media_type_id: internetType.id } 
  });
  if (!internetTemplate) {
    console.log('Tworzenie szablonu dla Internetu');
    internetTemplate = await MediaTemplate.create({
      media_type_id: internetType.id,
      formula: '1 * 60',
      variables_json: '[]',
      created_at: new Date(),
      updated_at: new Date()
    });
  } else {
    console.log('✅ Szablon dla Internetu już istnieje');
  }

  console.log('👥 Sprawdzanie klientów testowych...');
  
  // Sprawdź czy klienci testowi już istnieją
  const existingClients = await Client.findAll({
    where: {
      email: ['jan@example.com', 'anna@example.com', 'piotr@example.com']
    }
  });

  let clients;
  if (existingClients.length === 0) {
    console.log('Tworzenie klientów testowych...');
    clients = await Promise.all([
      Client.create({ name: 'Jan Kowalski', email: 'jan@example.com', address: 'ul. Klonowa 1', rent: 1800 }),
      Client.create({ name: 'Anna Nowak', email: 'anna@example.com', address: 'ul. Dębowa 2', rent: 1650 }),
      Client.create({ name: 'Piotr Zieliński', email: 'piotr@example.com', address: 'ul. Sosnowa 3', rent: 2000 })
    ]);
  } else {
    console.log('✅ Klienci testowi już istnieją');
    clients = existingClients;
  }

  const today = new Date();

  console.log('🧾 Sprawdzanie danych historycznych...');
  
  // Sprawdź czy dane historyczne już istnieją
  const existingInvoices = await Invoice.count();
  if (existingInvoices > 0) {
    console.log(`✅ Znaleziono ${existingInvoices} istniejących faktur - pomijam tworzenie danych historycznych`);
  } else {
    console.log('Tworzenie danych za 3 ostatnie miesiące...');
    for (const client of clients) {
      for (let i = 1; i <= 3; i++) {
        const date = new Date(today);
        date.setMonth(today.getMonth() - i);
        const start = new Date(date.getFullYear(), date.getMonth(), 1);
        const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        // Invoice za czynsz
        await Invoice.create({
          number: `INV-R-${client.id}-${start.toISOString().slice(0, 7)}`,
          type: 'rent',
          periodStart: start,
          periodEnd: end,
          netAmount: client.rent,
          vatRate: 0.23,
          grossAmount: client.rent * 1.23,
          clientId: client.id,
          createdAt: new Date(),
          updatedAt: new Date()
        });

        // MediaRecord + faktura za media
        const mediaRecord = await MediaRecord.create({
          client_id: client.id,
          media_type_id: internetType.id,
          year: start.getFullYear(),
          month: start.getMonth() + 1,
          status: 'calculated',
          created_at: new Date(),
          updated_at: new Date()
        });

        await Invoice.create({
          number: `INV-M-${client.id}-${start.toISOString().slice(0, 7)}`,
          type: 'media',
          periodStart: start,
          periodEnd: end,
          netAmount: 60,
          vatRate: 0.23,
          grossAmount: 60 * 1.23,
          clientId: client.id,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }
  }

  console.log('✅ Seed zakończony bezpiecznie!');
};

run()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('❌ Błąd seedowania:', e);
    process.exit(1);
  });
