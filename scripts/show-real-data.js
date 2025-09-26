const mongoose = require('mongoose');
require('dotenv').config();

async function showRealData() {
  try {
    console.log('🔍 [REAL DATA DEBUG] Conectando a la base de datos...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ [REAL DATA DEBUG] Conectado a MongoDB');
    
    const db = mongoose.connection.db;
    const waachatCollection = db.collection('waachat');
    
    // Obtener TODOS los mensajes
    const allMessages = await waachatCollection.find({}).toArray();
    console.log('📊 [REAL DATA DEBUG] Total mensajes en BD:', allMessages.length);
    
    if (allMessages.length > 0) {
      console.log('\n📝 [REAL DATA DEBUG] TODOS LOS MENSAJES:');
      allMessages.forEach((message, index) => {
        console.log(`\n--- Mensaje ${index + 1} ---`);
        console.log('ID:', message._id);
        console.log('Contacto:', message.contact_name);
        console.log('Teléfono:', message.contact_wa_id);
        console.log('Dirección:', message.direction);
        console.log('Mensaje:', message.message_text);
        console.log('Timestamp:', message.timestamp);
        console.log('Fecha:', new Date(message.timestamp * 1000).toLocaleString());
        if (message.message_id) console.log('Message ID:', message.message_id);
        if (message.sent_by_admin) console.log('Enviado por admin:', message.sent_by_admin);
      });
      
      // Agrupar por contacto
      console.log('\n👥 [REAL DATA DEBUG] AGRUPANDO POR CONTACTO:');
      const contactsMap = new Map();
      
      allMessages.forEach(message => {
        const contactId = message.contact_wa_id;
        if (!contactsMap.has(contactId)) {
          contactsMap.set(contactId, {
            contact_name: message.contact_name,
            contact_wa_id: message.contact_wa_id,
            messages: []
          });
        }
        contactsMap.get(contactId).messages.push(message);
      });
      
      contactsMap.forEach((contact, contactId) => {
        console.log(`\n--- ${contact.contact_name} (${contactId}) ---`);
        console.log('Total mensajes:', contact.messages.length);
        contact.messages.forEach((msg, index) => {
          console.log(`  ${index + 1}. [${msg.direction}] ${msg.message_text.substring(0, 50)}...`);
        });
      });
      
    } else {
      console.log('❌ [REAL DATA DEBUG] No hay mensajes en la BD');
    }
    
  } catch (error) {
    console.error('❌ [REAL DATA DEBUG] Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 [REAL DATA DEBUG] Conexión cerrada');
  }
}

showRealData();
