const mongoose = require('mongoose');
require('dotenv').config();

async function testAPILogic() {
  try {
    console.log('🔍 [API LOGIC TEST] Conectando a la base de datos...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ [API LOGIC TEST] Conectado a MongoDB');
    
    const db = mongoose.connection.db;
    const waachatCollection = db.collection('waachat');
    
    console.log('🔍 [API LOGIC TEST] Conectado a la colección waachat');
    
    // Obtener todos los mensajes de la BD
    const allMessages = await waachatCollection.find({}).toArray();
    console.log('📊 [API LOGIC TEST] Total mensajes en BD:', allMessages.length);
    
    // Agrupar por contacto manualmente (igual que en la API)
    const conversationsMap = new Map();
    
    allMessages.forEach(message => {
      const contactId = message.contact_wa_id;
      if (!conversationsMap.has(contactId)) {
        conversationsMap.set(contactId, {
          _id: contactId,
          contact_name: message.contact_name,
          contact_wa_id: message.contact_wa_id,
          last_message: message.message_text,
          last_timestamp: message.timestamp,
          message_count: 1,
          last_direction: message.direction
        });
      } else {
        const conv = conversationsMap.get(contactId);
        conv.message_count++;
        if (message.timestamp > conv.last_timestamp) {
          conv.last_message = message.message_text;
          conv.last_timestamp = message.timestamp;
          conv.last_direction = message.direction;
        }
      }
    });
    
    const conversations = Array.from(conversationsMap.values())
      .sort((a, b) => b.last_timestamp - a.last_timestamp);
    
    console.log('🔍 [API LOGIC TEST] Conversaciones encontradas:', conversations.length);
    console.log('🔍 [API LOGIC TEST] Estructura completa de la primera conversación:');
    console.log(JSON.stringify(conversations[0], null, 2));
    
    console.log('\n✅ [API LOGIC TEST] ========== RESULTADO FINAL ==========');
    console.log('📱 [API LOGIC TEST] La API debería devolver:');
    console.log(JSON.stringify({
      success: true,
      chats: conversations
    }, null, 2));
    
  } catch (error) {
    console.error('❌ [API LOGIC TEST] Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 [API LOGIC TEST] Conexión cerrada');
  }
}

testAPILogic();
