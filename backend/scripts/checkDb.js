import { db } from '../db.js';
import '../models/index.js';

const checkDatabase = async () => {
  try {
    await db.authenticate();
    console.log('✅ Połączono z bazą danych');
    
    // Sprawdź wszystkie tabele
    const [tables] = await db.query("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('📋 Wszystkie tabele w bazie:');
    tables.forEach(table => console.log(`- ${table.name}`));
    
    // Sprawdź szczegóły tabeli users
    console.log('\n🔍 Szczegóły tabeli users:');
    try {
      const [columns] = await db.query("PRAGMA table_info(users)");
      console.log('Kolumny:');
      columns.forEach(col => console.log(`- ${col.name} (${col.type})`));
      
      const [count] = await db.query("SELECT COUNT(*) as count FROM users");
      console.log(`Liczba rekordów: ${count[0].count}`);
      
      if (count[0].count > 0) {
        const [users] = await db.query("SELECT id, email, createdAt FROM users LIMIT 5");
        console.log('Pierwsze rekordy:');
        users.forEach(user => console.log(`- ID: ${user.id}, Email: ${user.email}, Data: ${user.createdAt}`));
      }
    } catch (err) {
      console.log('❌ Błąd przy sprawdzaniu tabeli users:', err.message);
    }
    
  } catch (error) {
    console.error('❌ Błąd połączenia:', error);
  } finally {
    await db.close();
    process.exit(0);
  }
};

checkDatabase(); 