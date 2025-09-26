const mongoose = require('mongoose');
require('dotenv').config();

async function connectToQuickcartFixed() {
  try {
    console.log('🔍 [QUICKCART FIXED] Conectando a MongoDB Atlas...');
    console.log('🔍 [QUICKCART FIXED] URI original:', process.env.MONGODB_URI);
    
    // Conectar a la base de datos quickcart
    const uri = process.env.MONGODB_URI;
    const quickcartUri = uri.replace(/\/[^?]*/, '/quickcart');
    console.log('🔍 [QUICKCART FIXED] URI modificada:', quickcartUri);
    
    await mongoose.connect(quickcartUri);
    console.log('✅ [QUICKCART FIXED] Conectado a MongoDB Atlas');
    
    const db = mongoose.connection.db;
    console.log('🔍 [QUICKCART FIXED] Base de datos conectada:', db.databaseName);
    
    const waachatCollection = db.collection('waachat');
    
    console.log('🔍 [QUICKCART FIXED] Verificando documentos en waachat...');
    const count = await waachatCollection.countDocuments();
    console.log(`📊 [QUICKCART FIXED] Total documentos: ${count}`);
    
    if (count > 0) {
      console.log('🔍 [QUICKCART FIXED] Obteniendo documentos...');
      const allDocs = await waachatCollection.find({}).toArray();
      console.log(`📊 [QUICKCART FIXED] Documentos obtenidos: ${allDocs.length}`);
      
      allDocs.forEach((doc, index) => {
        console.log(`\n📝 [QUICKCART FIXED] Documento ${index + 1}:`);
        console.log(`  _id: ${doc._id}`);
        console.log(`  Campos: ${Object.keys(doc).join(', ')}`);
        console.log(`  Estructura completa:`, JSON.stringify(doc, null, 2));
      });
    } else {
      console.log('⚠️ [QUICKCART FIXED] No hay documentos en la colección');
    }
    
  } catch (error) {
    console.error('❌ [QUICKCART FIXED] Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 [QUICKCART FIXED] Conexión cerrada');
  }
}

connectToQuickcartFixed();
