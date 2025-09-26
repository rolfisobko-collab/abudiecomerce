const mongoose = require('mongoose');

async function getWhatsAppData() {
  try {
    // Usar la URI correcta que me diste
    const uri = 'mongodb+srv://rolfisobko:Rolfi2346@abudicell.igpcvgh.mongodb.net/quickcart?retryWrites=true&w=majority&appName=abudicell';
    console.log('Conectando a:', uri);
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
