const mongoose = require('mongoose');
require('dotenv').config();

async function checkWhatsAppData() {
  try {
    console.log('🔍 [BD DEBUG] Conectando a la base de datos...');
    console.log('🔍 [BD DEBUG] URI:', process.env.MONGODB_URI ? 'Configurada' : '❌ NO CONFIGURADA');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ [BD DEBUG] Conectado a MongoDB');
    
    const db = mongoose.connection.db;
    
    // Listar todas las colecciones
    const collections = await db.listCollections().toArray();
    console.log('📋 [BD DEBUG] Colecciones disponibles:');
    collections.forEach(col => {
      console.log(`  - ${col.name}`);
    });
    
    // Buscar colecciones relacionadas con WhatsApp
    const whatsappCollections = collections.filter(col => 
      col.name.toLowerCase().includes('whatsapp') || 
      col.name.toLowerCase().includes('waachat') ||
      col.name.toLowerCase().includes('waatch') ||
      col.name.toLowerCase().includes('chat')
    );
    
    console.log('\n💬 [BD DEBUG] Colecciones de WhatsApp encontradas:');
    whatsappCollections.forEach(col => {
      console.log(`  - ${col.name}`);
    });
    
    // Revisar cada colección de WhatsApp
    for (const col of whatsappCollections) {
      console.log(`\n🔍 [BD DEBUG] Analizando colección: ${col.name}`);
      
      const collection = db.collection(col.name);
      const count = await collection.countDocuments();
      console.log(`  📊 Total documentos: ${count}`);
      
      if (count > 0) {
        // Obtener algunos documentos de ejemplo
        const samples = await collection.find({}).limit(3).toArray();
        console.log(`  📝 Estructura de datos (primeros 3 documentos):`);
        samples.forEach((doc, index) => {
          console.log(`    Documento ${index + 1}:`);
          console.log(`      ID: ${doc._id}`);
          console.log(`      Campos: ${Object.keys(doc).join(', ')}`);
          
          // Mostrar algunos campos importantes
          if (doc.contact_name || doc.contact_wa_id) {
            console.log(`      Contacto: ${doc.contact_name || doc.contact_wa_id}`);
          }
          if (doc.message_text || doc.message) {
            console.log(`      Mensaje: ${(doc.message_text || doc.message || '').substring(0, 50)}...`);
          }
          if (doc.timestamp || doc.createdAt) {
            console.log(`      Fecha: ${doc.timestamp || doc.createdAt}`);
          }
          if (doc.direction) {
            console.log(`      Dirección: ${doc.direction}`);
          }
          console.log('');
        });
        
        // Contar por dirección si existe
        if (samples.some(doc => doc.direction)) {
          const directionCount = await collection.aggregate([
            { $group: { _id: '$direction', count: { $sum: 1 } } }
          ]).toArray();
          console.log(`  📈 Mensajes por dirección:`);
          directionCount.forEach(dir => {
            console.log(`    ${dir._id}: ${dir.count}`);
          });
        }
        
        // Contar contactos únicos si existe
        if (samples.some(doc => doc.contact_wa_id || doc.contact_name)) {
          const uniqueContacts = await collection.distinct('contact_wa_id');
          console.log(`  👥 Contactos únicos: ${uniqueContacts.length}`);
        }
      }
    }
    
    // Si no hay colecciones de WhatsApp, buscar en todas las colecciones
    if (whatsappCollections.length === 0) {
      console.log('\n⚠️ [BD DEBUG] No se encontraron colecciones específicas de WhatsApp');
      console.log('🔍 [BD DEBUG] Revisando todas las colecciones para datos de chat...');
      
      for (const col of collections.slice(0, 10)) { // Revisar solo las primeras 10
        const collection = db.collection(col.name);
        const count = await collection.countDocuments();
        
        if (count > 0) {
          const sample = await collection.findOne({});
          if (sample && (
            sample.contact_name || 
            sample.contact_wa_id || 
            sample.message_text || 
            sample.message ||
            sample.direction
          )) {
            console.log(`\n💬 [BD DEBUG] Posible colección de chat: ${col.name}`);
            console.log(`  📊 Total documentos: ${count}`);
            console.log(`  📝 Estructura: ${Object.keys(sample).join(', ')}`);
          }
        }
      }
    }
    
  } catch (error) {
    console.error('❌ [BD DEBUG] Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 [BD DEBUG] Conexión cerrada');
  }
}

checkWhatsAppData();