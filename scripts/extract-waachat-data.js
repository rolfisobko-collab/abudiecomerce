import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function extractWaachatData() {
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
    
    console.log('\n🔍 ========== TODOS LOS OBJETOS ENCONTRADOS ==========\n');
    
    allDocuments.forEach((doc, index) => {
      console.log(`📄 DOCUMENTO ${index + 1}:`);
      console.log('ID:', doc._id);
      
      // Extraer datos de las claves
      const keys = Object.keys(doc);
      keys.forEach(key => {
        if (key !== '_id') {
          // Extraer el valor antes de los dos puntos
          const value = key.split(':')[0];
          console.log(`  ${value}`);
        }
      });
      console.log('---\n');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

extractWaachatData();
