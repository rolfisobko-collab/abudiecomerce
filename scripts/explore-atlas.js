const mongoose = require('mongoose');
require('dotenv').config();

async function exploreAtlas() {
  try {
    console.log('🔍 [ATLAS DEBUG] Conectando a MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ [ATLAS DEBUG] Conectado a MongoDB Atlas');
    
    const admin = mongoose.connection.db.admin();
    
    console.log('🔍 [ATLAS DEBUG] Listando todas las bases de datos...');
    const dbs = await admin.listDatabases();
    console.log('📊 [ATLAS DEBUG] Bases de datos encontradas:');
    dbs.databases.forEach(db => {
      console.log(`  - ${db.name} (${db.sizeOnDisk} bytes)`);
    });
    
    // Explorar cada base de datos
    for (const dbInfo of dbs.databases) {
      if (dbInfo.name !== 'admin' && dbInfo.name !== 'local') {
        console.log(`\n🔍 [ATLAS DEBUG] Explorando base de datos: ${dbInfo.name}`);
        
        try {
          const db = mongoose.connection.client.db(dbInfo.name);
          const collections = await db.listCollections().toArray();
          
          console.log(`📋 [ATLAS DEBUG] Colecciones en ${dbInfo.name}:`);
          collections.forEach(col => {
            console.log(`  - ${col.name}`);
          });
          
          // Buscar colecciones relacionadas con WhatsApp
          const whatsappCollections = collections.filter(col => 
            col.name.toLowerCase().includes('whatsapp') || 
            col.name.toLowerCase().includes('waachat') ||
            col.name.toLowerCase().includes('chat') ||
            col.name.toLowerCase().includes('message') ||
            col.name.toLowerCase().includes('wa')
          );
          
          if (whatsappCollections.length > 0) {
            console.log(`📱 [ATLAS DEBUG] Colecciones de WhatsApp en ${dbInfo.name}:`);
            whatsappCollections.forEach(col => {
              console.log(`  - ${col.name}`);
            });
            
            // Explorar cada colección de WhatsApp
            for (const col of whatsappCollections) {
              console.log(`\n🔍 [ATLAS DEBUG] Explorando colección: ${col.name}`);
              const collection = db.collection(col.name);
              const count = await collection.countDocuments();
              console.log(`📊 [ATLAS DEBUG] Documentos en ${col.name}: ${count}`);
              
              if (count > 0) {
                console.log(`🔍 [ATLAS DEBUG] Mostrando estructura de documentos en ${col.name}:`);
                const sampleDocs = await collection.find({}).limit(2).toArray();
                sampleDocs.forEach((doc, index) => {
                  console.log(`📝 [ATLAS DEBUG] Documento ${index + 1}:`);
                  console.log(`  _id: ${doc._id}`);
                  console.log(`  Campos: ${Object.keys(doc).join(', ')}`);
                  console.log(`  Estructura:`, JSON.stringify(doc, null, 2));
                  console.log('---');
                });
              }
            }
          }
        } catch (error) {
          console.log(`⚠️ [ATLAS DEBUG] Error explorando ${dbInfo.name}:`, error.message);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ [ATLAS DEBUG] Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 [ATLAS DEBUG] Conexión cerrada');
  }
}

exploreAtlas();
