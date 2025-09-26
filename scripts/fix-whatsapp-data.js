const mongoose = require('mongoose');

async function fixWhatsAppData() {
  try {
    const uri = 'mongodb+srv://rolfisobko:Rolfi2346@abudicell.igpcvgh.mongodb.net/quickcart?retryWrites=true&w=majority&appName=abudicell';
    await mongoose.connect(uri);
    
    const db = mongoose.connection.db;
    const waachatCollection = db.collection('waachat');
    
    // Obtener documentos malformados
    const malformedDocs = await waachatCollection.find({}).toArray();
    console.log(`📊 Documentos malformados: ${malformedDocs.length}`);
    
    const fixedMessages = [];
    
    malformedDocs.forEach((doc, index) => {
      console.log(`\n🔧 Procesando documento ${index + 1}:`);
      
      let direction = null;
      let contact_name = null;
      let contact_wa_id = null;
      let message_text = null;
      let timestamp = null;
      let message_id = null;
      
      // Extraer datos de las claves malformadas
      Object.keys(doc).forEach(key => {
        if (key !== '_id') {
          if (key.includes('"direction": in')) {
            direction = 'in';
          } else if (key.includes('"direction": out')) {
            direction = 'out';
          }
          
          if (key.includes('"contact_name":')) {
            const match = key.match(/"contact_name":\s*([^"]+)/);
            if (match) {
              contact_name = match[1];
            }
          }
          
          if (key.includes('"contact_wa_id":')) {
            const match = key.match(/"contact_wa_id":\s*([^"]+)/);
            if (match) {
              contact_wa_id = match[1];
            }
          }
          
          if (key.includes('"message_text":')) {
            const match = key.match(/"message_text":\s*([^"]+)/);
            if (match) {
              message_text = match[1];
            }
          }
          
          if (key.includes('"timestamp":')) {
            const match = key.match(/"timestamp":\s*([^"]+)/);
            if (match) {
              timestamp = parseInt(match[1]);
            }
          }
          
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
        created_at: new Date()
      };
      
      console.log(`📱 Mensaje ${index + 1} reconstruido:`, fixedMessage);
      fixedMessages.push(fixedMessage);
    });
    
    // Eliminar documentos malformados
    console.log('\n🗑️ Eliminando documentos malformados...');
    await waachatCollection.deleteMany({});
    
    // Insertar mensajes corregidos
    console.log('✅ Insertando mensajes corregidos...');
    if (fixedMessages.length > 0) {
      await waachatCollection.insertMany(fixedMessages);
      console.log(`✅ ${fixedMessages.length} mensajes corregidos insertados`);
    }
    
    console.log('\n🎉 Proceso completado exitosamente');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

fixWhatsAppData();
