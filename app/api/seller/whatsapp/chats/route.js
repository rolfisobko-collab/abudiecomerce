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
    
    // Especificar la base de datos 'quickcart'
    const waachatDb = mongoose.connection.useDb('quickcart')
    const waachatCollection = waachatDb.collection('waachat')
    
    console.log('🔍 [API DEBUG] Usando base de datos: quickcart')
    console.log('🔍 [API DEBUG] Colección: waachat')
    
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
    
    // Agrupar por contacto manualmente - ADAPTADO PARA N8N
    console.log('🔍 [API DEBUG] Agrupando mensajes por contacto...')
    const conversationsMap = new Map()
    
    allMessages.forEach((message, index) => {
      console.log(`🔍 [API DEBUG] Procesando mensaje ${index + 1}:`, {
        _id: message._id,
        keys: Object.keys(message).slice(0, 5) // Mostrar solo las primeras 5 claves
      })
      
      // Extraer datos de las claves malformadas del N8N
      let contactId = null
      let contactName = null
      let messageText = null
      let direction = null
      let timestamp = null
      
      // Buscar en las claves del objeto - PARSING PARA ESTRUCTURA MALFORMADA
      Object.keys(message).forEach(key => {
        // Para mensajes del cliente (direction: in)
        if (key.includes('contact_wa_id')) {
          const match = key.match(/"contact_wa_id":\s*([^,}]+)/)
          if (match) contactId = match[1].replace(/"/g, '').trim()
        }
        if (key.includes('contact_name')) {
          const match = key.match(/"contact_name":\s*([^,}]+)/)
          if (match) contactName = match[1].replace(/"/g, '').trim()
        }
        if (key.includes('message_text')) {
          const match = key.match(/"message_text":\s*([^,}]+)/)
          if (match) messageText = match[1].replace(/"/g, '').trim()
        }
        if (key.includes('direction')) {
          const match = key.match(/"direction":\s*([^,}]+)/)
          if (match) direction = match[1].replace(/"/g, '').trim()
        }
        if (key.includes('timestamp')) {
          const match = key.match(/"timestamp":\s*([^,}]+)/)
          if (match) timestamp = match[1].replace(/"/g, '').trim()
        }
        
        // Para mensajes de la IA (from, bot_reply) - ESTRUCTURA MALFORMADA
        if (key.includes('from')) {
          const match = key.match(/"from":\s*([^,}]+)/)
          if (match) {
            contactId = match[1].replace(/"/g, '').trim()
            direction = 'out'
          }
        }
        if (key.includes('bot_reply')) {
          // Extraer el texto del bot_reply de la clave malformada - PARSING COMPLETO
          const match = key.match(/"bot_reply":\s*"([^"]+)"/)
          if (match) {
            messageText = match[1].trim()
          } else {
            // Si no encuentra comillas, buscar hasta el final de la clave
            const match2 = key.match(/"bot_reply":\s*([^,}]+)/)
            if (match2) {
              messageText = match2[1].trim()
            }
          }
        }
        
        // Buscar claves que continúan el mensaje de bot_reply (sin comillas ni estructura JSON)
        if (key && 
            !key.includes('"') && 
            !key.includes(':') && 
            !key.includes('_') && 
            !key.includes('raw_data') &&
            !key.includes('timestamp') &&
            !key.includes('wa_message_id') &&
            key.length > 20 &&
            key !== '_id') {
          // Es probable que sea la continuación del mensaje
          if (messageText && messageText.length > 0) {
            messageText += ' ' + key.trim()
          }
        }
        
        // Buscar en raw_data_iaData_output también - PARSING COMPLETO (SOLO SI NO HAY MENSAJE YA)
        if (key.includes('raw_data_iaData_output') && (!messageText || messageText.length < 50)) {
          const match = key.match(/"raw_data_iaData_output":\s*"([^"]+)"/)
          if (match) {
            messageText = match[1].trim()
          } else {
            // Si no encuentra comillas, buscar hasta el final de la clave
            const match2 = key.match(/"raw_data_iaData_output":\s*([^,}]+)/)
            if (match2) {
              messageText = match2[1].trim()
            }
          }
        }
        
        // Buscar en el valor del objeto también (para mensajes completos) - SOLO SI NO HAY MENSAJE YA
        if (message[key] && typeof message[key] === 'string' && message[key].length > 10) {
          if ((key.includes('bot_reply') || key.includes('raw_data_iaData_output')) && (!messageText || messageText.length < 50)) {
            messageText = message[key]
          }
        }
        
        // Para timestamps de la IA
        if (key.includes('timestamp') && key.includes('2025-')) {
          const match = key.match(/"timestamp":\s*([^"]+)/)
          if (match) timestamp = match[1].replace(/"/g, '').trim()
        }
      })
      
      console.log(`🔍 [API DEBUG] Datos extraídos:`, {
        contactId,
        contactName,
        messageText,
        direction,
        timestamp
      })
      
      // Verificar que el mensaje tenga contactId (requerido)
      if (!contactId) {
        console.log(`⚠️ [API DEBUG] Mensaje ${index + 1} no tiene contactId, saltando...`)
        return
      }
      
      // Convertir timestamp Unix a formato ISO si es necesario - CORREGIDO
      let formattedTimestamp = timestamp || new Date().toISOString()
      
      try {
        if (typeof formattedTimestamp === 'string' && /^\d+$/.test(formattedTimestamp)) {
          // Es un timestamp Unix en string, convertir a número y luego a ISO
          const unixTime = parseInt(formattedTimestamp)
          if (unixTime < 2000000000) {
            // Es timestamp Unix en segundos
            formattedTimestamp = new Date(unixTime * 1000).toISOString()
          } else {
            // Es timestamp Unix en milisegundos
            formattedTimestamp = new Date(unixTime).toISOString()
          }
        } else if (typeof formattedTimestamp === 'number' && formattedTimestamp < 2000000000) {
          // Es un timestamp Unix en número (segundos), convertir a ISO
          formattedTimestamp = new Date(formattedTimestamp * 1000).toISOString()
        } else if (typeof formattedTimestamp === 'string' && formattedTimestamp.includes('2025-')) {
          // Ya está en formato ISO, limpiar caracteres extra
          formattedTimestamp = formattedTimestamp.replace(/\n\}/g, '').trim()
        } else if (typeof formattedTimestamp === 'string') {
          // Intentar parsear como fecha
          const parsedDate = new Date(formattedTimestamp)
          if (!isNaN(parsedDate.getTime())) {
            formattedTimestamp = parsedDate.toISOString()
          } else {
            // Si no se puede parsear, usar fecha actual
            formattedTimestamp = new Date().toISOString()
          }
        }
      } catch (error) {
        console.log(`⚠️ [API DEBUG] Error convirtiendo timestamp: ${error.message}`)
        formattedTimestamp = new Date().toISOString()
      }
      
      if (!conversationsMap.has(contactId)) {
        conversationsMap.set(contactId, {
          _id: contactId,
          contact_name: contactName || 'Cliente',
          contact_wa_id: contactId,
          last_message: messageText && messageText !== 'null' ? messageText : 'Mensaje sin texto',
          last_timestamp: formattedTimestamp,
          message_count: 1,
          last_direction: direction || 'in'
        })
        console.log(`✅ [API DEBUG] Nueva conversación creada para ${contactName || 'Cliente'}`)
      } else {
        const conv = conversationsMap.get(contactId)
        conv.message_count++
        if (formattedTimestamp && formattedTimestamp > conv.last_timestamp) {
          conv.last_message = messageText && messageText !== 'null' ? messageText : 'Mensaje sin texto'
          conv.last_timestamp = formattedTimestamp
          conv.last_direction = direction || 'in'
        }
        console.log(`📝 [API DEBUG] Actualizada conversación de ${contactName || 'Cliente'}, total mensajes: ${conv.message_count}`)
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