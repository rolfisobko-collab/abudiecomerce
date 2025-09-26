import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function checkWaachatCollection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
    
    // Especificar la base de datos 'quickcart'
    const waachatDb = mongoose.connection.useDb('quickcart');
    const waachatCollection = waachatDb.collection('waachat');
    
    console.log('🔍 Usando base de datos: quickcart');
    console.log('🔍 Colección: waachat');
    
    // Obtener todos los documentos
    const allDocuments = await waachatCollection.find({}).toArray();
    console.log('📊 Total documentos en waachat:', allDocuments.length);
    
    if (allDocuments.length > 0) {
      console.log('🔍 Primer documento completo:');
      console.log(JSON.stringify(allDocuments[0], null, 2));
      
      console.log('🔍 Segundo documento completo:');
      console.log(JSON.stringify(allDocuments[1], null, 2));
      
      console.log('🔍 Tercer documento completo:');
      console.log(JSON.stringify(allDocuments[2], null, 2));
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkWaachatCollection();
