import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import TermsModal from "./TermsModal";

const Footer = () => {
  const [showTermsModal, setShowTermsModal] = useState(false);

  return (
    <footer className="relative overflow-hidden">
      {/* Background con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
      
      {/* Contenido principal */}
      <div className="relative z-10">
        {/* Sección principal */}
        <div className="px-6 md:px-16 lg:px-32 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Logo y descripción */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <Image 
                  className="w-32 md:w-40 transition-transform duration-300 hover:scale-105" 
                  src="/abudilogo2.png" 
                  alt="logo" 
                  width={160} 
                  height={160} 
                />
              </div>
              <p className="text-gray-300 text-base leading-relaxed mb-6 max-w-md">
                AbudiCell es tu tienda en línea de confianza para productos de tecnología y electrónicos. 
                Ofrecemos la mejor calidad y precios competitivos con envío rápido y seguro a toda la región.
              </p>
              
              {/* Redes sociales */}
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm font-medium">Síguenos:</span>
                <div className="flex gap-3">
                  <a 
                    href="https://www.facebook.com/share/1BUdaUr6wW/?mibextid=wwXIfr" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center hover:from-blue-500 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                  >
                    <FaFacebook className="text-white text-sm" />
                  </a>
                  <a 
                    href="https://www.instagram.com/abudi_cell?igsh=MTV5eXAwYzF6MWs0ZA%3D%3D&utm_source=qr" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center hover:from-pink-400 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                  >
                    <FaInstagram className="text-white text-sm" />
                  </a>
                  <a 
                    href="https://www.tiktok.com/@abudicell?_t=ZM-8zmviXjLPke&_r=1" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black rounded-xl flex items-center justify-center hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                  >
                    <FaTiktok className="text-white text-sm" />
                  </a>
                </div>
              </div>
            </div>

            {/* Enlaces de empresa */}
            <div>
              <h3 className="text-white font-bold text-lg mb-6 relative">
                Empresa
                <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-[#feecaf] to-yellow-300"></div>
              </h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="/" 
                    className="text-gray-300 hover:text-[#feecaf] transition-all duration-300 flex items-center group"
                  >
                    <span className="w-0 h-0.5 bg-gradient-to-r from-[#feecaf] to-yellow-300 transition-all duration-300 group-hover:w-4 mr-0 group-hover:mr-2"></span>
                    Inicio
                  </a>
                </li>
                <li>
                  <a 
                    href="/about-us" 
                    className="text-gray-300 hover:text-[#feecaf] transition-all duration-300 flex items-center group"
                  >
                    <span className="w-0 h-0.5 bg-gradient-to-r from-[#feecaf] to-yellow-300 transition-all duration-300 group-hover:w-4 mr-0 group-hover:mr-2"></span>
                    Acerca de nosotros
                  </a>
                </li>
                <li>
                  <a 
                    href="/contact" 
                    className="text-gray-300 hover:text-[#feecaf] transition-all duration-300 flex items-center group"
                  >
                    <span className="w-0 h-0.5 bg-gradient-to-r from-[#feecaf] to-yellow-300 transition-all duration-300 group-hover:w-4 mr-0 group-hover:mr-2"></span>
                    Contáctanos
                  </a>
                </li>
                <li>
                  <button 
                    onClick={() => setShowTermsModal(true)}
                    className="text-gray-300 hover:text-[#feecaf] transition-all duration-300 flex items-center group text-left"
                  >
                    <span className="w-0 h-0.5 bg-gradient-to-r from-[#feecaf] to-yellow-300 transition-all duration-300 group-hover:w-4 mr-0 group-hover:mr-2"></span>
                    Términos y Condiciones
                  </button>
                </li>
              </ul>
            </div>

            {/* Información de contacto */}
            <div>
              <h3 className="text-white font-bold text-lg mb-6 relative">
                Contacto
                <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-[#feecaf] to-yellow-300"></div>
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#feecaf] to-yellow-300 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Email</p>
                    <a 
                      href="mailto:Compras@abudicell.com" 
                      className="text-[#feecaf] hover:text-yellow-300 transition-colors duration-300 font-medium"
                    >
                      Compras@abudicell.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#feecaf] to-yellow-300 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Horario</p>
                    <p className="text-gray-400 text-sm">Lun - Vie: 9:00 - 18:00</p>
                    <p className="text-gray-400 text-sm">Sáb: 9:00 - 14:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-800/50"></div>

        {/* Copyright */}
        <div className="px-6 md:px-16 lg:px-32 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              Copyright 2025 © AbudiCell. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6">
              {/* Espacio para futuros elementos */}
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal de Términos y Condiciones */}
      <TermsModal 
        isOpen={showTermsModal} 
        onClose={() => setShowTermsModal(false)} 
      />
    </footer>
  );
};

export default Footer;