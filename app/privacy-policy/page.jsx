'use client'
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 py-8 min-h-screen">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Política de Privacidad
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            En AbudiCell, nos comprometemos a proteger tu privacidad y datos personales. 
            Esta política explica cómo recopilamos, usamos y protegemos tu información.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Última actualización: 18 de enero de 2025
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Información que recopilamos */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Información que Recopilamos</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Personal</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Nombre completo y datos de contacto</li>
                <li>Dirección de correo electrónico</li>
                <li>Número de teléfono</li>
                <li>Dirección de envío y facturación</li>
                <li>Información de pago (procesada de forma segura)</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-4 mt-6">Información Técnica</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Dirección IP y ubicación geográfica</li>
                <li>Tipo de navegador y dispositivo</li>
                <li>Páginas visitadas y tiempo de navegación</li>
                <li>Cookies y tecnologías similares</li>
              </ul>
            </div>
          </section>

          {/* Cómo usamos la información */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Cómo Usamos tu Información</h2>
            <div className="bg-blue-50 rounded-lg p-6">
              <ul className="list-disc list-inside space-y-3 text-gray-700">
                <li><strong>Procesar pedidos:</strong> Para completar tus compras y entregas</li>
                <li><strong>Comunicación:</strong> Enviar confirmaciones, actualizaciones y soporte</li>
                <li><strong>Mejora del servicio:</strong> Analizar el uso para mejorar nuestra plataforma</li>
                <li><strong>Marketing:</strong> Enviar ofertas y promociones (con tu consentimiento)</li>
                <li><strong>Seguridad:</strong> Prevenir fraudes y proteger tu cuenta</li>
                <li><strong>Cumplimiento legal:</strong> Cumplir con regulaciones aplicables</li>
              </ul>
            </div>
          </section>

          {/* Compartir información */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Compartir tu Información</h2>
            <div className="bg-yellow-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                <strong>No vendemos tu información personal.</strong> Solo compartimos datos en las siguientes circunstancias:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Con proveedores de servicios (envío, pago) para completar tu pedido</li>
                <li>Con autoridades legales cuando sea requerido por ley</li>
                <li>En caso de fusión o adquisición empresarial</li>
                <li>Con tu consentimiento explícito</li>
              </ul>
            </div>
          </section>

          {/* Seguridad */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Seguridad de Datos</h2>
            <div className="bg-green-50 rounded-lg p-6">
              <ul className="list-disc list-inside space-y-3 text-gray-700">
                <li><strong>Encriptación SSL:</strong> Todos los datos se transmiten de forma segura</li>
                <li><strong>Almacenamiento seguro:</strong> Bases de datos protegidas con medidas de seguridad</li>
                <li><strong>Acceso limitado:</strong> Solo personal autorizado puede acceder a datos personales</li>
                <li><strong>Monitoreo continuo:</strong> Sistemas de seguridad 24/7</li>
                <li><strong>Actualizaciones regulares:</strong> Mantenemos nuestros sistemas actualizados</li>
              </ul>
            </div>
          </section>

          {/* Cookies */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Cookies y Tecnologías Similares</h2>
            <div className="bg-purple-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                Utilizamos cookies para mejorar tu experiencia de navegación:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Cookies esenciales:</strong> Necesarias para el funcionamiento básico del sitio</li>
                <li><strong>Cookies de rendimiento:</strong> Para analizar el uso y mejorar la experiencia</li>
                <li><strong>Cookies de funcionalidad:</strong> Para recordar tus preferencias</li>
                <li><strong>Cookies de marketing:</strong> Para mostrar anuncios relevantes (opcional)</li>
              </ul>
              <p className="text-gray-600 mt-4 text-sm">
                Puedes gestionar las cookies desde la configuración de tu navegador.
              </p>
            </div>
          </section>

          {/* Tus derechos */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Tus Derechos</h2>
            <div className="bg-indigo-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">Tienes derecho a:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Acceso:</strong> Solicitar una copia de tus datos personales</li>
                <li><strong>Rectificación:</strong> Corregir información inexacta</li>
                <li><strong>Eliminación:</strong> Solicitar la eliminación de tus datos</li>
                <li><strong>Limitación:</strong> Restringir el procesamiento de tus datos</li>
                <li><strong>Portabilidad:</strong> Recibir tus datos en formato estructurado</li>
                <li><strong>Oposición:</strong> Oponerte al procesamiento de tus datos</li>
              </ul>
            </div>
          </section>

          {/* Retención de datos */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Retención de Datos</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                Conservamos tu información personal solo durante el tiempo necesario para:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Cumplir con los propósitos descritos en esta política</li>
                <li>Satisfacer requisitos legales y regulatorios</li>
                <li>Resolver disputas y hacer cumplir acuerdos</li>
              </ul>
              <p className="text-gray-600 mt-4 text-sm">
                Los datos de pedidos se conservan por 7 años para fines contables y fiscales.
              </p>
            </div>
          </section>

          {/* Cambios a la política */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Cambios a esta Política</h2>
            <div className="bg-orange-50 rounded-lg p-6">
              <p className="text-gray-700">
                Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos sobre 
                cambios significativos a través de:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mt-4">
                <li>Correo electrónico</li>
                <li>Aviso prominente en nuestro sitio web</li>
                <li>Notificación en la aplicación</li>
              </ul>
              <p className="text-gray-600 mt-4 text-sm">
                Te recomendamos revisar esta política periódicamente para mantenerte informado.
              </p>
            </div>
          </section>

          {/* Contacto */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">9. Contacto</h2>
            <div className="bg-black text-white rounded-lg p-6">
              <p className="text-gray-300 mb-4">
                Si tienes preguntas sobre esta política de privacidad o sobre el manejo de tus datos personales, 
                puedes contactarnos:
              </p>
              <div className="space-y-2 text-gray-300">
                <p><strong>Correo electrónico:</strong> Compras@abudicell.com</p>
                <p><strong>WhatsApp:</strong> +54 9 3764 96-2902 (Sol)</p>
                <p><strong>Horario de atención:</strong> Lunes a Viernes, 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;

