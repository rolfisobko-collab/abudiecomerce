const mongoose = require('mongoose');
require('dotenv').config();

async function testAPILogicExact() {
  try {
    console.log('🔍 [API EXACT DEBUG] ========== INICIANDO API DE CHATS ==========');
    
    // Conectar a MongoDB (igual que en la API)
    if (mongoose.connection.readyState !== 1) {
      console.log('🔍 [API EXACT DEBUG] Conectando a MongoDB...');
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ [API EXACT DEBUG] Conectado a MongoDB');
    } else {
      console.log('✅ [API EXACT DEBUG] Ya conectado a MongoDB');
    }
    
    const db = mongoose.connection.db;
    const waachatCollection = db.collection('waachat');
    
    console.log('🔍 [API EXACT DEBUG] Conectado a la colección waachat');
    
    // Obtener todos los mensajes de la BD (igual que en la API)
    console.log('🔍 [API EXACT DEBUG] Obteniendo mensajes de la BD...');
    const allMessages = await waachatCollection.find({}).toArray();
    console.log('📊 [API EXACT DEBUG] Total mensajes en BD:', allMessages.length);
    
    if (allMessages.length === 0) {
      console.log('⚠️ [API EXACT DEBUG] No hay mensajes en la BD');
      return;
    }
    
    // Agrupar por contacto manualmente (igual que en la API)
    console.log('🔍 [API EXACT DEBUG] Agrupando mensajes por contacto...');
    const conversationsMap = new Map();
    
    allMessages.forEach((message, index) => {
      console.log(`🔍 [API EXACT DEBUG] Procesando mensaje ${index + 1}:`, {
        _id: message._id,
        contact_wa_id: message.contact_wa_id,
        contact_name: message.contact_name,
        direction: message.direction,
        message_text: message.message_text,
        timestamp: message.timestamp,
        message_id: message.message_id
      });
      
      // Verificar que el mensaje tenga los campos necesarios (igual que en la API)
      if (!message.contact_wa_id || !message.contact_name) {
        console.log(`⚠️ [API EXACT DEBUG] Mensaje ${index + 1} no tiene contact_wa_id o contact_name, saltando...`);
        return;
      }
      
      const contactId = message.contact_wa_id;
      if (!conversationsMap.has(contactId)) {
        conversationsMap.set(contactId, {
          _id: contactId,
          contact_name: message.contact_name,
          contact_wa_id: message.contact_wa_id,
          last_message: message.message_text || 'Mensaje sin texto',
          last_timestamp: message.timestamp || Date.now(),
          message_count: 1,
          last_direction: message.direction || 'in'
        });
        console.log(`✅ [API EXACT DEBUG] Nueva conversación creada para ${message.contact_name}`);
      } else {
        const conv = conversationsMap.get(contactId);
        conv.message_count++;
        if (message.timestamp && message.timestamp > conv.last_timestamp) {
          conv.last_message = message.message_text || 'Mensaje sin texto';
          conv.last_timestamp = message.timestamp;
          conv.last_direction = message.direction || 'in';
        }
        console.log(`📝 [API EXACT DEBUG] Actualizada conversación de ${message.contact_name}, total mensajes: ${conv.message_count}`);
      }
    });
    
    const conversations = Array.from(conversationsMap.values())
      .sort((a, b) => b.last_timestamp - a.last_timestamp);
    
    console.log('✅ [API EXACT DEBUG] ========== RESULTADO FINAL ==========');
    console.log('📱 [API EXACT DEBUG] Conversaciones encontradas:', conversations.length);
    console.log('📱 [API EXACT DEBUG] Estructura de la primera conversación:', JSON.stringify(conversations[0], null, 2));
    
    const response = {
      success: true,
      chats: conversations
    };
    
    console.log('📤 [API EXACT DEBUG] Enviando respuesta:', JSON.stringify(response, null, 2));
    
  } catch (error) {
    console.error('❌ [API EXACT DEBUG] ========== ERROR EN API ==========');
    console.error('❌ [API EXACT DEBUG] Error:', error);
    console.error('❌ [API EXACT DEBUG] Stack:', error.stack);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 [API EXACT DEBUG] Conexión cerrada');
  }
}

testAPILogicExact();
