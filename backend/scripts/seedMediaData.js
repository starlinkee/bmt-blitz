import { 
  Client, 
  MediaType, 
  MediaTemplate, 
  ClientMediaTemplate,
  sequelize 
} from '../models/index.js';

const seedMediaData = async () => {
  try {
    console.log('🌱 Dodawanie danych mediów...');

    // 1. Utwórz typy mediów
    const mediaTypes = await MediaType.bulkCreate([
      { name: 'Ciepła woda' },
      { name: 'Zimna woda' },
      { name: 'Internet' },
      { name: 'Gaz' },
      { name: 'Prąd' }
    ], { ignoreDuplicates: true });

    console.log(`✅ Utworzono ${mediaTypes.length} typów mediów`);

    // 2. Utwórz szablony obliczeń
    const templates = await MediaTemplate.bulkCreate([
      {
        media_type_id: mediaTypes[0].id, // Ciepła woda
        formula: '({current} - {previous}) * 9.99',
        variables_json: JSON.stringify(['current', 'previous'])
      },
      {
        media_type_id: mediaTypes[1].id, // Zimna woda
        formula: '({current} - {previous}) * 4.50',
        variables_json: JSON.stringify(['current', 'previous'])
      },
      {
        media_type_id: mediaTypes[2].id, // Internet
        formula: '89.99',
        variables_json: JSON.stringify([])
      },
      {
        media_type_id: mediaTypes[3].id, // Gaz
        formula: '({current} - {previous}) * 2.85',
        variables_json: JSON.stringify(['current', 'previous'])
      },
      {
        media_type_id: mediaTypes[4].id, // Prąd
        formula: '({current} - {previous}) * 0.75',
        variables_json: JSON.stringify(['current', 'previous'])
      }
    ], { ignoreDuplicates: true });

    console.log(`✅ Utworzono ${templates.length} szablonów obliczeń`);

    // 3. Pobierz wszystkich klientów
    const clients = await Client.findAll();
    console.log(`📋 Znaleziono ${clients.length} klientów`);

    // 4. Przypisz szablony do klientów
    const clientTemplates = [];
    
    for (const client of clients) {
      // Każdy klient dostaje internet (stała opłata)
      clientTemplates.push({
        client_id: client.id,
        media_template_id: templates[2].id, // Internet
        label: `Internet - ${client.name}`,
        active: true
      });

      // Dodaj ciepłą wodę dla pierwszych 2 klientów
      if (client.id <= 2) {
        clientTemplates.push({
          client_id: client.id,
          media_template_id: templates[0].id, // Ciepła woda
          label: `Ciepła woda - ${client.name}`,
          active: true
        });
      }

      // Dodaj zimną wodę dla wszystkich
      clientTemplates.push({
        client_id: client.id,
        media_template_id: templates[1].id, // Zimna woda
        label: `Zimna woda - ${client.name}`,
        active: true
      });
    }

    await ClientMediaTemplate.bulkCreate(clientTemplates, { ignoreDuplicates: true });
    console.log(`✅ Przypisano ${clientTemplates.length} szablonów do klientów`);

    console.log('🎉 Dane mediów zostały pomyślnie dodane!');
    
    // Pokaż podsumowanie
    console.log('\n📊 Podsumowanie:');
    console.log(`- Typy mediów: ${mediaTypes.length}`);
    console.log(`- Szablony: ${templates.length}`);
    console.log(`- Przypisania: ${clientTemplates.length}`);
    console.log(`- Klienci: ${clients.length}`);

  } catch (error) {
    console.error('❌ Błąd podczas dodawania danych mediów:', error);
  } finally {
    await sequelize.close();
  }
};

seedMediaData(); 