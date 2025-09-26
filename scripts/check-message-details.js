const mongoose = require('mongoose');

async function checkMessageDetails() {
  try {
    const uri = 'mongodb+srv://rolfisobko:Rolfi2346@abudicell.igpcvgh.mongodb.net/quickcart?retryWrites=true&w=majority&appName=abudicell';
    await mongoose.connect(uri);
    
    const db = mongoose.connection.db;
    const waachatCollection = db.collection('waachat');
    
    console.log('🔍 Verificando detalles de los mensajes...');
    const messages = await waachatCollection.find({}).toArray();
    
    messages.forEach((msg, index) => {
      console.log(`\n📝 Mensaje ${index + 1}:`);
      console.log(`  _id: ${msg._id}`);
      console.log(`  direction: ${msg.direction}`);
      console.log(`  contact_name: ${msg.contact_name}`);
      console.log(`  contact_wa_id: ${msg.contact_wa_id}`);
      console.log(`  message_text: "${msg.message_text}"`);
      console.log(`  timestamp: ${msg.timestamp}`);
      console.log(`  message_id: ${msg.message_id}`);
      console.log(`  Todos los campos:`, JSON.stringify(msg, null, 2));
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

checkMessageDetails();
