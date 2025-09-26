const mongoose = require('mongoose');
require('dotenv').config();

async function connectToQuickcart() {
  try {
    console.log('🔍 [QUICKCART CONNECT] Conectando a MongoDB Atlas...');
    console.log('🔍 [QUICKCART CONNECT] URI:', process.env.MONGODB_URI);
    
    // Forzar conexión a la base de datos quickcart
    const uri = process.env.MONGODB_URI;
    const quickcartUri = uri.replace(/\/[^?]*/, '/quickcart');
    console.log('🔍 [QUICKCART CONNECT] URI modificada:', quickcartUri);
    
    await mongoose.connect(quickcartUri);
    console.log('✅ [QUICKCART CONNECT] Conectado a MongoDB Atlas');
    
    const db = mongoose.connection.db;
    console.log('🔍 [QUICKCART CONNECT] Base de datos conectada:', db.databaseName);
    
    const waachatCollection = db.collection('waachat');
    
    console.log('🔍 [QUICKCART CONNECT] Verificando documentos en waachat...');
    const count = await waachatCollection.countDocuments();
    console.log(`📊 [QUICKCART CONNECT] Total documentos: ${count}`);
    
    if (count > 0) {
      console.log('🔍 [QUICKCART CONNECT] Obteniendo documentos...');
      const allDocs = await waachatCollection.find({}).toArray();
      console.log(`📊 [QUICKCART CONNECT] Documentos obtenidos: ${allDocs.length}`);
      
      allDocs.forEach((doc, index) => {
        console.log(`\n📝 [QUICKCART CONNECT] Documento ${index + 1}:`);
        console.log(`  _id: ${doc._id}`);
        console.log(`  Campos: ${Object.keys(doc).join(', ')}`);
        console.log(`  Estructura completa:`, JSON.stringify(doc, null, 2));
      });
    } else {
      console.log('⚠️ [QUICKCART CONNECT] No hay documentos en la colección');
    }
    
  } catch (error) {
    console.error('❌ [QUICKCART CONNECT] Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 [QUICKCART CONNECT] Conexión cerrada');
  }
}

connectToQuickcart();
