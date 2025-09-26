const mongoose = require('mongoose');
require('dotenv').config();

async function cleanFakeData() {
  try {
    console.log('🔍 [CLEAN DEBUG] Conectando a la base de datos...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ [CLEAN DEBUG] Conectado a MongoDB');
    
    const db = mongoose.connection.db;
    const waachatCollection = db.collection('waachat');
    
    console.log('🔍 [CLEAN DEBUG] Limpiando datos falsos de la colección waachat...');
    
    // Eliminar todos los mensajes falsos
    const deleteResult = await waachatCollection.deleteMany({});
    console.log(`🗑️ [CLEAN DEBUG] Eliminados ${deleteResult.deletedCount} mensajes falsos`);
    
    // Verificar que la colección esté vacía
    const remainingCount = await waachatCollection.countDocuments();
    console.log(`📊 [CLEAN DEBUG] Mensajes restantes en la BD: ${remainingCount}`);
    
    if (remainingCount === 0) {
      console.log('✅ [CLEAN DEBUG] BD limpia, lista para datos reales');
    } else {
      console.log('⚠️ [CLEAN DEBUG] Aún hay mensajes en la BD');
    }
    
  } catch (error) {
    console.error('❌ [CLEAN DEBUG] Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 [CLEAN DEBUG] Conexión cerrada');
  }
}

cleanFakeData();
