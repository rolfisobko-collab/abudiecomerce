const mongoose = require('mongoose');
require('dotenv').config();

async function getWhatsAppData() {
  try {
    // Conectar directamente a la BD quickcart
    const uri = process.env.MONGODB_URI.replace(/\/[^?]*/, '/quickcart');
    console.log('URI original:', process.env.MONGODB_URI);
    console.log('URI modificada:', uri);
    await mongoose.connect(uri);
    
    const db = mongoose.connection.db;
    const waachatCollection = db.collection('waachat');
    
    // Obtener todos los documentos
    const docs = await waachatCollection.find({}).toArray();
    console.log(`📊 Documentos encontrados: ${docs.length}`);
    
    docs.forEach((doc, index) => {
      console.log(`\n📝 Documento ${index + 1}:`);
      console.log(JSON.stringify(doc, null, 2));
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

getWhatsAppData();
