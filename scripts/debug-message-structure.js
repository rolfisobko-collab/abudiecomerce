const mongoose = require('mongoose');
require('dotenv').config();

async function debugMessageStructure() {
  try {
    console.log('🔍 [STRUCTURE DEBUG] Conectando a la base de datos...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ [STRUCTURE DEBUG] Conectado a MongoDB');
    
    const db = mongoose.connection.db;
    const waachatCollection = db.collection('waachat');
    
    console.log('🔍 [STRUCTURE DEBUG] Obteniendo mensajes de la BD...');
    const allMessages = await waachatCollection.find({}).toArray();
    console.log('📊 [STRUCTURE DEBUG] Total mensajes en BD:', allMessages.length);
    
    if (allMessages.length > 0) {
      console.log('\n🔍 [STRUCTURE DEBUG] ========== ESTRUCTURA DEL PRIMER MENSAJE ==========');
      const firstMessage = allMessages[0];
      console.log('📝 [STRUCTURE DEBUG] Campos disponibles en el primer mensaje:');
      Object.keys(firstMessage).forEach(key => {
        console.log(`  - ${key}: ${typeof firstMessage[key]} = ${JSON.stringify(firstMessage[key])}`);
      });
      
      console.log('\n🔍 [STRUCTURE DEBUG] ========== TODOS LOS MENSAJES ==========');
      allMessages.forEach((message, index) => {
        console.log(`\n--- Mensaje ${index + 1} ---`);
        console.log('ID:', message._id);
        console.log('Campos disponibles:', Object.keys(message));
        console.log('contact_wa_id:', message.contact_wa_id);
        console.log('contact_name:', message.contact_name);
        console.log('direction:', message.direction);
        console.log('message_text:', message.message_text);
        console.log('timestamp:', message.timestamp);
      });
    } else {
      console.log('❌ [STRUCTURE DEBUG] No hay mensajes en la BD');
    }
    
  } catch (error) {
    console.error('❌ [STRUCTURE DEBUG] Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 [STRUCTURE DEBUG] Conexión cerrada');
  }
}

debugMessageStructure();
