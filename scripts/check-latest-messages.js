const mongoose = require('mongoose');

async function checkLatestMessages() {
  try {
    const uri = 'mongodb+srv://rolfisobko:Rolfi2346@abudicell.igpcvgh.mongodb.net/quickcart?retryWrites=true&w=majority&appName=abudicell';
    await mongoose.connect(uri);
    
    const db = mongoose.connection.db;
    const waachatCollection = db.collection('waachat');
    
    console.log('🔍 Verificando mensajes más recientes...');
    
    // Obtener todos los mensajes ordenados por timestamp
    const messages = await waachatCollection.find({}).sort({ timestamp: -1 }).toArray();
    console.log(`📊 Total mensajes: ${messages.length}`);
    
    messages.forEach((msg, index) => {
      console.log(`\n📝 Mensaje ${index + 1} (más reciente primero):`);
      console.log(`  _id: ${msg._id}`);
      console.log(`  direction: ${msg.direction}`);
      console.log(`  contact_name: ${msg.contact_name}`);
      console.log(`  contact_wa_id: ${msg.contact_wa_id}`);
      console.log(`  message_text: "${msg.message_text}"`);
      console.log(`  timestamp: ${msg.timestamp}`);
      console.log(`  created_at: ${msg.created_at}`);
    });
    
    // Buscar mensajes con texto específico
    console.log('\n🔍 Buscando mensajes con texto...');
    const messagesWithText = await waachatCollection.find({
      message_text: { $exists: true, $ne: null, $ne: "" }
    }).toArray();
    
    console.log(`📝 Mensajes con texto: ${messagesWithText.length}`);
    messagesWithText.forEach((msg, index) => {
      console.log(`  ${index + 1}. "${msg.message_text}" (${msg.direction})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

checkLatestMessages();
