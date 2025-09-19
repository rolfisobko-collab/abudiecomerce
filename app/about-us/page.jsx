'use client'
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

const AboutUs = () => {
  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 py-8 min-h-screen">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Acerca de AbudiCell
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Somos tu tienda en línea de confianza para productos de tecnología y electrónicos, 
            comprometidos con ofrecer la mejor calidad y experiencia de compra.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Nuestra Misión</h2>
            <p className="text-gray-600 mb-4">
              En AbudiCell, nos dedicamos a democratizar el acceso a la tecnología de última generación, 
              ofreciendo productos de alta calidad a precios competitivos con un servicio al cliente excepcional.
            </p>
            <p className="text-gray-600">
              Creemos que la tecnología debe ser accesible para todos, por eso trabajamos incansablemente 
              para brindar las mejores ofertas y la experiencia de compra más conveniente.
            </p>
          </div>
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <div className="w-24 h-24 bg-[#feecaf] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎯</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Compromiso con la Calidad</h3>
            <p className="text-gray-600">
              Cada producto que vendemos pasa por rigurosos controles de calidad para garantizar tu satisfacción.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Nuestros Valores</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 bg-[#feecaf] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Innovación</h3>
              <p className="text-gray-600">
                Siempre estamos a la vanguardia de las últimas tendencias tecnológicas, 
                ofreciendo productos innovadores y de última generación.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 bg-[#feecaf] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Confianza</h3>
              <p className="text-gray-600">
                Construimos relaciones duraderas con nuestros clientes a través de la transparencia, 
                honestidad y servicio excepcional.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 bg-[#feecaf] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Eficiencia</h3>
              <p className="text-gray-600">
                Procesamos y entregamos tus pedidos de manera rápida y eficiente, 
                respetando siempre los tiempos prometidos.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Nuestro Equipo</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-2xl font-semibold mb-4">Experiencia y Pasión</h3>
              <p className="text-gray-600 mb-4">
                Nuestro equipo está compuesto por profesionales apasionados por la tecnología, 
                con años de experiencia en el sector de electrónicos y comercio electrónico.
              </p>
              <p className="text-gray-600">
                Cada miembro de nuestro equipo comparte la visión de hacer la tecnología accesible 
                y brindar una experiencia de compra excepcional a cada cliente.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-2xl font-semibold mb-4">Soporte 24/7</h3>
              <p className="text-gray-600 mb-4">
                Nuestro equipo de soporte al cliente está disponible para ayudarte en cualquier momento, 
                asegurando que tengas la mejor experiencia posible con tus compras.
              </p>
              <p className="text-gray-600">
                Desde consultas sobre productos hasta asistencia post-venta, 
                estamos aquí para resolver cualquier duda que puedas tener.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-black text-white rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">AbudiCell en Números</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[#feecaf] mb-2">10K+</div>
              <div className="text-gray-300">Clientes Satisfechos</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#feecaf] mb-2">500+</div>
              <div className="text-gray-300">Productos Disponibles</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#feecaf] mb-2">24/7</div>
              <div className="text-gray-300">Soporte al Cliente</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#feecaf] mb-2">99%</div>
              <div className="text-gray-300">Satisfacción del Cliente</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-[#feecaf] rounded-lg p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Listo para Experimentar AbudiCell?
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Únete a miles de clientes satisfechos y descubre la mejor tecnología al mejor precio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/all-products" 
              className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition"
            >
              Explorar Productos
            </a>
            <a 
              href="/contact" 
              className="border-2 border-black text-black px-8 py-3 rounded-full font-semibold hover:bg-black hover:text-white transition"
            >
              Contáctanos
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;
