import { db as sequelize } from '../db.js';

const addMediaTemplateIdColumn = async () => {
  try {
    console.log('🔧 Dodawanie kolumny media_template_id do tabeli media_records...');
    
    // Sprawdź czy kolumna już istnieje (PostgreSQL)
    const [results] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'media_records' 
      AND column_name = 'media_template_id';
    `);
    
    const columnExists = results.length > 0;
    
    if (columnExists) {
      console.log('✅ Kolumna media_template_id już istnieje');
      return;
    }
    
    // Dodaj kolumnę (PostgreSQL)
    await sequelize.query(`
      ALTER TABLE media_records 
      ADD COLUMN media_template_id INTEGER NOT NULL DEFAULT 1;
    `);
    
    console.log('✅ Kolumna media_template_id została dodana');
    
  } catch (error) {
    console.error('❌ Błąd podczas dodawania kolumny:', error);
  } finally {
    await sequelize.close();
  }
};

addMediaTemplateIdColumn(); 