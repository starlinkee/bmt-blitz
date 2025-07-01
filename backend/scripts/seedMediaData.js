import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Ładuj zmienne środowiskowe
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

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

    // 1. Sprawdź czy typy mediów już istnieją
    let mediaTypes = await MediaType.findAll();
    
    if (mediaTypes.length === 0) {
      // Utwórz typy mediów tylko jeśli nie istnieją
      mediaTypes = await MediaType.bulkCreate([
        { name: 'Ciepła woda' },
        { name: 'Zimna woda' },
        { name: 'Internet' },
        { name: 'Gaz' },
        { name: 'Prąd' }
      ]);
      console.log(`✅ Utworzono ${mediaTypes.length} typów mediów`);
    } else {
      console.log(`✅ Znaleziono ${mediaTypes.length} istniejących typów mediów`);
    }

    // 2. Sprawdź czy szablony już istnieją
    let templates = await MediaTemplate.findAll();
    
    if (templates.length === 0) {
      // Utwórz szablony tylko jeśli nie istnieją
      templates = await MediaTemplate.bulkCreate([
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
      ]);
      console.log(`✅ Utworzono ${templates.length} szablonów obliczeń`);
    } else {
      console.log(`✅ Znaleziono ${templates.length} istniejących szablonów`);
    }

    // 3. Pobierz wszystkich klientów
    const clients = await Client.findAll();
    console.log(`📋 Znaleziono ${clients.length} klientów`);

    // 4. Sprawdź czy przypisania już istnieją
    const existingAssignments = await ClientMediaTemplate.findAll();
    
    if (existingAssignments.length === 0) {
      // Przypisz szablony do klientów tylko jeśli nie istnieją
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

      await ClientMediaTemplate.bulkCreate(clientTemplates);
      console.log(`✅ Przypisano ${clientTemplates.length} szablonów do klientów`);
    } else {
      console.log(`✅ Znaleziono ${existingAssignments.length} istniejących przypisań`);
    }

    console.log('🎉 Dane mediów zostały pomyślnie dodane!');
    
    // Pokaż podsumowanie
    console.log('\n📊 Podsumowanie:');
    console.log(`- Typy mediów: ${mediaTypes.length}`);
    console.log(`- Szablony: ${templates.length}`);
    console.log(`- Przypisania: ${existingAssignments.length || 0}`);
    console.log(`- Klienci: ${clients.length}`);

  } catch (error) {
    console.error('❌ Błąd podczas dodawania danych mediów:', error);
  } finally {
    await sequelize.close();
  }
};

seedMediaData(); 