import 'dotenv/config';
import mongoose from 'mongoose';

const analyzeMalformedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    const waachatDb = mongoose.connection.useDb('quickcart');
    const waachatCollection = waachatDb.collection('waachat');

    console.log('🔍 Usando base de datos: quickcart');
    console.log('🔍 Colección: waachat');

    const allMessages = await waachatCollection.find({}).toArray();
    console.log(`📊 Total mensajes en BD: ${allMessages.length}`);

    console.log('\n🔍 ========== ANÁLISIS DETALLADO DE CADA MENSAJE ==========');

    allMessages.forEach((message, index) => {
      console.log(`\n📄 MENSAJE ${index + 1}:`);
      console.log(`ID: ${message._id}`);
      
      // Analizar cada clave del objeto
      Object.keys(message).forEach(key => {
        if (key !== '_id') {
          console.log(`\n🔑 CLAVE: ${key}`);
          console.log(`📝 VALOR: ${message[key]}`);
          
          // Buscar patrones específicos
          if (key.includes('contact_wa_id')) {
            console.log('🎯 ENCONTRADO: contact_wa_id');
          }
          if (key.includes('contact_name')) {
            console.log('🎯 ENCONTRADO: contact_name');
          }
          if (key.includes('message_text')) {
            console.log('🎯 ENCONTRADO: message_text');
          }
          if (key.includes('direction')) {
            console.log('🎯 ENCONTRADO: direction');
          }
          if (key.includes('from')) {
            console.log('🎯 ENCONTRADO: from (mensaje de IA)');
          }
          if (key.includes('bot_reply')) {
            console.log('🎯 ENCONTRADO: bot_reply (mensaje de IA)');
          }
        }
      });
      
      console.log('---');
    });

  } catch (error) {
    console.error('❌ Error al analizar datos malformados:', error);
  } finally {
    await mongoose.disconnect();
  }
};

analyzeMalformedData();
