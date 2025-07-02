#!/usr/bin/env node

console.log('🧪 Testing app export');
console.log('=====================');

(async () => {
  try {
    console.log('🔄 Importing app from main directory...');
    const app = await import('../app.js');
  
  console.log('✅ App imported successfully');
  console.log('📋 App type:', typeof app.default);
  console.log('📋 App keys:', Object.keys(app));
  
  if (app.default) {
    console.log('✅ App.default exists');
    console.log('📋 App.default type:', typeof app.default);
    
    // Sprawdź czy to Express app
    if (typeof app.default === 'function') {
      console.log('✅ App.default is a function (likely Express app)');
      
      // Sprawdź czy ma właściwości Express
      if (app.default.use) {
        console.log('✅ App has .use method (Express middleware)');
      }
      if (app.default.get) {
        console.log('✅ App has .get method (Express routing)');
      }
      if (app.default.listen) {
        console.log('✅ App has .listen method (Express server)');
      }
    } else {
      console.log('❌ App.default is not a function');
    }
  } else {
    console.log('❌ App.default does not exist');
  }
  
} catch (error) {
  console.error('❌ Error importing app:', error);
  console.error('📋 Error details:', {
    message: error.message,
    stack: error.stack,
    code: error.code
  });
}

console.log('\n✅ App export test completed');
})(); 