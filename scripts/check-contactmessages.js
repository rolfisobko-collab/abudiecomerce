const mongoose = require('mongoose');

async function checkContactMessages() {
  try {
    const uri = 'mongodb+srv://rolfisobko:Rolfi2346@abudicell.igpcvgh.mongodb.net/quickcart?retryWrites=true&w=majority&appName=abudicell';
    await mongoose.connect(uri);
    
    const db = mongoose.connection.db;
    const contactMessagesCollection = db.collection('contactmessages');
    
    console.log('🔍 Verificando colección contactmessages...');
    const count = await contactMessagesCollection.countDocuments();
    console.log(`📊 Documentos en contactmessages: ${count}`);
    
    if (count > 0) {
      console.log('📝 Documentos encontrados:');
      const docs = await contactMessagesCollection.find({}).toArray();
      docs.forEach((doc, index) => {
        console.log(`\n📝 Documento ${index + 1}:`);
        console.log(`  _id: ${doc._id}`);
        console.log(`  Campos: ${Object.keys(doc).join(', ')}`);
        console.log(`  Estructura completa:`, JSON.stringify(doc, null, 2));
      });
    } else {
      console.log('⚠️ No hay documentos en contactmessages');
    }
    
    // También verificar si hay mensajes en otras colecciones que puedan contener datos de WhatsApp
    console.log('\n🔍 Buscando mensajes de Rolfi en todas las colecciones...');
    const collections = await db.listCollections().toArray();
    
    for (const col of collections) {
      if (col.name !== 'waachat') {
        const collection = db.collection(col.name);
        const count = await collection.countDocuments();
        
        if (count > 0) {
          // Buscar documentos que contengan "Rolfi" o campos de WhatsApp
          const rolfMessages = await collection.find({
            $or: [
              { contact_name: { $regex: /rolfi/i } },
              { message_text: { $regex: /rolfi/i } },
              { contact_wa_id: { $exists: true } },
              { message_id: { $exists: true } }
            ]
          }).toArray();
          
          if (rolfMessages.length > 0) {
            console.log(`\n📱 Mensajes de Rolfi encontrados en ${col.name}:`);
            rolfMessages.forEach((msg, index) => {
              console.log(`  ${index + 1}. ${msg.contact_name || 'Sin nombre'} - "${msg.message_text || 'Sin texto'}"`);
            });
          }
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

checkContactMessages();
