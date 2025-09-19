import { useAppContext } from "@/context/AppContext";
import { useCurrency } from "@/context/CurrencyContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const OrderSummary = () => {

  const { currency, router, getCartCount, getCartAmount, getToken, user , cartItems, setCartItems } = useAppContext()
  const { formatPrice } = useCurrency()
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [userAddresses, setUserAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [paymentProof, setPaymentProof] = useState('');
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

  const fetchUserAddresses = async () => {
    try {
      
      const token = await getToken()
      const {data} = await axios.get('/api/user/get-address',{headers:{Authorization:`Bearer ${token}`}})
      if (data.success) {
        setUserAddresses(data.addresses)
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0])
        }
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const fetchPaymentMethods = async () => {
    try {
      const {data} = await axios.get('/api/payment-methods')
      if (data.success) {
        setPaymentMethods(data.paymentMethods)
        if (data.paymentMethods.length > 0) {
          setSelectedPaymentMethod(data.paymentMethods[0])
        }
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Error al cargar medios de pago')
    }
  }

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const createOrder = async () => {
    try {

      if (!user) {
        return toast('Por favor inicia sesión para realizar el pedido',{
          icon: '⚠️',
        })
    }
      
      if (!selectedAddress) {
        return toast.error('Por favor selecciona una dirección')
      }

      if (!selectedPaymentMethod) {
        return toast.error('Por favor selecciona un medio de pago')
      }

      if (!paymentProof.trim()) {
        return toast.error('Por favor ingresa el comprobante de pago o hash de transacción')
      }

      let cartItemsArray = Object.keys(cartItems).map((key) => ({product:key, quantity:cartItems[key]}))
      cartItemsArray = cartItemsArray.filter(item => item.quantity > 0)

      if (cartItemsArray.length === 0) {
        return toast.error('El carrito está vacío')
      }

      const token = await getToken()

      const { data } = await axios.post('/api/order/create',{
        address: selectedAddress._id,
        items: cartItemsArray,
        paymentMethod: selectedPaymentMethod._id,
        paymentProof: paymentProof
      },{
        headers: {Authorization:`Bearer ${token}`}
      })

      if (data.success) {
        toast.success(data.message)
        setCartItems({})
        router.push('/order-placed')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    // Siempre cargar métodos de pago
    fetchPaymentMethods();
    
    // Solo cargar direcciones si el usuario está logueado
    if (user) {
      fetchUserAddresses();
    }
  }, [user])

  return (
    <div className="w-full lg:w-96 bg-gray-500/5 p-4 sm:p-5 rounded-xl sm:rounded-2xl">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-700">
        Resumen del Pedido
      </h2>
      <hr className="border-gray-500/30 my-4 sm:my-5" />
      <div className="space-y-4 sm:space-y-6">
        {user ? (
          <div>
            <label className="text-sm sm:text-base font-medium uppercase text-gray-600 block mb-2">
              Seleccionar Dirección
            </label>
            <div className="relative inline-block w-full text-sm border rounded-lg">
              <button
                className="peer w-full text-left px-3 sm:px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none rounded-lg"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="text-xs sm:text-sm">
                  {selectedAddress
                    ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
                    : "Seleccionar Dirección"}
                </span>
                <svg className={`w-4 h-4 sm:w-5 sm:h-5 inline float-right transition-transform duration-200 ${isDropdownOpen ? "rotate-0" : "-rotate-90"}`}
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#6B7280"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                  {userAddresses.map((address, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                      onClick={() => handleAddressSelect(address)}
                    >
                      {address.fullName}, {address.area}, {address.city}, {address.state}
                    </li>
                  ))}
                  <li
                    onClick={() => router.push("/add-address")}
                    className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
                  >
                    + Agregar Nueva Dirección
                  </li>
                </ul>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-sm font-medium text-yellow-800">Inicia sesión para continuar</span>
            </div>
            <p className="text-xs text-yellow-700 mb-3">
              Necesitas iniciar sesión para seleccionar una dirección de envío y completar tu pedido.
            </p>
            <button
              onClick={() => {
                // Guardar la URL actual en localStorage para redireccionar después del login
                localStorage.setItem('redirectAfterLogin', window.location.href);
                router.push('/auth/signin');
              }}
              className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
            >
              Iniciar Sesión
            </button>
          </div>
        )}

        <div>
          <label className="text-sm sm:text-base font-medium uppercase text-gray-600 block mb-2">
            Medio de Pago
          </label>
          <div className="relative inline-block w-full text-sm border rounded-lg">
            <select
              value={selectedPaymentMethod?._id || ''}
              onChange={(e) => {
                const method = paymentMethods.find(m => m._id === e.target.value);
                setSelectedPaymentMethod(method);
                setShowPaymentDetails(!!method);
                setPaymentProof('');
              }}
              className="peer w-full text-left px-3 sm:px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none rounded-lg text-xs sm:text-sm"
            >
              <option value="">Definir medio de pago</option>
              {paymentMethods.map((method) => (
                <option key={method._id} value={method._id}>
                  {method.name} ({method.category} - {method.currency})
                </option>
              ))}
            </select>
          </div>
          
          {selectedPaymentMethod && (
            <div className="mt-3 space-y-3">
              <div className="p-4 bg-gray-50 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    selectedPaymentMethod.type === 'BANK_TRANSFER' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedPaymentMethod.category}
                  </span>
                  <span className="text-sm text-gray-600">{selectedPaymentMethod.currency}</span>
                </div>
                
                <div className="text-sm space-y-1">
                  {selectedPaymentMethod.type === 'BANK_TRANSFER' && (
                    <>
                      <p><strong>Banco:</strong> {selectedPaymentMethod.bankName}</p>
                      <p><strong>Cuenta:</strong> {selectedPaymentMethod.accountNumber}</p>
                      <p><strong>Titular:</strong> {selectedPaymentMethod.accountHolder}</p>
                      {selectedPaymentMethod.cbu && <p><strong>CBU:</strong> <span className="font-mono text-xs">{selectedPaymentMethod.cbu}</span></p>}
                      {selectedPaymentMethod.pix && <p><strong>PIX:</strong> <span className="font-mono text-xs">{selectedPaymentMethod.pix}</span></p>}
                    </>
                  )}
                  
                  {selectedPaymentMethod.type === 'CRYPTO' && (
                    <>
                      <p><strong>Wallet:</strong> <span className="font-mono text-xs break-all">{selectedPaymentMethod.walletAddress}</span></p>
                      <p><strong>Red:</strong> {selectedPaymentMethod.network}</p>
                    </>
                  )}
                  
                  <p><strong>Instrucciones:</strong> {selectedPaymentMethod.instructions}</p>
                  <p><strong>Procesamiento:</strong> {selectedPaymentMethod.processingTime}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comprobante de Pago / Hash de Transacción
                </label>
                <textarea
                  value={paymentProof}
                  onChange={(e) => setPaymentProof(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#feecaf] focus:border-transparent outline-none"
                  placeholder={selectedPaymentMethod.type === 'CRYPTO' 
                    ? "Ingresa el hash de la transacción (ej: 0x1234...)" 
                    : "Ingresa el número de comprobante o referencia de la transferencia"
                  }
                  rows={2}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {selectedPaymentMethod.type === 'CRYPTO' 
                    ? "Copia y pega el hash de la transacción desde tu wallet"
                    : "Ingresa el número de comprobante que te proporcionó el banco"
                  }
                </p>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="text-sm sm:text-base font-medium uppercase text-gray-600 block mb-2">
            Código Promocional
          </label>
          <div className="flex flex-col sm:flex-row items-start gap-3">
            <input
              type="text"
              placeholder="Ingresa código promocional"
              className="flex-grow w-full outline-none p-2 sm:p-2.5 text-gray-600 border rounded-lg text-sm"
            />
            <button className="bg-[#feecaf] text-black px-6 sm:px-9 py-2 hover:bg-[#feecaf]/80 rounded-lg text-sm sm:text-base w-full sm:w-auto">
              Aplicar
            </button>
          </div>
        </div>

        <hr className="border-gray-500/30 my-4 sm:my-5" />

        <div className="space-y-3 sm:space-y-4">
          <div className="flex justify-between text-sm sm:text-base font-medium">
            <p className="uppercase text-gray-600">Artículos {getCartCount()}</p>
            <p className="text-gray-800">{formatPrice(getCartAmount())}</p>
          </div>
          <div className="flex justify-between text-base sm:text-lg lg:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>{formatPrice(getCartAmount())}</p>
          </div>
        </div>
      </div>

      <button 
        onClick={user ? createOrder : () => {
          // Guardar la URL actual en localStorage para redireccionar después del login
          localStorage.setItem('redirectAfterLogin', window.location.href);
          router.push('/auth/signin');
        }} 
        className="w-full bg-[#feecaf] text-black py-3 sm:py-3 mt-4 sm:mt-5 hover:bg-[#feecaf]/80 rounded-lg text-sm sm:text-base font-medium"
      >
        {user ? 'Realizar Pedido' : 'Iniciar Sesión para Comprar'}
      </button>
    </div>
  );
};

export default OrderSummary;