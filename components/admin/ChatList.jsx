'use client'
import React, { useState } from 'react'
import Image from 'next/image'

const ChatList = ({ chats, selectedChat, onSelectChat }) => {
  const [searchQuery, setSearchQuery] = useState('')
  
  // Debug para ver qué chats está recibiendo
  console.log('🔍 [CHATLIST DEBUG] ========== CHATLIST RENDERIZANDO ==========')
  console.log('🔍 [CHATLIST DEBUG] Chats recibidos:', chats ? chats.length : 'undefined')
  console.log('🔍 [CHATLIST DEBUG] Tipo de chats:', typeof chats)
  console.log('🔍 [CHATLIST DEBUG] Estructura completa de chats:', JSON.stringify(chats, null, 2))
  
  if (!chats || !Array.isArray(chats)) {
    console.log('❌ [CHATLIST DEBUG] Chats no es un array válido:', chats)
    return (
      <div className="flex flex-col h-full">
        <div className="bg-gray-50 border-b border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-900">Conversaciones</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Cargando conversaciones...</p>
        </div>
      </div>
    )
  }

  // Adaptar los datos que vienen de la API
  const adaptedChats = chats.map((chat, index) => {
    console.log(`🔍 [CHATLIST DEBUG] Procesando chat ${index}:`, chat)
    
    // Si el chat solo tiene message_count, crear una estructura básica
    if (chat.message_count && !chat.contact_name) {
      console.log(`✅ [CHATLIST DEBUG] Adaptando chat ${index} con message_count: ${chat.message_count}`)
      return {
        _id: `chat_${index}`,
        contact_name: `Conversación ${index + 1}`,
        contact_wa_id: `unknown_${index}`,
        last_message: 'Mensaje de WhatsApp recibido',
        last_timestamp: Date.now() - (index * 3600000), // 1 hora de diferencia
        message_count: chat.message_count,
        last_direction: 'in'
      }
    }
    return chat
  })

  console.log('🔍 [CHATLIST DEBUG] Chats adaptados:', adaptedChats)

  // Filtrar chats por búsqueda
  const filteredChats = adaptedChats.filter(chat => 
    chat.contact_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.contact_wa_id?.includes(searchQuery)
  )

  console.log('🔍 [CHATLIST DEBUG] Chats filtrados:', filteredChats.length)

  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp * 1000)
    const now = new Date()
    const diffTime = now - date
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    } else if (diffDays === 1) {
      return 'Ayer'
    } else if (diffDays < 7) {
      return date.toLocaleDateString('es-ES', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })
    }
  }

  const truncateMessage = (message, maxLength = 50) => {
    if (!message) return ''
    return message.length > maxLength ? message.substring(0, maxLength) + '...' : message
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Conversaciones</h2>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Barra de búsqueda */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar conversaciones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Lista de conversaciones */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg className="w-12 h-12 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p>No hay conversaciones</p>
          </div>
        ) : (
          filteredChats.map((chat) => {
            console.log('🔍 [CHATLIST DEBUG] Renderizando chat:', chat.contact_name)
            return (
              <div
                key={chat.contact_wa_id}
                onClick={() => onSelectChat(chat)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedChat?.contact_wa_id === chat.contact_wa_id ? 'bg-green-50 border-l-4 border-l-green-500' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold text-lg">
                        {chat.contact_name?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    </div>
                    {chat.message_count > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {chat.message_count}
                      </div>
                    )}
                  </div>

                  {/* Información del chat */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {chat.contact_name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatTime(chat.last_timestamp)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <p className={`text-sm truncate ${
                        chat.last_direction === 'in' ? 'text-gray-900 font-medium' : 'text-gray-500'
                      }`}>
                        {chat.last_direction === 'out' ? 'Tú: ' : ''}
                        {truncateMessage(chat.last_message)}
                      </p>
                      {chat.last_direction === 'in' && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default ChatList
