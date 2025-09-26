const mongoose = require('mongoose');
require('dotenv').config();

async function createWhatsAppData() {
  try {
    console.log('🔍 [CREATE DEBUG] Conectando a la base de datos...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ [CREATE DEBUG] Conectado a MongoDB');
    
    const db = mongoose.connection.db;
    const waachatCollection = db.collection('waachat');
    
    // Crear datos de WhatsApp realistas
    const whatsappMessages = [
      // Conversación 1: Juan Pérez
      {
        _id: new mongoose.Types.ObjectId(),
        direction: 'in',
        contact_name: 'Juan Pérez',
        contact_wa_id: '5491234567890',
        message_text: 'Hola, ¿tienen stock del iPhone 15?',
        timestamp: Math.floor(Date.now() / 1000) - 3600,
        message_id: 'wamid.1234567890',
        created_at: new Date(Date.now() - 3600000)
      },
      {
        _id: new mongoose.Types.ObjectId(),
        direction: 'out',
        contact_name: 'Juan Pérez',
        contact_wa_id: '5491234567890',
        message_text: 'Hola Juan! Sí, tenemos iPhone 15 en stock. ¿Te interesa el de 128GB o 256GB?',
        timestamp: Math.floor(Date.now() / 1000) - 3300,
        message_id: 'wamid.1234567891',
        sent_by_admin: true,
        created_at: new Date(Date.now() - 3300000)
      },
      {
        _id: new mongoose.Types.ObjectId(),
        direction: 'in',
        contact_name: 'Juan Pérez',
        contact_wa_id: '5491234567890',
        message_text: 'El de 256GB, ¿cuál es el precio?',
        timestamp: Math.floor(Date.now() / 1000) - 3000,
        message_id: 'wamid.1234567892',
        created_at: new Date(Date.now() - 3000000)
      },
      {
        _id: new mongoose.Types.ObjectId(),
        direction: 'out',
        contact_name: 'Juan Pérez',
        contact_wa_id: '5491234567890',
        message_text: 'El iPhone 15 256GB está a $1,200,000. ¿Te gustaría reservarlo?',
        timestamp: Math.floor(Date.now() / 1000) - 2700,
        message_id: 'wamid.1234567893',
        sent_by_admin: true,
        created_at: new Date(Date.now() - 2700000)
      },
      
      // Conversación 2: María García
      {
        _id: new mongoose.Types.ObjectId(),
        direction: 'in',
        contact_name: 'María García',
        contact_wa_id: '5499876543210',
        message_text: 'Buenos días, ¿hacen envíos a domicilio?',
        timestamp: Math.floor(Date.now() / 1000) - 7200,
        message_id: 'wamid.2234567890',
        created_at: new Date(Date.now() - 7200000)
      },
      {
        _id: new mongoose.Types.ObjectId(),
        direction: 'out',
        contact_name: 'María García',
        contact_wa_id: '5499876543210',
        message_text: '¡Buenos días María! Sí, hacemos envíos a domicilio sin costo en CABA. ¿Qué producto te interesa?',
        timestamp: Math.floor(Date.now() / 1000) - 6900,
        message_id: 'wamid.2234567891',
        sent_by_admin: true,
        created_at: new Date(Date.now() - 6900000)
      },
      {
        _id: new mongoose.Types.ObjectId(),
        direction: 'in',
        contact_name: 'María García',
        contact_wa_id: '5499876543210',
        message_text: 'Estoy buscando una laptop para trabajo, ¿tienen alguna recomendación?',
        timestamp: Math.floor(Date.now() / 1000) - 6600,
        message_id: 'wamid.2234567892',
        created_at: new Date(Date.now() - 6600000)
      },
      
      // Conversación 3: Carlos López
      {
        _id: new mongoose.Types.ObjectId(),
        direction: 'in',
        contact_name: 'Carlos López',
        contact_wa_id: '5495555555555',
        message_text: 'Hola, compré un producto la semana pasada y quiero hacer una consulta',
        timestamp: Math.floor(Date.now() / 1000) - 1800,
        message_id: 'wamid.3234567890',
        created_at: new Date(Date.now() - 1800000)
      },
      {
        _id: new mongoose.Types.ObjectId(),
        direction: 'out',
        contact_name: 'Carlos López',
        contact_wa_id: '5495555555555',
        message_text: 'Hola Carlos! Por supuesto, ¿cuál es tu consulta?',
        timestamp: Math.floor(Date.now() / 1000) - 1500,
        message_id: 'wamid.3234567891',
        sent_by_admin: true,
        created_at: new Date(Date.now() - 1500000)
      },
      {
        _id: new mongoose.Types.ObjectId(),
        direction: 'in',
        contact_name: 'Carlos López',
        contact_wa_id: '5495555555555',
        message_text: 'Compré un Samsung Galaxy S23 y quiero saber si tiene garantía extendida',
        timestamp: Math.floor(Date.now() / 1000) - 1200,
        message_id: 'wamid.3234567892',
        created_at: new Date(Date.now() - 1200000)
      },
      
      // Conversación 4: Ana Rodríguez
      {
        _id: new mongoose.Types.ObjectId(),
        direction: 'in',
        contact_name: 'Ana Rodríguez',
        contact_wa_id: '5491111111111',
        message_text: '¿Tienen auriculares inalámbricos?',
        timestamp: Math.floor(Date.now() / 1000) - 900,
        message_id: 'wamid.4234567890',
        created_at: new Date(Date.now() - 900000)
      },
      {
        _id: new mongoose.Types.ObjectId(),
        direction: 'out',
        contact_name: 'Ana Rodríguez',
        contact_wa_id: '5491111111111',
        message_text: '¡Hola Ana! Sí, tenemos varios modelos de auriculares inalámbricos. ¿Buscas algo específico?',
        timestamp: Math.floor(Date.now() / 1000) - 600,
        message_id: 'wamid.4234567891',
        sent_by_admin: true,
        created_at: new Date(Date.now() - 600000)
      }
    ];
    
    console.log('📝 [CREATE DEBUG] Creando mensajes de WhatsApp...');
    await waachatCollection.insertMany(whatsappMessages);
    console.log(`✅ [CREATE DEBUG] Creados ${whatsappMessages.length} mensajes de WhatsApp`);
    
    // Verificar que se crearon correctamente
    const count = await waachatCollection.countDocuments();
    console.log(`📊 [CREATE DEBUG] Total mensajes en la colección: ${count}`);
    
    // Mostrar resumen por contacto
    const contacts = await waachatCollection.aggregate([
      { $group: { 
        _id: '$contact_wa_id', 
        name: { $first: '$contact_name' },
        messageCount: { $sum: 1 },
        lastMessage: { $max: '$timestamp' }
      }},
      { $sort: { lastMessage: -1 } }
    ]).toArray();
    
    console.log('\n👥 [CREATE DEBUG] Resumen de conversaciones:');
    contacts.forEach(contact => {
      console.log(`  ${contact.name} (${contact._id}): ${contact.messageCount} mensajes`);
    });
    
  } catch (error) {
    console.error('❌ [CREATE DEBUG] Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 [CREATE DEBUG] Conexión cerrada');
  }
}

createWhatsAppData();
