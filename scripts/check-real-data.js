const mongoose = require('mongoose');
require('dotenv').config();

async function checkRealData() {
  try {
    console.log('🔍 [REAL DATA DEBUG] Conectando a la base de datos...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ [REAL DATA DEBUG] Conectado a MongoDB');
    
    const db = mongoose.connection.db;
    
    // Listar todas las colecciones
    console.log('🔍 [REAL DATA DEBUG] Listando todas las colecciones...');
    const collections = await db.listCollections().toArray();
    console.log('📋 [REAL DATA DEBUG] Colecciones encontradas:');
    collections.forEach(col => {
      console.log(`  - ${col.name}`);
    });
    
    // Buscar colecciones relacionadas con WhatsApp
    const whatsappCollections = collections.filter(col => 
      col.name.toLowerCase().includes('whatsapp') || 
      col.name.toLowerCase().includes('waachat') ||
      col.name.toLowerCase().includes('chat') ||
      col.name.toLowerCase().includes('message')
    );
    
    console.log('📱 [REAL DATA DEBUG] Colecciones relacionadas con WhatsApp:');
    whatsappCollections.forEach(col => {
      console.log(`  - ${col.name}`);
    });
    
    // Verificar si hay datos en waachat
    const waachatCollection = db.collection('waachat');
    const waachatCount = await waachatCollection.countDocuments();
    console.log(`📊 [REAL DATA DEBUG] Mensajes en waachat: ${waachatCount}`);
    
    if (waachatCount > 0) {
      console.log('🔍 [REAL DATA DEBUG] Mostrando estructura de los primeros mensajes...');
      const sampleMessages = await waachatCollection.find({}).limit(3).toArray();
      sampleMessages.forEach((msg, index) => {
        console.log(`📝 [REAL DATA DEBUG] Mensaje ${index + 1}:`);
        console.log(`  _id: ${msg._id}`);
        console.log(`  Campos disponibles: ${Object.keys(msg).join(', ')}`);
        console.log(`  Estructura completa:`, JSON.stringify(msg, null, 2));
        console.log('---');
      });
    }
    
    // Buscar en otras colecciones que puedan tener datos de WhatsApp
    for (const col of collections) {
      if (col.name !== 'waachat') {
        const collection = db.collection(col.name);
        const count = await collection.countDocuments();
        if (count > 0) {
          console.log(`🔍 [REAL DATA DEBUG] Verificando colección ${col.name} (${count} documentos)...`);
          
          // Buscar documentos que puedan contener datos de WhatsApp
          const sampleDocs = await collection.find({}).limit(2).toArray();
          sampleDocs.forEach((doc, index) => {
            const keys = Object.keys(doc);
            const hasWhatsAppFields = keys.some(key => 
              key.toLowerCase().includes('whatsapp') || 
              key.toLowerCase().includes('wa_id') ||
              key.toLowerCase().includes('contact') ||
              key.toLowerCase().includes('message')
            );
            
            if (hasWhatsAppFields) {
              console.log(`📱 [REAL DATA DEBUG] ${col.name} - Documento ${index + 1} tiene campos de WhatsApp:`);
              console.log(`  Campos: ${keys.join(', ')}`);
              console.log(`  Estructura:`, JSON.stringify(doc, null, 2));
              console.log('---');
            }
          });
        }
      }
    }
    
  } catch (error) {
    console.error('❌ [REAL DATA DEBUG] Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 [REAL DATA DEBUG] Conexión cerrada');
  }
}

checkRealData();
