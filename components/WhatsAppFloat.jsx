'use client'
import React, { useState } from 'react';
import { FaWhatsapp, FaTimes, FaRobot } from 'react-icons/fa';

const WhatsAppFloat = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDirectWhatsApp = () => {
    const whatsappUrl = `https://wa.me/5493765246207?text=${encodeURIComponent('Hola! Necesito ayuda con mi pedido')}`;
    window.open(whatsappUrl, '_blank');
  };

  const quickMessages = [
    "Hola, quiero información sobre productos",
    "¿Tienen stock de iPhone?",
    "Necesito precios mayoristas",
    "¿Cuál es el precio de Samsung Galaxy?",
    "Quiero armar un carrito con varios productos"
  ];

  const handleQuickMessage = (message) => {
    const whatsappUrl = `https://wa.me/5493765246207?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
  };

  return (
    <>
      {/* Botón flotante */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-green-500 hover:bg-green-600 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 group"
        >
          {isOpen ? (
            <FaTimes className="text-white text-lg sm:text-xl" />
          ) : (
            <FaWhatsapp className="text-white text-xl sm:text-2xl" />
          )}
        </button>
        
        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute bottom-full right-0 mb-2 px-2 sm:px-3 py-1 sm:py-2 bg-gray-900 text-white text-xs sm:text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap hidden sm:block">
            Chatea con nosotros
            <div className="absolute top-full right-3 sm:right-4 w-0 h-0 border-l-3 sm:border-l-4 border-r-3 sm:border-r-4 border-t-3 sm:border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </div>

      {/* Panel de chat */}
      {isOpen && (
        <div className="fixed bottom-20 right-2 sm:bottom-28 sm:right-6 w-72 sm:w-80 max-w-[calc(100vw-1rem)] bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 z-50 animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-3 sm:p-4 rounded-t-xl sm:rounded-t-2xl flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 rounded-full flex items-center justify-center">
              <FaRobot className="text-sm sm:text-lg" />
            </div>
            <div>
              <h3 className="font-semibold text-sm sm:text-base">Asistente IA AbudiCell</h3>
              <p className="text-xs opacity-90">Te ayudo a armar tu carrito</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-3 sm:p-4">
            <div className="mb-3 sm:mb-4">
              <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                ¡Hola! Soy tu asistente IA. Puedo ayudarte a:
              </p>
              <ul className="text-xs text-gray-500 space-y-1 mb-3 sm:mb-4">
                <li>• Buscar productos específicos</li>
                <li>• Comparar precios minoristas y mayoristas</li>
                <li>• Armar carritos con URLs compartibles</li>
                <li>• Calcular ahorros en compras mayoristas</li>
              </ul>
            </div>

            {/* Botón directo a WhatsApp */}
            <div className="mb-3 sm:mb-4">
              <button
                onClick={handleDirectWhatsApp}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-2 shadow-lg text-sm sm:text-base"
              >
                <FaWhatsapp className="text-base sm:text-lg" />
                <span>Chatear Directamente</span>
              </button>
            </div>

            {/* Mensajes rápidos */}
            <div className="mb-3 sm:mb-4">
              <p className="text-xs font-medium text-gray-700 mb-2">O elige un mensaje rápido:</p>
              <div className="space-y-1.5 sm:space-y-2">
                {quickMessages.map((msg, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickMessage(msg)}
                    className="w-full text-left p-2.5 sm:p-3 text-xs bg-gray-50 hover:bg-green-50 hover:border-green-200 rounded-lg border border-gray-200 text-gray-700 transition-all duration-200 hover:text-green-700"
                  >
                    {msg}
                  </button>
                ))}
              </div>
            </div>

            {/* Botón cerrar */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs sm:text-sm hover:bg-gray-50 transition-colors"
            >
              Cerrar
            </button>

            {/* Info adicional */}
            <div className="mt-2 sm:mt-3 p-2.5 sm:p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-800">
                💡 <strong>Tip:</strong> Puedes pedirme que arme un carrito con productos específicos y te daré una URL para compartir.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WhatsAppFloat;

