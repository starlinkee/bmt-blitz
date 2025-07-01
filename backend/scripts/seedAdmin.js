import bcrypt from 'bcrypt';
import { User } from '../models/index.js';

const run = async () => {
  console.log('🔐 Sprawdzanie administratora...');
  
  try {
    // Sprawdź czy administrator już istnieje
    const existingAdmin = await User.findOne({ 
      where: { email: 'bmtpolska@gmail.com' } 
    });

    if (existingAdmin) {
      console.log('✅ Administrator już istnieje');
      console.log('Email:', existingAdmin.email);
      return;
    }

    // Hashuj hasło
    const password = 'bmtpolska2007'; // domyślne hasło
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Utwórz administratora
    const admin = await User.create({
      email: 'bmtpolska@gmail.com',
      passwordHash: passwordHash
    });

    console.log('✅ Administrator utworzony pomyślnie!');
    console.log('Email:', admin.email);
    console.log('Hasło:', password);
    console.log('⚠️  Pamiętaj, aby zmienić hasło po pierwszym logowaniu!');

  } catch (error) {
    console.error('❌ Błąd podczas tworzenia administratora:', error);
    throw error;
  }
};

run()
  .then(() => {
    console.log('🎉 Seed admin zakończony!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Błąd:', error);
    process.exit(1);
  }); 