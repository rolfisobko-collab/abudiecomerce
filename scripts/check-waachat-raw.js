const mongoose = require('mongoose');

async function checkWaachatRaw() {
  try {
    const uri = 'mongodb+srv://rolfisobko:Rolfi2346@abudicell.igpcvgh.mongodb.net/quickcart?retryWrites=true&w=majority&appName=abudicell';
    await mongoose.connect(uri);
    
    const db = mongoose.connection.db;
    const waachatCollection = db.collection('waachat');
    
    console.log('🔍 Verificando colección waachat SIN FILTROS...');
    
    // Contar TODOS los documentos sin filtros
    const totalCount = await waachatCollection.countDocuments();
    console.log(`📊 TOTAL documentos en waachat: ${totalCount}`);
    
    // Obtener TODOS los documentos sin filtros
    const allDocs = await waachatCollection.find({}).toArray();
    console.log(`📝 Documentos obtenidos: ${allDocs.length}`);
    
    allDocs.forEach((doc, index) => {
      console.log(`\n📝 Documento ${index + 1}:`);
      console.log(`  _id: ${doc._id}`);
      console.log(`  Campos disponibles: ${Object.keys(doc).join(', ')}`);
      console.log(`  Estructura completa:`, JSON.stringify(doc, null, 2));
    });
    
    // Verificar si hay documentos con diferentes estructuras
    console.log('\n🔍 Verificando estructuras de documentos...');
    const structures = new Map();
    
    allDocs.forEach(doc => {
      const key = Object.keys(doc).sort().join(',');
      if (!structures.has(key)) {
        structures.set(key, []);
      }
      structures.get(key).push(doc);
    });
    
    console.log(`📊 Estructuras diferentes encontradas: ${structures.size}`);
    structures.forEach((docs, structure) => {
      console.log(`\n📋 Estructura: ${structure}`);
      console.log(`📝 Documentos con esta estructura: ${docs.length}`);
      docs.forEach((doc, index) => {
        console.log(`  ${index + 1}. _id: ${doc._id}`);
        if (doc.contact_name) console.log(`     contact_name: ${doc.contact_name}`);
        if (doc.message_text) console.log(`     message_text: ${doc.message_text}`);
        if (doc.direction) console.log(`     direction: ${doc.direction}`);
      });
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

checkWaachatRaw();
