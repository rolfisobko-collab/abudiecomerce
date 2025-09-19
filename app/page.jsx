'use client'
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Sparkles, TrendingUp, Star, Zap, Shield, Truck } from "lucide-react";
import HeaderSlider from "@/components/HeaderSlider";
import HomeProducts from "@/components/HomeProducts";
import SmartRecommendations from "@/components/SmartRecommendations";
import Banner from "@/components/Banner";
import NewsLetter from "@/components/NewsLetter";
import FeaturedProduct from "@/components/FeaturedProduct";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { useAppContext } from "@/context/AppContext";

// Componente de animación para elementos
const AnimatedSection = ({ children, delay = 0, className = "" }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Componente de características destacadas
const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#feecaf] group"
    >
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#feecaf] to-yellow-300 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
};

const Home = () => {
  const { router } = useAppContext();

  return (
    <>
      <Navbar/>
      
      {/* Background decorativo para toda la página */}
      <div className="relative min-h-screen">
        {/* Background principal */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100"></div>
        
        {/* Elementos decorativos de fondo */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          {/* Círculos decorativos */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-[#feecaf]/20 to-yellow-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-40 left-1/4 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
          <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-gradient-to-br from-green-200/20 to-emerald-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '6s'}}></div>
          
          {/* Líneas decorativas */}
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#feecaf]/30 to-transparent"></div>
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-300/30 to-transparent"></div>
        </div>
        
        {/* Contenido principal */}
        <div className="relative z-10">
          {/* Hero Section con HeaderSlider */}
          <AnimatedSection>
            <HeaderSlider />
          </AnimatedSection>

          <div className="px-4 sm:px-6 md:px-16 lg:px-32">
        {/* Sección de Productos Populares */}
        <AnimatedSection delay={0.2}>
          <HomeProducts />
        </AnimatedSection>

        {/* Sección de Características Destacadas */}
        <AnimatedSection delay={0.4} className="mt-12 sm:mt-16 lg:mt-20 mb-12 sm:mb-16">
          <div className="text-center mb-8 sm:mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#feecaf] to-yellow-300 text-gray-800 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-4"
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              ¿Por qué elegirnos?
            </motion.div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 px-4">
              La mejor experiencia de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#feecaf] to-yellow-300">compra</span>
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-base sm:text-lg px-4">
              Ofrecemos productos de calidad premium con el mejor servicio al cliente y garantía total
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <FeatureCard
              icon={TrendingUp}
              title="Productos Trending"
              description="Los productos más populares y mejor valorados por nuestros clientes"
              delay={0.1}
            />
            <FeatureCard
              icon={Shield}
              title="Garantía Total"
              description="Garantía extendida en todos nuestros productos con soporte técnico especializado"
              delay={0.2}
            />
            <FeatureCard
              icon={Truck}
              title="Envío Rápido"
              description="Entrega express en 24-48 horas con seguimiento en tiempo real"
              delay={0.3}
            />
            <FeatureCard
              icon={Star}
              title="Calidad Premium"
              description="Productos seleccionados cuidadosamente para garantizar la máxima calidad"
              delay={0.4}
            />
            <FeatureCard
              icon={Zap}
              title="Ofertas Exclusivas"
              description="Descuentos especiales y ofertas que no encontrarás en ningún otro lugar"
              delay={0.5}
            />
            <FeatureCard
              icon={Sparkles}
              title="Experiencia Única"
              description="Atención personalizada y recomendaciones inteligentes para cada cliente"
              delay={0.6}
            />
          </div>
        </AnimatedSection>
        
        {/* Recomendaciones Inteligentes */}
        <AnimatedSection delay={0.6}>
          <div className="mt-12 sm:mt-16 lg:mt-20">
            <div className="text-center mb-8 sm:mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-4"
              >
                <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                IA Powered
              </motion.div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 px-4">
                Recomendaciones <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Inteligentes</span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto text-base sm:text-lg px-4">
                Descubre productos seleccionados especialmente para ti basados en tus intereses y comportamiento de compra
              </p>
            </div>
            <SmartRecommendations />
          </div>
        </AnimatedSection>

        {/* Producto Destacado */}
        <AnimatedSection delay={0.8}>
          <FeaturedProduct />
        </AnimatedSection>

        {/* Banner Promocional */}
        <AnimatedSection delay={1.0}>
          <Banner />
        </AnimatedSection>

            {/* Newsletter */}
            <AnimatedSection delay={1.2}>
              <NewsLetter />
            </AnimatedSection>
          </div>
        </div>
      </div>
      
      <Footer />
      <WhatsAppFloat />
    </>
  );
};

export default Home;
