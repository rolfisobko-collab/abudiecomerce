const mongoose = require('mongoose');

async function cleanEmptyMessages() {
  try {
    const uri = 'mongodb+srv://rolfisobko:Rolfi2346@abudicell.igpcvgh.mongodb.net/quickcart?retryWrites=true&w=majority&appName=abudicell';
    await mongoose.connect(uri);
    
    const db = mongoose.connection.db;
    const waachatCollection = db.collection('waachat');
    
    console.log('🔍 Limpiando mensajes vacíos...');
    
    // Eliminar mensajes que no tienen contact_wa_id
    const deleteResult = await waachatCollection.deleteMany({
      contact_wa_id: { $exists: false }
    });
    
    console.log(`🗑️ Eliminados ${deleteResult.deletedCount} mensajes vacíos`);
    
    // Verificar mensajes restantes
    const remainingMessages = await waachatCollection.find({}).toArray();
    console.log(`📊 Mensajes restantes: ${remainingMessages.length}`);
    
    remainingMessages.forEach((msg, index) => {
      console.log(`📝 Mensaje ${index + 1}:`);
      console.log(`  direction: ${msg.direction}`);
      console.log(`  contact_name: ${msg.contact_name}`);
      console.log(`  contact_wa_id: ${msg.contact_wa_id}`);
      console.log(`  message_text: ${msg.message_text}`);
      console.log(`  timestamp: ${msg.timestamp}`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

cleanEmptyMessages();
