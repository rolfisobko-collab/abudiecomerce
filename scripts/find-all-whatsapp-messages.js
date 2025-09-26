const mongoose = require('mongoose');

async function findAllWhatsAppMessages() {
  try {
    const uri = 'mongodb+srv://rolfisobko:Rolfi2346@abudicell.igpcvgh.mongodb.net/quickcart?retryWrites=true&w=majority&appName=abudicell';
    await mongoose.connect(uri);
    
    const db = mongoose.connection.db;
    
    console.log('🔍 Buscando mensajes de WhatsApp en TODAS las colecciones...');
    const collections = await db.listCollections().toArray();
    
    let totalMessages = 0;
    
    for (const col of collections) {
      console.log(`\n📋 Verificando colección: ${col.name}`);
      const collection = db.collection(col.name);
      const count = await collection.countDocuments();
      console.log(`📊 Total documentos: ${count}`);
      
      if (count > 0) {
        // Buscar documentos que puedan contener datos de WhatsApp
        const whatsappDocs = await collection.find({
          $or: [
            { contact_wa_id: { $exists: true } },
            { message_id: { $exists: true } },
            { contact_name: { $regex: /rolfi/i } },
            { message_text: { $regex: /rolfi/i } },
            { direction: { $exists: true } },
            { timestamp: { $exists: true } }
          ]
        }).toArray();
        
        if (whatsappDocs.length > 0) {
          console.log(`📱 Mensajes de WhatsApp encontrados: ${whatsappDocs.length}`);
          whatsappDocs.forEach((doc, index) => {
            console.log(`\n📝 Mensaje ${index + 1}:`);
            console.log(`  _id: ${doc._id}`);
            console.log(`  contact_name: ${doc.contact_name || 'N/A'}`);
            console.log(`  contact_wa_id: ${doc.contact_wa_id || 'N/A'}`);
            console.log(`  message_text: ${doc.message_text || 'N/A'}`);
            console.log(`  direction: ${doc.direction || 'N/A'}`);
            console.log(`  timestamp: ${doc.timestamp || 'N/A'}`);
            console.log(`  Estructura completa:`, JSON.stringify(doc, null, 2));
          });
          totalMessages += whatsappDocs.length;
        } else {
          console.log('⚠️ No se encontraron mensajes de WhatsApp en esta colección');
        }
      }
    }
    
    console.log(`\n📊 TOTAL mensajes de WhatsApp encontrados: ${totalMessages}`);
    
    if (totalMessages === 0) {
      console.log('❌ NO se encontraron mensajes de WhatsApp en ninguna colección');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

findAllWhatsAppMessages();
