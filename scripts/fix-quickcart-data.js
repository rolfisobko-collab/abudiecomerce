const mongoose = require('mongoose');
require('dotenv').config();

async function fixQuickcartData() {
  try {
    console.log('🔍 [QUICKCART DEBUG] Conectando a MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ [QUICKCART DEBUG] Conectado a MongoDB Atlas');
    
    const db = mongoose.connection.db;
    const waachatCollection = db.collection('waachat');
    
    console.log('🔍 [QUICKCART DEBUG] Obteniendo documentos malformados...');
    const malformedDocs = await waachatCollection.find({}).toArray();
    console.log(`📊 [QUICKCART DEBUG] Documentos malformados encontrados: ${malformedDocs.length}`);
    
    if (malformedDocs.length === 0) {
      console.log('⚠️ [QUICKCART DEBUG] No hay documentos para procesar');
      return;
    }
    
    const fixedMessages = [];
    
    malformedDocs.forEach((doc, index) => {
      console.log(`\n🔧 [QUICKCART DEBUG] Procesando documento ${index + 1}:`);
      console.log(`  _id: ${doc._id}`);
      
      // Extraer datos de las claves malformadas
      let direction = null;
      let contact_name = null;
      let contact_wa_id = null;
      let message_text = null;
      let timestamp = null;
      let message_id = null;
      let messaging_product = null;
      let phone_number_id = null;
      let display_phone_number = null;
      let message_from = null;
      let contact_input = null;
      
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
          
          // Buscar messaging_product
          if (key.includes('"messaging_product":')) {
            const match = key.match(/"messaging_product":\s*([^"]+)/);
            if (match) {
              messaging_product = match[1];
            }
          }
          
          // Buscar phone_number_id
          if (key.includes('"phone_number_id":')) {
            const match = key.match(/"phone_number_id":\s*([^"]+)/);
            if (match) {
              phone_number_id = parseInt(match[1]);
            }
          }
          
          // Buscar display_phone_number
          if (key.includes('"display_phone_number":')) {
            const match = key.match(/"display_phone_number":\s*([^"]+)/);
            if (match) {
              display_phone_number = parseInt(match[1]);
            }
          }
          
          // Buscar message_from
          if (key.includes('"message_from":')) {
            const match = key.match(/"message_from":\s*([^"]+)/);
            if (match) {
              message_from = match[1];
            }
          }
          
          // Buscar contact_input
          if (key.includes('"contact_input":')) {
            const match = key.match(/"contact_input":\s*([^"]+)/);
            if (match) {
              contact_input = match[1];
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
        messaging_product: messaging_product,
        phone_number_id: phone_number_id,
        display_phone_number: display_phone_number,
        message_from: message_from,
        contact_input: contact_input,
        created_at: new Date()
      };
      
      console.log(`📱 [QUICKCART DEBUG] Mensaje ${index + 1} reconstruido:`);
      console.log(`  Direction: ${fixedMessage.direction}`);
      console.log(`  Contact: ${fixedMessage.contact_name} (${fixedMessage.contact_wa_id})`);
      console.log(`  Text: ${fixedMessage.message_text}`);
      console.log(`  Timestamp: ${fixedMessage.timestamp}`);
      console.log(`  Message ID: ${fixedMessage.message_id}`);
      console.log(`  From: ${fixedMessage.message_from || fixedMessage.contact_input}`);
      
      fixedMessages.push(fixedMessage);
    });
    
    console.log('\n🔧 [QUICKCART DEBUG] Eliminando documentos malformados...');
    await waachatCollection.deleteMany({});
    console.log('✅ [QUICKCART DEBUG] Documentos malformados eliminados');
    
    console.log('\n🔧 [QUICKCART DEBUG] Insertando mensajes corregidos...');
    if (fixedMessages.length > 0) {
      await waachatCollection.insertMany(fixedMessages);
      console.log(`✅ [QUICKCART DEBUG] ${fixedMessages.length} mensajes corregidos insertados`);
    }
    
    console.log('\n✅ [QUICKCART DEBUG] Proceso completado exitosamente');
    
    // Verificar que los datos se insertaron correctamente
    console.log('\n🔍 [QUICKCART DEBUG] Verificando datos corregidos...');
    const correctedDocs = await waachatCollection.find({}).toArray();
    console.log(`📊 [QUICKCART DEBUG] Documentos corregidos: ${correctedDocs.length}`);
    
    correctedDocs.forEach((doc, index) => {
      console.log(`📝 [QUICKCART DEBUG] Documento ${index + 1} corregido:`);
      console.log(`  _id: ${doc._id}`);
      console.log(`  direction: ${doc.direction}`);
      console.log(`  contact_name: ${doc.contact_name}`);
      console.log(`  contact_wa_id: ${doc.contact_wa_id}`);
      console.log(`  message_text: ${doc.message_text}`);
      console.log(`  timestamp: ${doc.timestamp}`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('❌ [QUICKCART DEBUG] Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 [QUICKCART DEBUG] Conexión cerrada');
  }
}

fixQuickcartData();
