const mongoose = require('mongoose');
require('dotenv').config();

async function connectToQuickcartFinal() {
  try {
    console.log('🔍 [QUICKCART FINAL] Conectando a MongoDB Atlas...');
    console.log('🔍 [QUICKCART FINAL] URI original:', process.env.MONGODB_URI);
    
    // Conectar a la base de datos quickcart correctamente
    const uri = process.env.MONGODB_URI;
    const quickcartUri = uri.replace(/\/[^?]*/, '/quickcart');
    console.log('🔍 [QUICKCART FINAL] URI modificada:', quickcartUri);
    
    await mongoose.connect(quickcartUri);
    console.log('✅ [QUICKCART FINAL] Conectado a MongoDB Atlas');
    
    const db = mongoose.connection.db;
    console.log('🔍 [QUICKCART FINAL] Base de datos conectada:', db.databaseName);
    
    const waachatCollection = db.collection('waachat');
    
    console.log('🔍 [QUICKCART FINAL] Verificando documentos en waachat...');
    const count = await waachatCollection.countDocuments();
    console.log(`📊 [QUICKCART FINAL] Total documentos: ${count}`);
    
    if (count > 0) {
      console.log('🔍 [QUICKCART FINAL] Obteniendo documentos...');
      const allDocs = await waachatCollection.find({}).toArray();
      console.log(`📊 [QUICKCART FINAL] Documentos obtenidos: ${allDocs.length}`);
      
      allDocs.forEach((doc, index) => {
        console.log(`\n📝 [QUICKCART FINAL] Documento ${index + 1}:`);
        console.log(`  _id: ${doc._id}`);
        console.log(`  Campos: ${Object.keys(doc).join(', ')}`);
        console.log(`  Estructura completa:`, JSON.stringify(doc, null, 2));
      });
    } else {
      console.log('⚠️ [QUICKCART FINAL] No hay documentos en la colección');
    }
    
  } catch (error) {
    console.error('❌ [QUICKCART FINAL] Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 [QUICKCART FINAL] Conexión cerrada');
  }
}

connectToQuickcartFinal();
