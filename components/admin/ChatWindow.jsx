'use client'
import React, { useState, useRef, useEffect } from 'react'
import Message from './Message'

const ChatWindow = ({ chat, messages, onSendMessage, onRefreshMessages }) => {
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [lastMessageCount, setLastMessageCount] = useState(0)
  const [userScrolled, setUserScrolled] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const messagesContainerRef = useRef(null)

  // Auto scroll al final de los mensajes SOLO si hay mensajes nuevos
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Detectar si el usuario ha hecho scroll manual
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10
      setUserScrolled(!isAtBottom)
    }
  }

  // Solo hacer scroll si hay mensajes nuevos Y el usuario no ha hecho scroll manual
  useEffect(() => {
    if (messages.length > lastMessageCount && !userScrolled) {
      scrollToBottom()
    }
    setLastMessageCount(messages.length)
  }, [messages, lastMessageCount, userScrolled])

  // Polling automático para actualizar mensajes cada 3 segundos
  useEffect(() => {
    if (!chat?.contact_wa_id) return

    const interval = setInterval(() => {
      if (onRefreshMessages) {
        onRefreshMessages()
      }
    }, 3000) // Actualizar cada 3 segundos

    return () => clearInterval(interval)
  }, [chat?.contact_wa_id, onRefreshMessages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message = newMessage.trim()
    setNewMessage('')
    
    // Abrir WhatsApp con el mensaje pre-escrito
    const phoneNumber = chat.contact_wa_id
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    
    // Abrir en nueva pestaña
    window.open(whatsappUrl, '_blank')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e)
    }
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp * 1000)
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 w-full">
      {/* Header del chat */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center space-x-3">
          {/* Avatar del contacto */}
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 font-semibold">
              {chat.contact_name?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </div>
          
          {/* Información del contacto */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {chat.contact_name}
            </h3>
            <p className="text-sm text-gray-500">
              +{chat.contact_wa_id}
            </p>
          </div>

          {/* Botón para abrir WhatsApp */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => {
                const phoneNumber = chat.contact_wa_id
                const whatsappUrl = `https://wa.me/${phoneNumber}`
                window.open(whatsappUrl, '_blank')
              }}
              className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full transition-colors"
              title="Abrir en WhatsApp"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Área de mensajes */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 relative"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p>No hay mensajes en esta conversación</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <Message key={message._id || index} message={message} />
          ))
        )}
        
        {/* Indicador de escritura */}
        {isTyping && (
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-sm">Enviando mensaje...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
        
        {/* Botón para ir al final cuando el usuario ha hecho scroll */}
        {userScrolled && (
          <div className="absolute bottom-20 right-4">
            <button
              onClick={() => {
                scrollToBottom()
                setUserScrolled(false)
              }}
              className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-colors"
              title="Ir al final"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Input de mensaje */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-3">

          {/* Input de texto */}
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe un mensaje para enviar por WhatsApp..."
              className="w-full px-4 py-3 border border-gray-300 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows="1"
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>

          {/* Botón de enviar a WhatsApp */}
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            title="Enviar por WhatsApp"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatWindow
