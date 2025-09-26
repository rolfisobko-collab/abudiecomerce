const mongoose = require('mongoose');
require('dotenv').config();

async function fixMalformedData() {
  try {
    console.log('🔍 [FIX DEBUG] Conectando a MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ [FIX DEBUG] Conectado a MongoDB Atlas');
    
    const db = mongoose.connection.db;
    const waachatCollection = db.collection('waachat');
    
    console.log('🔍 [FIX DEBUG] Obteniendo documentos malformados...');
    const malformedDocs = await waachatCollection.find({}).toArray();
    console.log(`📊 [FIX DEBUG] Documentos malformados encontrados: ${malformedDocs.length}`);
    
    if (malformedDocs.length === 0) {
      console.log('⚠️ [FIX DEBUG] No hay documentos para procesar');
      return;
    }
    
    const fixedMessages = [];
    
    malformedDocs.forEach((doc, index) => {
      console.log(`\n🔧 [FIX DEBUG] Procesando documento ${index + 1}:`);
      console.log(`  _id: ${doc._id}`);
      
      // Extraer datos de las claves malformadas
      let direction = null;
      let contact_name = null;
      let contact_wa_id = null;
      let message_text = null;
      let timestamp = null;
      let message_id = null;
      
      Object.keys(doc).forEach(key => {
        if (key !== '_id') {
          console.log(`  Clave: "${key}"`);
          
          // Buscar direction
          if (key.includes('"direction": in')) {
            direction = 'in';
          } else if (key.includes('"direction": out')) {
            direction = 'out';
          }
          
          // Buscar contact_name
          if (key.includes('"contact_name":')) {
            const match = key.match(/"contact_name":\s*([^"]+)/);
            if (match) {
              contact_name = match[1];
            }
          }
          
          // Buscar contact_wa_id
          if (key.includes('"contact_wa_id":')) {
            const match = key.match(/"contact_wa_id":\s*([^"]+)/);
            if (match) {
              contact_wa_id = match[1];
            }
          }
          
          // Buscar message_text
          if (key.includes('"message_text":')) {
            const match = key.match(/"message_text":\s*([^"]+)/);
            if (match) {
              message_text = match[1];
            }
          }
          
          // Buscar timestamp
          if (key.includes('"timestamp":')) {
            const match = key.match(/"timestamp":\s*([^"]+)/);
            if (match) {
              timestamp = parseInt(match[1]);
            }
          }
          
          // Buscar message_id
          if (key.includes('"message_id":')) {
            const match = key.match(/"message_id":\s*([^"]+)/);
            if (match) {
              message_id = match[1];
            }
          }
        }
      });
      
      const fixedMessage = {
        _id: doc._id,
        direction: direction,
        contact_name: contact_name,
        contact_wa_id: contact_wa_id,
        message_text: message_text,
        timestamp: timestamp,
        message_id: message_id,
        messaging_product: 'whatsapp',
        created_at: new Date()
      };
      
      console.log(`📱 [FIX DEBUG] Mensaje ${index + 1} reconstruido:`);
      console.log(`  Direction: ${fixedMessage.direction}`);
      console.log(`  Contact: ${fixedMessage.contact_name} (${fixedMessage.contact_wa_id})`);
      console.log(`  Text: ${fixedMessage.message_text}`);
      console.log(`  Timestamp: ${fixedMessage.timestamp}`);
      console.log(`  Message ID: ${fixedMessage.message_id}`);
      
      fixedMessages.push(fixedMessage);
    });
    
    console.log('\n🔧 [FIX DEBUG] Eliminando documentos malformados...');
    await waachatCollection.deleteMany({});
    console.log('✅ [FIX DEBUG] Documentos malformados eliminados');
    
    console.log('\n🔧 [FIX DEBUG] Insertando mensajes corregidos...');
    if (fixedMessages.length > 0) {
      await waachatCollection.insertMany(fixedMessages);
      console.log(`✅ [FIX DEBUG] ${fixedMessages.length} mensajes corregidos insertados`);
    }
    
    console.log('\n✅ [FIX DEBUG] Proceso completado exitosamente');
    
  } catch (error) {
    console.error('❌ [FIX DEBUG] Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 [FIX DEBUG] Conexión cerrada');
  }
}

fixMalformedData();
