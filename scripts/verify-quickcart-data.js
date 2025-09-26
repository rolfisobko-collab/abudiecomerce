const mongoose = require('mongoose');
require('dotenv').config();

async function verifyQuickcartData() {
  try {
    console.log('🔍 [VERIFY DEBUG] Conectando a MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ [VERIFY DEBUG] Conectado a MongoDB Atlas');
    
    const db = mongoose.connection.db;
    const waachatCollection = db.collection('waachat');
    
    console.log('🔍 [VERIFY DEBUG] Verificando conexión a la colección...');
    console.log('🔍 [VERIFY DEBUG] Nombre de la base de datos:', db.databaseName);
    console.log('🔍 [VERIFY DEBUG] Nombre de la colección: waachat');
    
    console.log('🔍 [VERIFY DEBUG] Contando documentos...');
    const count = await waachatCollection.countDocuments();
    console.log(`📊 [VERIFY DEBUG] Total documentos: ${count}`);
    
    if (count > 0) {
      console.log('🔍 [VERIFY DEBUG] Obteniendo todos los documentos...');
      const allDocs = await waachatCollection.find({}).toArray();
      console.log(`📊 [VERIFY DEBUG] Documentos obtenidos: ${allDocs.length}`);
      
      allDocs.forEach((doc, index) => {
        console.log(`\n📝 [VERIFY DEBUG] Documento ${index + 1}:`);
        console.log(`  _id: ${doc._id}`);
        console.log(`  Campos: ${Object.keys(doc).join(', ')}`);
        console.log(`  Estructura completa:`, JSON.stringify(doc, null, 2));
      });
    } else {
      console.log('⚠️ [VERIFY DEBUG] No hay documentos en la colección');
    }
    
    // Verificar si hay documentos en otras colecciones
    console.log('\n🔍 [VERIFY DEBUG] Verificando otras colecciones...');
    const collections = await db.listCollections().toArray();
    console.log('📋 [VERIFY DEBUG] Colecciones disponibles:');
    collections.forEach(col => {
      console.log(`  - ${col.name}`);
    });
    
    // Buscar en todas las colecciones
    for (const col of collections) {
      if (col.name.toLowerCase().includes('waachat') || col.name.toLowerCase().includes('whatsapp')) {
        console.log(`\n🔍 [VERIFY DEBUG] Verificando colección: ${col.name}`);
        const collection = db.collection(col.name);
        const count = await collection.countDocuments();
        console.log(`📊 [VERIFY DEBUG] Documentos en ${col.name}: ${count}`);
        
        if (count > 0) {
          const sampleDocs = await collection.find({}).limit(2).toArray();
          sampleDocs.forEach((doc, index) => {
            console.log(`📝 [VERIFY DEBUG] Documento ${index + 1} en ${col.name}:`);
            console.log(`  _id: ${doc._id}`);
            console.log(`  Campos: ${Object.keys(doc).join(', ')}`);
            console.log(`  Estructura:`, JSON.stringify(doc, null, 2));
            console.log('---');
          });
        }
      }
    }
    
  } catch (error) {
    console.error('❌ [VERIFY DEBUG] Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 [VERIFY DEBUG] Conexión cerrada');
  }
}

verifyQuickcartData();
