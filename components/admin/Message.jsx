'use client'
import React from 'react'

const Message = ({ message }) => {
  const isOutgoing = message.direction === 'out'
  const isIncoming = message.direction === 'in'

  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp * 1000)
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp * 1000)
    const now = new Date()
    const diffTime = now - date
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return 'Hoy'
    } else if (diffDays === 1) {
      return 'Ayer'
    } else if (diffDays < 7) {
      return date.toLocaleDateString('es-ES', { weekday: 'long' })
    } else {
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
    }
  }

  // Agrupar mensajes por fecha
  const shouldShowDate = (currentMessage, previousMessage) => {
    if (!previousMessage) return true
    
    const currentDate = new Date(currentMessage.timestamp * 1000)
    const previousDate = new Date(previousMessage.timestamp * 1000)
    
    return currentDate.toDateString() !== previousDate.toDateString()
  }

  return (
    <div className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isOutgoing 
          ? 'bg-green-500 text-white' 
          : 'bg-white text-gray-900 border border-gray-200'
      }`}>
        {/* Contenido del mensaje */}
        <div className="break-words">
          {message.message_text && (
            <p className="text-sm leading-relaxed">
              {message.message_text}
            </p>
          )}
          
          {/* Si es un mensaje de la IA (outgoing) sin texto, mostrar indicador */}
          {isOutgoing && !message.message_text && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-xs opacity-75">Mensaje de la IA</span>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div className={`flex items-center justify-end mt-1 space-x-1 ${
          isOutgoing ? 'text-green-100' : 'text-gray-500'
        }`}>
          <span className="text-xs">
            {formatTime(message.timestamp)}
          </span>
          
          {/* Estado del mensaje */}
          {isOutgoing && (
            <div className="flex items-center">
              {message.message_id ? (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Message
