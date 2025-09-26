const mongoose = require('mongoose');

async function checkAllCollections() {
  try {
    const uri = 'mongodb+srv://rolfisobko:Rolfi2346@abudicell.igpcvgh.mongodb.net/quickcart?retryWrites=true&w=majority&appName=abudicell';
    await mongoose.connect(uri);
    
    const db = mongoose.connection.db;
    
    console.log('🔍 Verificando TODAS las colecciones...');
    const collections = await db.listCollections().toArray();
    
    for (const col of collections) {
      console.log(`\n📋 Colección: ${col.name}`);
      const collection = db.collection(col.name);
      const count = await collection.countDocuments();
      console.log(`📊 Documentos: ${count}`);
      
      if (count > 0) {
        // Buscar documentos que puedan contener datos de WhatsApp
        const sampleDocs = await collection.find({}).limit(3).toArray();
        sampleDocs.forEach((doc, index) => {
          const keys = Object.keys(doc);
          const hasWhatsAppFields = keys.some(key => 
            key.toLowerCase().includes('whatsapp') || 
            key.toLowerCase().includes('wa_id') ||
            key.toLowerCase().includes('contact') ||
            key.toLowerCase().includes('message') ||
            key.toLowerCase().includes('rolfi')
          );
          
          if (hasWhatsAppFields) {
            console.log(`📱 Documento ${index + 1} con campos de WhatsApp:`);
            console.log(`  Campos: ${keys.join(', ')}`);
            console.log(`  Estructura:`, JSON.stringify(doc, null, 2));
            console.log('---');
          }
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

checkAllCollections();
