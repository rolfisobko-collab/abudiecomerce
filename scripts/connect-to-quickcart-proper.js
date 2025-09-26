const mongoose = require('mongoose');
require('dotenv').config();

async function connectToQuickcartProper() {
  try {
    console.log('🔍 [QUICKCART PROPER] Conectando a MongoDB Atlas...');
    console.log('🔍 [QUICKCART PROPER] URI original:', process.env.MONGODB_URI);
    
    // Conectar a la base de datos quickcart correctamente
    const uri = process.env.MONGODB_URI;
    const quickcartUri = uri.replace(/\/[^?]*/, '/quickcart');
    console.log('🔍 [QUICKCART PROPER] URI modificada:', quickcartUri);
    
    await mongoose.connect(quickcartUri);
    console.log('✅ [QUICKCART PROPER] Conectado a MongoDB Atlas');
    
    const db = mongoose.connection.db;
    console.log('🔍 [QUICKCART PROPER] Base de datos conectada:', db.databaseName);
    
    const waachatCollection = db.collection('waachat');
    
    console.log('🔍 [QUICKCART PROPER] Verificando documentos en waachat...');
    const count = await waachatCollection.countDocuments();
    console.log(`📊 [QUICKCART PROPER] Total documentos: ${count}`);
    
    if (count > 0) {
      console.log('🔍 [QUICKCART PROPER] Obteniendo documentos...');
      const allDocs = await waachatCollection.find({}).toArray();
      console.log(`📊 [QUICKCART PROPER] Documentos obtenidos: ${allDocs.length}`);
      
      allDocs.forEach((doc, index) => {
        console.log(`\n📝 [QUICKCART PROPER] Documento ${index + 1}:`);
        console.log(`  _id: ${doc._id}`);
        console.log(`  Campos: ${Object.keys(doc).join(', ')}`);
        console.log(`  Estructura completa:`, JSON.stringify(doc, null, 2));
      });
    } else {
      console.log('⚠️ [QUICKCART PROPER] No hay documentos en la colección');
    }
    
  } catch (error) {
    console.error('❌ [QUICKCART PROPER] Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 [QUICKCART PROPER] Conexión cerrada');
  }
}

connectToQuickcartProper();
