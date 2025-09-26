const mongoose = require('mongoose');
require('dotenv').config();

async function connectToQuickcartCorrect() {
  try {
    console.log('🔍 [QUICKCART CORRECT] Conectando a MongoDB Atlas...');
    console.log('🔍 [QUICKCART CORRECT] URI original:', process.env.MONGODB_URI);
    
    // Conectar a la base de datos quickcart correctamente
    const uri = process.env.MONGODB_URI;
    const quickcartUri = uri.replace(/\/[^?]*/, '/quickcart');
    console.log('🔍 [QUICKCART CORRECT] URI modificada:', quickcartUri);
    
    await mongoose.connect(quickcartUri);
    console.log('✅ [QUICKCART CORRECT] Conectado a MongoDB Atlas');
    
    const db = mongoose.connection.db;
    console.log('🔍 [QUICKCART CORRECT] Base de datos conectada:', db.databaseName);
    
    const waachatCollection = db.collection('waachat');
    
    console.log('🔍 [QUICKCART CORRECT] Verificando documentos en waachat...');
    const count = await waachatCollection.countDocuments();
    console.log(`📊 [QUICKCART CORRECT] Total documentos: ${count}`);
    
    if (count > 0) {
      console.log('🔍 [QUICKCART CORRECT] Obteniendo documentos...');
      const allDocs = await waachatCollection.find({}).toArray();
      console.log(`📊 [QUICKCART CORRECT] Documentos obtenidos: ${allDocs.length}`);
      
      allDocs.forEach((doc, index) => {
        console.log(`\n📝 [QUICKCART CORRECT] Documento ${index + 1}:`);
        console.log(`  _id: ${doc._id}`);
        console.log(`  Campos: ${Object.keys(doc).join(', ')}`);
        console.log(`  Estructura completa:`, JSON.stringify(doc, null, 2));
      });
    } else {
      console.log('⚠️ [QUICKCART CORRECT] No hay documentos en la colección');
    }
    
  } catch (error) {
    console.error('❌ [QUICKCART CORRECT] Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 [QUICKCART CORRECT] Conexión cerrada');
  }
}

connectToQuickcartCorrect();
