'use client'
import React from 'react';
import { MdClose } from 'react-icons/md';

const TermsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Términos y Condiciones</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="prose prose-sm max-w-none">
            <p className="text-xs text-gray-500 mb-6">
              Última actualización: 18 de enero de 2025
            </p>

            <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">1. ACEPTACIÓN DE TÉRMINOS</h3>
                <p>
                  Al acceder y utilizar los servicios de AbudiCell, usted acepta estar sujeto a estos Términos y Condiciones. 
                  Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestros servicios. 
                  Estos términos constituyen un acuerdo legal vinculante entre usted y AbudiCell.
                </p>
                <p>
                  Nos reservamos el derecho de modificar estos términos en cualquier momento sin previo aviso. 
                  Es su responsabilidad revisar periódicamente estos términos para estar informado de cualquier cambio. 
                  El uso continuado de nuestros servicios después de cualquier modificación constituye su aceptación de los nuevos términos.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">2. DESCRIPCIÓN DE SERVICIOS</h3>
                <p>
                  AbudiCell es una plataforma de comercio electrónico que facilita la venta y compra de productos de tecnología y electrónicos. 
                  Nuestros servicios incluyen, pero no se limitan a: listado de productos, procesamiento de pedidos, 
                  gestión de inventario, procesamiento de pagos, y servicios de atención al cliente.
                </p>
                <p>
                  Nos reservamos el derecho de modificar, suspender o discontinuar cualquier aspecto de nuestros servicios 
                  en cualquier momento sin previo aviso. No seremos responsables ante usted o cualquier tercero por 
                  cualquier modificación, suspensión o discontinuación de nuestros servicios.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">3. REGISTRO Y CUENTA DE USUARIO</h3>
                <p>
                  Para acceder a ciertos servicios, debe registrarse y crear una cuenta. Usted es responsable de mantener 
                  la confidencialidad de su información de cuenta y contraseña. Acepta la responsabilidad de todas las 
                  actividades que ocurran bajo su cuenta o contraseña.
                </p>
                <p>
                  Debe proporcionar información precisa, actual y completa durante el proceso de registro. 
                  Nos reservamos el derecho de rechazar el registro o cancelar cuentas a nuestra sola discreción, 
                  especialmente en casos de información falsa o violación de estos términos.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">4. PRODUCTOS Y PRECIOS</h3>
                <p>
                  Todos los productos, descripciones, especificaciones e imágenes están sujetos a disponibilidad. 
                  Nos reservamos el derecho de modificar precios, productos y especificaciones sin previo aviso. 
                  Los precios mostrados incluyen impuestos aplicables pero excluyen costos de envío, a menos que se indique lo contrario.
                </p>
                <p>
                  Los precios mayoristas están sujetos a cantidades mínimas de compra. Nos reservamos el derecho de 
                  verificar la elegibilidad para precios mayoristas y rechazar pedidos que no cumplan con los requisitos establecidos.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">5. PAGOS Y FACTURACIÓN</h3>
                <p>
                  Aceptamos varios métodos de pago según disponibilidad. Todos los pagos deben realizarse en la moneda 
                  especificada en el sitio web. Los pagos se procesan de forma segura a través de proveedores de servicios 
                  de pago de terceros.
                </p>
                <p>
                  En caso de pago rechazado o insuficiente, nos reservamos el derecho de suspender o cancelar su pedido. 
                  Los cargos por procesamiento de pagos rechazados pueden aplicarse según corresponda.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">6. ENVÍOS Y ENTREGAS</h3>
                <p>
                  Los tiempos de entrega son estimados y pueden variar según la ubicación y disponibilidad del producto. 
                  No garantizamos tiempos de entrega específicos y no seremos responsables por retrasos causados por 
                  factores fuera de nuestro control.
                </p>
                <p>
                  Los costos de envío son responsabilidad del comprador, a menos que se ofrezca envío gratuito. 
                  Los productos se envían a la dirección proporcionada durante el proceso de compra. 
                  Es responsabilidad del comprador asegurar que la dirección de entrega sea correcta.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">7. POLÍTICA DE DEVOLUCIONES</h3>
                <p>
                  Las devoluciones están sujetas a nuestra política de devoluciones, que puede modificarse sin previo aviso. 
                  Los productos deben devolverse en su estado original, con etiquetas y embalaje intactos. 
                  Los costos de devolución son responsabilidad del comprador, a menos que el producto esté defectuoso.
                </p>
                <p>
                  Nos reservamos el derecho de rechazar devoluciones que no cumplan con nuestros criterios. 
                  Los reembolsos se procesarán según el método de pago original y pueden tomar hasta 14 días hábiles.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">8. PROPIEDAD INTELECTUAL</h3>
                <p>
                  Todo el contenido del sitio web, incluyendo pero no limitado a texto, gráficos, logotipos, imágenes, 
                  y software, es propiedad de AbudiCell o sus licenciantes y está protegido por leyes de derechos de autor.
                </p>
                <p>
                  No se otorga ninguna licencia o derecho para usar cualquier marca comercial, marca de servicio, 
                  o logotipo sin nuestro consentimiento previo por escrito. El uso no autorizado puede resultar en 
                  acciones legales.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">9. LIMITACIÓN DE RESPONSABILIDAD</h3>
                <p>
                  En la máxima medida permitida por la ley, AbudiCell no será responsable por daños directos, indirectos, 
                  incidentales, especiales, consecuenciales o punitivos, incluyendo pero no limitado a pérdida de beneficios, 
                  datos, o uso, que surjan del uso o la imposibilidad de usar nuestros servicios.
                </p>
                <p>
                  Nuestra responsabilidad total hacia usted por cualquier reclamo relacionado con estos términos o nuestros 
                  servicios no excederá el monto que pagó por los productos o servicios específicos que dieron lugar al reclamo.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">10. INDEMNIZACIÓN</h3>
                <p>
                  Usted acepta indemnizar, defender y mantener indemne a AbudiCell, sus afiliados, directores, empleados, 
                  agentes y licenciantes de y contra cualquier reclamo, daño, obligación, pérdida, responsabilidad, 
                  costo o deuda, y gastos (incluyendo honorarios de abogados) que surjan de su uso de nuestros servicios.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">11. TERMINACIÓN</h3>
                <p>
                  Podemos terminar o suspender su acceso a nuestros servicios inmediatamente, sin previo aviso o responsabilidad, 
                  por cualquier motivo, incluyendo pero no limitado a la violación de estos Términos y Condiciones.
                </p>
                <p>
                  Al terminar, su derecho a usar nuestros servicios cesará inmediatamente. 
                  Las disposiciones de estos términos que por su naturaleza deben sobrevivir a la terminación 
                  permanecerán en vigor después de la terminación.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">12. LEY APLICABLE</h3>
                <p>
                  Estos Términos y Condiciones se regirán e interpretarán de acuerdo con las leyes de la República Argentina, 
                  sin consideración a sus principios de conflicto de leyes. Cualquier disputa que surja de estos términos 
                  será sometida a la jurisdicción exclusiva de los tribunales competentes de Argentina.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">13. DISPOSICIONES GENERALES</h3>
                <p>
                  Si alguna disposición de estos términos se considera inválida o inaplicable, las disposiciones restantes 
                  permanecerán en pleno vigor y efecto. Nuestra falta de ejercer o hacer cumplir cualquier derecho o 
                  disposición de estos términos no constituirá una renuncia a tal derecho o disposición.
                </p>
                <p>
                  Estos términos constituyen el acuerdo completo entre usted y AbudiCell con respecto al uso de nuestros 
                  servicios y reemplazan todos los acuerdos anteriores y contemporáneos.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">14. CONTACTO</h3>
                <p>
                  Si tiene preguntas sobre estos Términos y Condiciones, puede contactarnos a través de:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Correo electrónico: Compras@abudicell.com</li>
                  <li>WhatsApp: +54 9 3764 96-2902</li>
                  <li>Horario de atención: Lunes a Viernes, 9:00 AM - 6:00 PM</li>
                </ul>
              </section>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#feecaf] text-black rounded-md hover:bg-[#feecaf]/80 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;

