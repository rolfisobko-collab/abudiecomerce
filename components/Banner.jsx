import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Banner = () => {
  return (
    <div className="relative flex flex-col md:flex-row items-center justify-between md:pl-20 py-14 md:py-0 my-16 rounded-2xl overflow-hidden">
      {/* Background con textura personalizada */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200"></div>
      
      {/* Patrón de textura sutil */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.1)_1px,transparent_0)] bg-[length:20px_20px]"></div>
      </div>
      
      {/* Elementos decorativos */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#feecaf]/20 to-yellow-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
      
      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full">
        <Image
          className="max-w-56"
          src={assets.jbl_soundbox_image}
          alt="jbl_soundbox_image"
        />
        <div className="flex flex-col items-center justify-center text-center space-y-2 px-4 md:px-0">
          <h2 className="text-2xl md:text-3xl font-semibold max-w-[290px]">
            Mejora tu Experiencia de Gaming
          </h2>
          <p className="max-w-[343px] font-medium text-gray-800/60">
            Desde sonido inmersivo hasta controles precisos—todo lo que necesitas para ganar
          </p>
          <button className="group flex items-center justify-center gap-1 px-12 py-2.5 bg-[#feecaf] rounded text-black hover:bg-[#feecaf]/80 transition-colors">
            Comprar ahora
            <Image className="group-hover:translate-x-1 transition" src={assets.arrow_icon_white} alt="arrow_icon_white" />
          </button>
        </div>
        <Image
          className="hidden md:block max-w-80"
          src={assets.md_controller_image}
          alt="md_controller_image"
        />
        <Image
          className="md:hidden"
          src={assets.sm_controller_image}
          alt="sm_controller_image"
        />
      </div>
    </div>
  );
};

export default Banner;