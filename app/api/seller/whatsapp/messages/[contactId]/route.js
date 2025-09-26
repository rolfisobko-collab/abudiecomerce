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
    
    const db = mongoose.connection.db
    const waachatCollection = db.collection('waachat')
    
    console.log('🔍 [MESSAGES API DEBUG] Conectado a la colección waachat')
    
    // Obtener mensajes del contacto específico desde la BD
    const messages = await waachatCollection.find({
      contact_wa_id: contactId
    })
    .sort({ timestamp: 1 }) // Ordenar por timestamp ascendente (más antiguos primero)
    .toArray()
    
    console.log('🔍 [MESSAGES API DEBUG] Mensajes encontrados en BD:', messages.length)
    console.log('🔍 [MESSAGES API DEBUG] Primeros mensajes:', messages.slice(0, 3))
    
    return NextResponse.json({
      success: true,
      messages: messages
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