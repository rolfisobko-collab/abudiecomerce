'use client'
import React, { useState, useEffect } from 'react'
// import { useAppContext } from '@/context/AppContext' // Ya no necesario
import { useRouter } from 'next/navigation'
import ChatList from '@/components/admin/ChatList'
import ChatWindow from '@/components/admin/ChatWindow'
import Loading from '@/components/Loading'

const WhatsAppChat = () => {
  // const { user, isAdmin } = useAppContext() // Ya no necesitamos estas verificaciones
  const router = useRouter()
  const [selectedChat, setSelectedChat] = useState(null)
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState([])

  // El middleware ya verifica que sea admin, no necesitamos verificación adicional
  // useEffect(() => {
  //   if (!user || !isAdmin) {
  //     router.push('/unauthorized')
  //     return
  //   }
  // }, [user, isAdmin, router])

  // Cargar conversaciones
  useEffect(() => {
    const fetchChats = async () => {
      try {
        console.log('🔍 [FRONTEND DEBUG] ========== INICIANDO CARGA DE CHATS ==========')
        console.log('🔍 [FRONTEND DEBUG] URL actual:', window.location.href)
        console.log('🔍 [FRONTEND DEBUG] Timestamp:', new Date().toISOString())
        
        const apiUrl = '/api/seller/whatsapp/chats'
        console.log('🔍 [FRONTEND DEBUG] Haciendo petición a:', apiUrl)
        
        const response = await fetch(apiUrl)
        console.log('🔍 [FRONTEND DEBUG] Status de respuesta:', response.status)
        console.log('🔍 [FRONTEND DEBUG] Response OK:', response.ok)
        console.log('🔍 [FRONTEND DEBUG] Content-Type:', response.headers.get('content-type'))
        
        if (!response.ok) {
          console.error('❌ [FRONTEND DEBUG] Response no OK:', response.status, response.statusText)
          return
        }
        
        const data = await response.json()
        console.log('🔍 [FRONTEND DEBUG] ========== RESPUESTA COMPLETA ==========')
        console.log('🔍 [FRONTEND DEBUG] Data completa:', JSON.stringify(data, null, 2))
        console.log('🔍 [FRONTEND DEBUG] Success:', data.success)
        console.log('🔍 [FRONTEND DEBUG] Chats array:', data.chats)
        
        if (data.success && data.chats) {
          console.log('✅ [FRONTEND DEBUG] Chats recibidos correctamente:', data.chats.length)
          console.log('🔍 [FRONTEND DEBUG] Primeros 3 chats:')
          data.chats.slice(0, 3).forEach((chat, index) => {
            console.log(`  ${index + 1}. ${chat.contact_name} (${chat.contact_wa_id})`)
            console.log(`     Mensaje: ${chat.last_message}`)
            console.log(`     Timestamp: ${chat.last_timestamp}`)
          })
          
          console.log('🔍 [FRONTEND DEBUG] Estableciendo chats en el estado...')
          setChats(data.chats)
          console.log('✅ [FRONTEND DEBUG] Chats establecidos en el estado')
        } else {
          console.error('❌ [FRONTEND DEBUG] Error en la respuesta:', data)
        }
      } catch (error) {
        console.error('❌ [FRONTEND DEBUG] ========== ERROR EN FETCH ==========')
        console.error('❌ [FRONTEND DEBUG] Error:', error)
        console.error('❌ [FRONTEND DEBUG] Message:', error.message)
        console.error('❌ [FRONTEND DEBUG] Stack:', error.stack)
      } finally {
        console.log('🔍 [FRONTEND DEBUG] Finalizando carga, estableciendo loading = false')
        setLoading(false)
        console.log('✅ [FRONTEND DEBUG] ========== CARGA COMPLETADA ==========')
      }
    }

    console.log('🔍 [FRONTEND DEBUG] useEffect ejecutándose...')
    fetchChats()
  }, [])

  // Función para cargar mensajes
  const fetchMessages = async (contactId) => {
    try {
      console.log('🔍 [FRONTEND DEBUG] Cargando mensajes para:', contactId)
      const response = await fetch(`/api/seller/whatsapp/messages/${contactId}`)
      const data = await response.json()
      if (data.success) {
        console.log('✅ [FRONTEND DEBUG] Mensajes cargados:', data.messages.length)
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('❌ [FRONTEND DEBUG] Error al cargar mensajes:', error)
    }
  }

  // Cargar mensajes cuando se selecciona un chat
  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.contact_wa_id)
    }
  }, [selectedChat])

  // Función para actualizar mensajes (para el polling)
  const handleRefreshMessages = () => {
    if (selectedChat) {
      console.log('🔄 [FRONTEND DEBUG] Actualizando mensajes...')
      fetchMessages(selectedChat.contact_wa_id)
    }
  }

  // Función para actualizar chats (para el polling)
  const handleRefreshChats = async () => {
    try {
      console.log('🔄 [FRONTEND DEBUG] Actualizando chats...')
      const response = await fetch('/api/seller/whatsapp/chats')
      const data = await response.json()
      if (data.success && data.chats) {
        console.log('✅ [FRONTEND DEBUG] Chats actualizados:', data.chats.length)
        setChats(data.chats)
      }
    } catch (error) {
      console.error('❌ [FRONTEND DEBUG] Error al actualizar chats:', error)
    }
  }

  // Polling automático para actualizar chats cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefreshChats()
    }, 5000) // Actualizar cada 5 segundos

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <Loading />
  }

  return (
    <div className="flex h-screen bg-gray-100 w-full">
      {/* Lista de chats */}
      <div className="w-1/3 border-r border-gray-300 bg-white">
        <ChatList 
          chats={chats} 
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
        />
      </div>

      {/* Ventana de chat */}
      <div className="flex-1 flex flex-col w-full">
        {selectedChat ? (
          <ChatWindow 
            chat={selectedChat}
            messages={messages}
            onSendMessage={async (message) => {
              // Aquí implementarías el envío de mensajes
              console.log('Enviar mensaje:', message)
            }}
            onRefreshMessages={handleRefreshMessages}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                WhatsApp Business
              </h3>
              <p className="text-gray-500">
                Selecciona una conversación para comenzar
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WhatsAppChat
