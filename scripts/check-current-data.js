const mongoose = require('mongoose');

async function checkCurrentData() {
  try {
    const uri = 'mongodb+srv://rolfisobko:Rolfi2346@abudicell.igpcvgh.mongodb.net/quickcart?retryWrites=true&w=majority&appName=abudicell';
    await mongoose.connect(uri);
    
    const db = mongoose.connection.db;
    const waachatCollection = db.collection('waachat');
    
    console.log('🔍 Verificando datos actuales en la BD...');
    const docs = await waachatCollection.find({}).toArray();
    console.log(`📊 Total documentos: ${docs.length}`);
    
    docs.forEach((doc, index) => {
      console.log(`\n📝 Documento ${index + 1}:`);
      console.log(`  _id: ${doc._id}`);
      console.log(`  direction: ${doc.direction}`);
      console.log(`  contact_name: ${doc.contact_name}`);
      console.log(`  contact_wa_id: ${doc.contact_wa_id}`);
      console.log(`  message_text: ${doc.message_text}`);
      console.log(`  timestamp: ${doc.timestamp}`);
      console.log(`  message_id: ${doc.message_id}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

checkCurrentData();
