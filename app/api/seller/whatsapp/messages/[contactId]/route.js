import { NextResponse } from 'next/server'
import mongoose from 'mongoose'

// API para obtener mensajes reales de WhatsApp desde la BD
export async function GET(request, { params }) {
  try {
    const { contactId } = await params
    console.log('🔍 [MESSAGES API DEBUG] Contacto:', contactId)
    
    // Conectar a MongoDB
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI)
      console.log('🔍 [MESSAGES API DEBUG] Conectado a MongoDB')
    }
    
    // Especificar la base de datos 'quickcart'
    const waachatDb = mongoose.connection.useDb('quickcart')
    const waachatCollection = waachatDb.collection('waachat')
    
    console.log('🔍 [MESSAGES API DEBUG] Usando base de datos: quickcart')
    console.log('🔍 [MESSAGES API DEBUG] Colección: waachat')
    
    console.log('🔍 [MESSAGES API DEBUG] Conectado a la colección waachat')
    
    // Obtener todos los mensajes y filtrar por contacto - ADAPTADO PARA N8N
    const allMessages = await waachatCollection.find({}).toArray()
    
    console.log(`📱 [MESSAGES API DEBUG] Total mensajes en BD:`, allMessages.length)
    
    // Filtrar y formatear mensajes para el contacto específico
    const formattedMessages = []
    
    allMessages.forEach((message, index) => {
      console.log(`🔍 [MESSAGES API DEBUG] Procesando mensaje ${index + 1}:`, {
        _id: message._id,
        keys: Object.keys(message).slice(0, 5) // Mostrar solo las primeras 5 claves
      })
      
      // Extraer datos de las claves malformadas del N8N
      let messageContactId = null
      let contactName = null
      let messageText = null
      let direction = null
      let timestamp = null
      let messageId = null
      
      // Buscar en las claves del objeto - PARSING PARA ESTRUCTURA MALFORMADA
      Object.keys(message).forEach(key => {
        // Para mensajes del cliente (direction: in)
        if (key.includes('contact_wa_id')) {
          const match = key.match(/"contact_wa_id":\s*([^,}]+)/)
          if (match) messageContactId = match[1].replace(/"/g, '').trim()
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
        if (key.includes('message_id')) {
          const match = key.match(/"message_id":\s*([^,}]+)/)
          if (match) messageId = match[1].replace(/"/g, '').trim()
        }
        
        // Para mensajes de la IA (from, bot_reply, wa_message_id) - ESTRUCTURA MALFORMADA
        if (key.includes('from')) {
          const match = key.match(/"from":\s*([^,}]+)/)
          if (match) {
            messageContactId = match[1].replace(/"/g, '').trim()
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
        if (key.includes('wa_message_id')) {
          const match = key.match(/"wa_message_id":\s*([^,}]+)/)
          if (match) messageId = match[1].replace(/"/g, '').trim()
        }
        
        // Para timestamps de la IA
        if (key.includes('timestamp') && key.includes('2025-')) {
          const match = key.match(/"timestamp":\s*([^"]+)/)
          if (match) timestamp = match[1].replace(/"/g, '').trim()
        }
      })
      
      console.log(`🔍 [MESSAGES API DEBUG] Datos extraídos:`, {
        messageContactId,
        contactName,
        messageText,
        direction,
        timestamp,
        messageId
      })
      
        // Solo incluir mensajes del contacto específico
        if (messageContactId === contactId) {
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
            console.log(`⚠️ [MESSAGES API DEBUG] Error convirtiendo timestamp: ${error.message}`)
            formattedTimestamp = new Date().toISOString()
          }
          
          formattedMessages.push({
            _id: message._id,
            direction: direction || 'in',
            contact_name: contactName || 'Cliente',
            contact_wa_id: messageContactId,
            message_text: messageText && messageText !== 'null' ? messageText : 'Mensaje sin texto',
            timestamp: formattedTimestamp,
            message_id: messageId || `msg_${Date.now()}`,
            sent_by_admin: direction === 'out',
            created_at: new Date().toISOString()
          })
          console.log(`✅ [MESSAGES API DEBUG] Mensaje incluido para ${contactName || 'Cliente'}`)
          console.log(`📝 [MESSAGES API DEBUG] Texto: "${messageText}" (${messageText?.length} chars)`)
          console.log(`📝 [MESSAGES API DEBUG] Timestamp: ${formattedTimestamp}`)
          console.log(`📝 [MESSAGES API DEBUG] Direction: ${direction}`)
        }
    })
    
    // Ordenar por timestamp
    formattedMessages.sort((a, b) => a.timestamp - b.timestamp)
    
    console.log(`📱 [MESSAGES API DEBUG] Mensajes encontrados para ${contactId}:`, formattedMessages.length)
    
    return NextResponse.json({
      success: true,
      messages: formattedMessages
    })

  } catch (error) {
    console.error('❌ [MESSAGES API DEBUG] Error:', error)
    return NextResponse.json({
      success: false,
      message: 'Error interno del servidor'
    }, { status: 500 })
  }
}

// API simple para enviar mensajes
export async function POST(request, { params }) {
  try {
    const { contactId } = await params
    const { message } = await request.json()
    
    console.log('🔍 [SEND API DEBUG] Enviando mensaje:', { contactId, message })
    
    // Simular envío exitoso
    const newMessage = {
      _id: 'new_' + Date.now(),
      direction: 'out',
      contact_wa_id: contactId,
      message_text: message,
      timestamp: Date.now()
    }
    
    console.log('✅ [SEND API DEBUG] Mensaje enviado:', newMessage._id)
    
    return NextResponse.json({
      success: true,
      message: 'Mensaje enviado correctamente',
      data: newMessage
    })

  } catch (error) {
    console.error('❌ [SEND API DEBUG] Error:', error)
    return NextResponse.json({
      success: false,
      message: 'Error interno del servidor'
    }, { status: 500 })
  }
}