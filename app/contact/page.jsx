'use client'
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { assets } from "@/assets/assets";
import toast from "react-hot-toast";
import axios from "axios";
import { 
  FaFacebook, 
  FaInstagram, 
  FaTiktok, 
  FaRobot, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaComments,
  FaWhatsapp,
  FaClock,
  FaUser,
  FaShieldAlt,
  FaTruck,
  FaCreditCard
} from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('/api/contact/send', formData);
      
      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      toast.error('Error al enviar mensaje. Intenta nuevamente.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Hero Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 md:px-16 lg:px-32 py-16">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Contáctanos
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                ¿Tienes alguna pregunta, sugerencia o necesitas ayuda? Estamos aquí para ayudarte. 
                Nuestro equipo de soporte está listo para asistirte en cualquier momento.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 md:px-16 lg:px-32 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-12">
              
              {/* Contact Form - Ocupa 2 columnas */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Envíanos un Mensaje</h2>
                    <p className="text-gray-600">Completa el formulario y nos pondremos en contacto contigo lo antes posible.</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3">
                          Nombre Completo *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 text-lg"
                          placeholder="Tu nombre completo"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                          Correo Electrónico *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 text-lg"
                          placeholder="tu@email.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-3">
                        Asunto *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 text-lg"
                        placeholder="¿En qué podemos ayudarte?"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-3">
                        Mensaje *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none resize-none transition-all duration-200 text-lg"
                        placeholder="Cuéntanos más detalles sobre tu consulta..."
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full bg-black text-white py-4 px-8 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                    >
                      Enviar Mensaje
                    </button>
                  </form>
                </div>
              </div>

              {/* Sidebar - Ocupa 1 columna */}
              <div className="space-y-8">
                
                {/* Contact Details */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Información de Contacto</h2>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                        <FaPhone className="text-white text-lg" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Teléfono</h3>
                        <p className="text-gray-600">+1-234-567-890</p>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                          <FaClock className="mr-1" />
                          Lunes a Viernes: 9:00 AM - 6:00 PM
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                        <FaEnvelope className="text-white text-lg" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Correo Electrónico</h3>
                        <p className="text-gray-600">Compras@abudicell.com</p>
                        <p className="text-sm text-gray-500">Respuesta en menos de 24 horas</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                        <FaMapMarkerAlt className="text-white text-lg" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Dirección</h3>
                        <p className="text-gray-600">
                          Av. Tecnología 123<br />
                          Ciudad Digital, CD 12345<br />
                          México
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                        <FaComments className="text-white text-lg" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Chat en Vivo</h3>
                        <p className="text-gray-600">Disponible 24/7</p>
                        <p className="text-sm text-gray-500">Respuesta inmediata</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Directo */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <FaWhatsapp className="mr-3 text-green-600 text-2xl" />
                    WhatsApp Directo
                  </h2>
                  <p className="text-gray-600 mb-6">
                    ¿Necesitas ayuda inmediata? Chatea directamente con nuestro equipo de soporte por WhatsApp.
                  </p>
                  <a 
                    href="https://wa.me/5493765246207?text=Hola%2C%20necesito%20ayuda%20con%20mi%20pedido" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center space-x-3"
                  >
                    <FaWhatsapp className="text-xl" />
                    <span>Chatear por WhatsApp</span>
                  </a>
                  <p className="text-sm text-gray-500 mt-3 text-center">
                    Respuesta inmediata • Disponible 24/7
                  </p>
                </div>

                {/* Vendedores Oficiales */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Nuestros Vendedores Oficiales</h2>
                  <p className="text-gray-600 mb-6">
                    Contacta directamente con nuestros vendedores oficiales para atención personalizada y mejores precios.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                        <FaUser className="text-white text-lg" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">Sol</h3>
                        <a 
                          href="https://wa.me/5493764962902" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-green-600 hover:text-green-700 font-medium text-lg"
                        >
                          +54 9 3764 96-2902
                        </a>
                        <p className="text-sm text-gray-500 mt-1">WhatsApp</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                        <FaUser className="text-white text-lg" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">Caro</h3>
                        <a 
                          href="https://wa.me/595975105364" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-green-600 hover:text-green-700 font-medium text-lg"
                        >
                          +595 975 105364
                        </a>
                        <p className="text-sm text-gray-500 mt-1">WhatsApp</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                        <FaUser className="text-white text-lg" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">Lara</h3>
                        <a 
                          href="https://wa.me/595985576072" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-green-600 hover:text-green-700 font-medium text-lg"
                        >
                          +595 985 576072
                        </a>
                        <p className="text-sm text-gray-500 mt-1">WhatsApp</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                        <FaUser className="text-white text-lg" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">Anyi</h3>
                        <a 
                          href="https://wa.me/595973986868" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-green-600 hover:text-green-700 font-medium text-lg"
                        >
                          +595 973 986868
                        </a>
                        <p className="text-sm text-gray-500 mt-1">WhatsApp</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                        <FaUser className="text-white text-lg" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">Jenni</h3>
                        <a 
                          href="https://wa.me/595973797093" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-green-600 hover:text-green-700 font-medium text-lg"
                        >
                          +595 973 797093
                        </a>
                        <p className="text-sm text-gray-500 mt-1">WhatsApp</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                        <FaUser className="text-white text-lg" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">Orlando</h3>
                        <a 
                          href="https://wa.me/5493765081572" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-green-600 hover:text-green-700 font-medium text-lg"
                        >
                          +54 9 3765 08-1572
                        </a>
                        <p className="text-sm text-gray-500 mt-1">WhatsApp</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                        <FaUser className="text-white text-lg" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">Arnaldo</h3>
                        <a 
                          href="https://wa.me/595984777242" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-green-600 hover:text-green-700 font-medium text-lg"
                        >
                          +595 984 777242
                        </a>
                        <p className="text-sm text-gray-500 mt-1">WhatsApp</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                        <FaUser className="text-white text-lg" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">Hernán</h3>
                        <a 
                          href="https://wa.me/595986192035" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-green-600 hover:text-green-700 font-medium text-lg"
                        >
                          +595 986 192035
                        </a>
                        <p className="text-sm text-gray-500 mt-1">WhatsApp</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Secciones adicionales */}
        <div className="px-6 md:px-16 lg:px-32 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">

              {/* FAQ Section */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Preguntas Frecuentes</h2>
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <FaTruck className="text-blue-600 text-sm" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">¿Cuánto tiempo toma el envío?</h3>
                        <p className="text-gray-600">
                          Los envíos estándar toman de 3-5 días hábiles. Ofrecemos envío express para entregas en 24-48 horas.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-b border-gray-200 pb-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <FaShieldAlt className="text-green-600 text-sm" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">¿Ofrecen garantía en los productos?</h3>
                        <p className="text-gray-600">
                          Sí, todos nuestros productos incluyen garantía del fabricante. También ofrecemos garantía extendida en productos seleccionados.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-b border-gray-200 pb-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <FaUser className="text-purple-600 text-sm" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">¿Puedo devolver un producto?</h3>
                        <p className="text-gray-600">
                          Ofrecemos devoluciones gratuitas dentro de los primeros 30 días de compra, siempre que el producto esté en condiciones originales.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <FaCreditCard className="text-yellow-600 text-sm" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">¿Qué métodos de pago aceptan?</h3>
                        <p className="text-gray-600">
                          Aceptamos tarjetas de crédito/débito, PayPal, transferencias bancarias y pago contra entrega.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold mb-6">Síguenos en Redes Sociales</h2>
                <p className="text-gray-300 mb-8">
                  Mantente al día con nuestras últimas ofertas, nuevos productos y noticias tecnológicas.
                </p>
                <div className="flex space-x-4">
                  <a 
                    href="https://www.facebook.com/share/1BUdaUr6wW/?mibextid=wwXIfr" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-14 h-14 bg-gray-700 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all duration-300 transform hover:scale-110"
                  >
                    <FaFacebook className="text-xl" />
                  </a>
                  <a 
                    href="https://www.instagram.com/abudi_cell?igsh=MTV5eXAwYzF6MWs0ZA%3D%3D&utm_source=qr" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-14 h-14 bg-gray-700 rounded-xl flex items-center justify-center hover:bg-pink-600 transition-all duration-300 transform hover:scale-110"
                  >
                    <FaInstagram className="text-xl" />
                  </a>
                  <a 
                    href="https://www.tiktok.com/@abudicell?_t=ZM-8zmviXjLPke&_r=1" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-14 h-14 bg-gray-700 rounded-xl flex items-center justify-center hover:bg-black transition-all duration-300 transform hover:scale-110"
                  >
                    <FaTiktok className="text-xl" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
