const mongoose = require('mongoose');
require('dotenv').config();

async function testWhatsAppFrontend() {
  try {
    console.log('🔍 [FRONTEND TEST] Conectando a la base de datos...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ [FRONTEND TEST] Conectado a MongoDB');
    
    const db = mongoose.connection.db;
    const waachatCollection = db.collection('waachat');
    
    console.log('🔍 [FRONTEND TEST] Simulando lo que debería hacer la API de chats...');
    
    // Obtener todos los mensajes de la BD
    const allMessages = await waachatCollection.find({}).toArray();
    console.log('📊 [FRONTEND TEST] Total mensajes en BD:', allMessages.length);
    
    // Agrupar por contacto manualmente (como debería hacer la API)
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
    
    console.log('\n✅ [FRONTEND TEST] ========== RESULTADO FINAL ==========');
    console.log('📱 [FRONTEND TEST] Conversaciones encontradas:', conversations.length);
    console.log('📱 [FRONTEND TEST] Estructura que debería recibir el frontend:');
    
    conversations.forEach((chat, index) => {
      console.log(`\n--- Conversación ${index + 1} ---`);
      console.log('ID:', chat._id);
      console.log('Nombre:', chat.contact_name);
      console.log('Teléfono:', chat.contact_wa_id);
      console.log('Último mensaje:', chat.last_message);
      console.log('Timestamp:', chat.last_timestamp);
      console.log('Fecha:', new Date(chat.last_timestamp * 1000).toLocaleString());
      console.log('Cantidad mensajes:', chat.message_count);
      console.log('Dirección último:', chat.last_direction);
    });
    
    console.log('\n🔍 [FRONTEND TEST] ========== PROBANDO MENSAJES DE UN CONTACTO ==========');
    if (conversations.length > 0) {
      const firstContact = conversations[0];
      console.log(`📱 [FRONTEND TEST] Obteniendo mensajes de: ${firstContact.contact_name} (${firstContact.contact_wa_id})`);
      
      const contactMessages = await waachatCollection.find({
        contact_wa_id: firstContact.contact_wa_id
      })
      .sort({ timestamp: 1 }) // Ordenar por timestamp ascendente (más antiguos primero)
      .toArray();
      
      console.log(`📱 [FRONTEND TEST] Mensajes encontrados: ${contactMessages.length}`);
      contactMessages.forEach((msg, index) => {
        console.log(`  ${index + 1}. [${msg.direction}] ${msg.message_text} (${new Date(msg.timestamp * 1000).toLocaleString()})`);
      });
    }
    
    console.log('\n✅ [FRONTEND TEST] ========== SIMULACIÓN COMPLETADA ==========');
    console.log('📱 [FRONTEND TEST] El frontend debería recibir:');
    console.log('  - Array de conversaciones con la estructura mostrada arriba');
    console.log('  - Cada conversación tiene: _id, contact_name, contact_wa_id, last_message, last_timestamp, message_count, last_direction');
    console.log('  - Los mensajes individuales tienen: _id, direction, contact_wa_id, message_text, timestamp, message_id, etc.');
    
  } catch (error) {
    console.error('❌ [FRONTEND TEST] Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 [FRONTEND TEST] Conexión cerrada');
  }
}

testWhatsAppFrontend();
