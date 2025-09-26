import { NextResponse } from 'next/server'
import mongoose from 'mongoose'

// API para obtener chats reales de WhatsApp desde la BD
export async function GET(request) {
  try {
    console.log('🔍 [API DEBUG] ========== INICIANDO API DE CHATS ==========')
    
    // Conectar a MongoDB
    if (mongoose.connection.readyState !== 1) {
      console.log('🔍 [API DEBUG] Conectando a MongoDB...')
      await mongoose.connect(process.env.MONGODB_URI)
      console.log('✅ [API DEBUG] Conectado a MongoDB')
    } else {
      console.log('✅ [API DEBUG] Ya conectado a MongoDB')
    }
    
    const db = mongoose.connection.db
    const waachatCollection = db.collection('waachat')
    
    console.log('🔍 [API DEBUG] Conectado a la colección waachat')
    
    // Obtener todos los mensajes de la BD
    console.log('🔍 [API DEBUG] Obteniendo mensajes de la BD...')
    const allMessages = await waachatCollection.find({}).toArray()
    console.log('📊 [API DEBUG] Total mensajes en BD:', allMessages.length)
    
    // Debug: mostrar la estructura del primer mensaje
    if (allMessages.length > 0) {
      console.log('🔍 [API DEBUG] Estructura del primer mensaje:', {
        _id: allMessages[0]._id,
        contact_wa_id: allMessages[0].contact_wa_id,
        contact_name: allMessages[0].contact_name,
        direction: allMessages[0].direction,
        message_text: allMessages[0].message_text,
        timestamp: allMessages[0].timestamp
      })
    }
    
    if (allMessages.length === 0) {
      console.log('⚠️ [API DEBUG] No hay mensajes en la BD')
      return NextResponse.json({
        success: true,
        chats: []
      })
    }
    
    // Agrupar por contacto manualmente
    console.log('🔍 [API DEBUG] Agrupando mensajes por contacto...')
    const conversationsMap = new Map()
    
    allMessages.forEach((message, index) => {
      console.log(`🔍 [API DEBUG] Procesando mensaje ${index + 1}:`, {
        _id: message._id,
        contact_wa_id: message.contact_wa_id,
        contact_name: message.contact_name,
        direction: message.direction,
        message_text: message.message_text,
        timestamp: message.timestamp,
        message_id: message.message_id
      })
      
      // Verificar que el mensaje tenga contact_wa_id (requerido)
      if (!message.contact_wa_id) {
        console.log(`⚠️ [API DEBUG] Mensaje ${index + 1} no tiene contact_wa_id, saltando...`)
        return
      }
      
      const contactId = message.contact_wa_id
      if (!conversationsMap.has(contactId)) {
        conversationsMap.set(contactId, {
          _id: contactId,
          contact_name: message.contact_name || 'Cliente',
          contact_wa_id: message.contact_wa_id,
          last_message: message.message_text && message.message_text !== 'null' ? message.message_text : 'Mensaje sin texto',
          last_timestamp: message.timestamp || Date.now(),
          message_count: 1,
          last_direction: message.direction || 'in'
        })
        console.log(`✅ [API DEBUG] Nueva conversación creada para ${message.contact_name || 'Cliente'}`)
      } else {
        const conv = conversationsMap.get(contactId)
        conv.message_count++
        if (message.timestamp && message.timestamp > conv.last_timestamp) {
          conv.last_message = message.message_text && message.message_text !== 'null' ? message.message_text : 'Mensaje sin texto'
          conv.last_timestamp = message.timestamp
          conv.last_direction = message.direction || 'in'
        }
        console.log(`📝 [API DEBUG] Actualizada conversación de ${message.contact_name || 'Cliente'}, total mensajes: ${conv.message_count}`)
      }
    })
    
    const conversations = Array.from(conversationsMap.values())
      .sort((a, b) => b.last_timestamp - a.last_timestamp)
    
    console.log('✅ [API DEBUG] ========== RESULTADO FINAL ==========')
    console.log('📱 [API DEBUG] Conversaciones encontradas:', conversations.length)
    console.log('📱 [API DEBUG] Estructura de la primera conversación:', JSON.stringify(conversations[0], null, 2))
    
    const response = {
      success: true,
      chats: conversations
    }
    
    console.log('📤 [API DEBUG] Enviando respuesta:', JSON.stringify(response, null, 2))
    
    return NextResponse.json(response)

  } catch (error) {
    console.error('❌ [API DEBUG] ========== ERROR EN API ==========')
    console.error('❌ [API DEBUG] Error:', error)
    console.error('❌ [API DEBUG] Stack:', error.stack)
    return NextResponse.json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    }, { status: 500 })
  }
}