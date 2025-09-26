import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Banner = () => {
  return (
    <div className="relative flex flex-col lg:flex-row items-center justify-between lg:pl-20 py-8 sm:py-12 lg:py-14 my-12 sm:my-16 rounded-xl sm:rounded-2xl overflow-hidden">
      {/* Background con textura personalizada */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200"></div>
      
      {/* Patrón de textura sutil */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.1)_1px,transparent_0)] bg-[length:20px_20px]"></div>
      </div>
      
      {/* Elementos decorativos */}
      <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-[#feecaf]/20 to-yellow-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
      
      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between w-full gap-6 lg:gap-0">
        <Image
          className="max-w-48 sm:max-w-56 order-2 lg:order-1"
          src={assets.jbl_soundbox_image}
          alt="jbl_soundbox_image"
        />
        <div className="flex flex-col items-center justify-center text-center space-y-3 sm:space-y-4 px-4 lg:px-0 order-1 lg:order-2">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold max-w-[290px]">
            Mejora tu Experiencia de Gaming
          </h2>
          <p className="max-w-[343px] text-sm sm:text-base font-medium text-gray-800/60">
            Desde sonido inmersivo hasta controles precisos—todo lo que necesitas para ganar
          </p>
          <button className="group flex items-center justify-center gap-1 px-8 sm:px-12 py-2 sm:py-2.5 bg-[#feecaf] rounded text-black hover:bg-[#feecaf]/80 transition-colors text-sm sm:text-base">
            Comprar ahora
            <svg className="group-hover:translate-x-1 transition w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <Image
          className="hidden lg:block max-w-80 order-3"
          src={assets.md_controller_image}
          alt="md_controller_image"
        />
        <Image
          className="lg:hidden max-w-64 sm:max-w-80 order-3"
          src={assets.sm_controller_image}
          alt="sm_controller_image"
        />
      </div>
    </div>
  );
};

export default Banner;