const mongoose = require('mongoose');
require('dotenv').config();

async function readMalformedData() {
  try {
    console.log('🔍 [MALFORMED DEBUG] Conectando a la base de datos...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ [MALFORMED DEBUG] Conectado a MongoDB');
    
    const db = mongoose.connection.db;
    const waachatCollection = db.collection('waachat');
    
    console.log('🔍 [MALFORMED DEBUG] Obteniendo todos los documentos...');
    const allDocs = await waachatCollection.find({}).toArray();
    console.log(`📊 [MALFORMED DEBUG] Total documentos: ${allDocs.length}`);
    
    allDocs.forEach((doc, index) => {
      console.log(`\n📝 [MALFORMED DEBUG] Documento ${index + 1}:`);
      console.log(`  _id: ${doc._id}`);
      console.log(`  Claves disponibles: ${Object.keys(doc).join(', ')}`);
      console.log(`  Estructura completa:`, JSON.stringify(doc, null, 2));
      
      // Intentar extraer datos de las claves malformadas
      console.log(`\n🔍 [MALFORMED DEBUG] Intentando extraer datos del documento ${index + 1}:`);
      
      Object.keys(doc).forEach(key => {
        if (key !== '_id' && key.includes('"')) {
          console.log(`  Clave malformada: "${key}"`);
          
          // Intentar extraer valores de las claves que contienen JSON
          if (key.includes('direction')) {
            console.log(`    -> direction: ${doc[key]}`);
          }
          if (key.includes('contact_name')) {
            console.log(`    -> contact_name: ${doc[key]}`);
          }
          if (key.includes('contact_wa_id')) {
            console.log(`    -> contact_wa_id: ${doc[key]}`);
          }
          if (key.includes('message_text')) {
            console.log(`    -> message_text: ${doc[key]}`);
          }
          if (key.includes('timestamp')) {
            console.log(`    -> timestamp: ${doc[key]}`);
          }
          if (key.includes('message_id')) {
            console.log(`    -> message_id: ${doc[key]}`);
          }
        }
      });
    });
    
    // Intentar reconstruir los datos correctamente
    console.log('\n🔧 [MALFORMED DEBUG] Intentando reconstruir datos correctamente...');
    
    const reconstructedMessages = allDocs.map((doc, index) => {
      const reconstructed = {
        _id: doc._id,
        direction: null,
        contact_name: null,
        contact_wa_id: null,
        message_text: null,
        timestamp: null,
        message_id: null
      };
      
      // Buscar en las claves malformadas
      Object.keys(doc).forEach(key => {
        if (key.includes('direction') && key.includes('in')) {
          reconstructed.direction = 'in';
        } else if (key.includes('direction') && key.includes('out')) {
          reconstructed.direction = 'out';
        }
        
        if (key.includes('contact_name')) {
          const match = key.match(/"contact_name":\s*([^"]+)/);
          if (match) {
            reconstructed.contact_name = match[1];
          }
        }
        
        if (key.includes('contact_wa_id')) {
          const match = key.match(/"contact_wa_id":\s*([^"]+)/);
          if (match) {
            reconstructed.contact_wa_id = match[1];
          }
        }
        
        if (key.includes('message_text')) {
          const match = key.match(/"message_text":\s*([^"]+)/);
          if (match) {
            reconstructed.message_text = match[1];
          }
        }
        
        if (key.includes('timestamp')) {
          const match = key.match(/"timestamp":\s*([^"]+)/);
          if (match) {
            reconstructed.timestamp = parseInt(match[1]);
          }
        }
        
        if (key.includes('message_id')) {
          const match = key.match(/"message_id":\s*([^"]+)/);
          if (match) {
            reconstructed.message_id = match[1];
          }
        }
      });
      
      console.log(`📱 [MALFORMED DEBUG] Mensaje ${index + 1} reconstruido:`, reconstructed);
      return reconstructed;
    });
    
    console.log('\n✅ [MALFORMED DEBUG] Datos reconstruidos:');
    reconstructedMessages.forEach((msg, index) => {
      console.log(`📝 Mensaje ${index + 1}:`);
      console.log(`  Direction: ${msg.direction}`);
      console.log(`  Contact: ${msg.contact_name} (${msg.contact_wa_id})`);
      console.log(`  Text: ${msg.message_text}`);
      console.log(`  Timestamp: ${msg.timestamp}`);
      console.log(`  Message ID: ${msg.message_id}`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('❌ [MALFORMED DEBUG] Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 [MALFORMED DEBUG] Conexión cerrada');
  }
}

readMalformedData();
