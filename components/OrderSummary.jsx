import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const OrderSummary = () => {

  const { currency, router, getCartCount, getCartAmount, getToken, user , cartItems, setCartItems } = useAppContext()
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
    if (user) {
      fetchUserAddresses();
      fetchPaymentMethods();
    }
  }, [user])

  return (
    <div className="w-full md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">
        Resumen del Pedido
      </h2>
      <hr className="border-gray-500/30 my-5" />
      <div className="space-y-6">
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Seleccionar Dirección
          </label>
          <div className="relative inline-block w-full text-sm border">
            <button
              className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {selectedAddress
                  ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
                  : "Seleccionar Dirección"}
              </span>
              <svg className={`w-5 h-5 inline float-right transition-transform duration-200 ${isDropdownOpen ? "rotate-0" : "-rotate-90"}`}
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

        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Medio de Pago
          </label>
          <div className="relative inline-block w-full text-sm border">
            <select
              value={selectedPaymentMethod?._id || ''}
              onChange={(e) => {
                const method = paymentMethods.find(m => m._id === e.target.value);
                setSelectedPaymentMethod(method);
                setShowPaymentDetails(!!method);
                setPaymentProof('');
              }}
              className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
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
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Código Promocional
          </label>
          <div className="flex flex-col items-start gap-3">
            <input
              type="text"
              placeholder="Ingresa código promocional"
              className="flex-grow w-full outline-none p-2.5 text-gray-600 border"
            />
            <button className="bg-[#feecaf] text-black px-9 py-2 hover:bg-[#feecaf]/80">
              Aplicar
            </button>
          </div>
        </div>

        <hr className="border-gray-500/30 my-5" />

        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">Artículos {getCartCount()}</p>
            <p className="text-gray-800">{currency}{getCartAmount()}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Costo de Envío</p>
            <p className="font-medium text-gray-800">Gratis</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Impuesto (2%)</p>
            <p className="font-medium text-gray-800">{currency}{Math.floor(getCartAmount() * 0.02)}</p>
          </div>
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>{currency}{getCartAmount() + Math.floor(getCartAmount() * 0.02)}</p>
          </div>
        </div>
      </div>

      <button onClick={createOrder} className="w-full bg-[#feecaf] text-black py-3 mt-5 hover:bg-[#feecaf]/80">
        Realizar Pedido
      </button>
    </div>
  );
};

export default OrderSummary;