const mongoose = require('mongoose');

async function checkRecentMessages() {
  try {
    const uri = 'mongodb+srv://rolfisobko:Rolfi2346@abudicell.igpcvgh.mongodb.net/quickcart?retryWrites=true&w=majority&appName=abudicell';
    await mongoose.connect(uri);
    
    const db = mongoose.connection.db;
    const waachatCollection = db.collection('waachat');
    
    console.log('🔍 Verificando mensajes más recientes...');
    
    // Obtener todos los mensajes ordenados por created_at
    const messages = await waachatCollection.find({}).sort({ created_at: -1 }).toArray();
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
    
    // Verificar si hay mensajes con timestamps más recientes
    const now = Date.now();
    const recentMessages = messages.filter(msg => {
      const msgTime = msg.timestamp * 1000; // Convertir a milisegundos
      const diffHours = (now - msgTime) / (1000 * 60 * 60);
      return diffHours < 24; // Mensajes de las últimas 24 horas
    });
    
    console.log(`\n🕐 Mensajes de las últimas 24 horas: ${recentMessages.length}`);
    
    if (recentMessages.length === 0) {
      console.log('⚠️ No hay mensajes recientes. Los mensajes actuales son:');
      messages.forEach((msg, index) => {
        const msgTime = new Date(msg.timestamp * 1000);
        const diffHours = (now - msg.timestamp * 1000) / (1000 * 60 * 60);
        console.log(`  ${index + 1}. ${msg.contact_name} - "${msg.message_text}" (hace ${Math.round(diffHours)} horas)`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

checkRecentMessages();
