'use client'
import React, { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { assets } from "@/assets/assets";
import OrderSummary from "@/components/OrderSummary";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";

const CartContent = () => {
  const searchParams = useSearchParams();
  const { products, router, cartItems, addToCart, updateCartQuantity, getCartCount, setCartItems, generateCartShareUrl } = useAppContext();

  // Función para cargar carrito desde URL
  useEffect(() => {
    const productsParam = searchParams.get('products');
    if (productsParam && products.length > 0) {
      try {
        // Formato: id1:cantidad1,id2:cantidad2,id3:cantidad3
        const productPairs = productsParam.split(',');
        const newCartItems = {};
        
        productPairs.forEach(pair => {
          const [productId, quantity] = pair.split(':');
          if (productId && quantity && !isNaN(parseInt(quantity))) {
            // Verificar que el producto existe
            const productExists = products.find(p => p._id === productId);
            if (productExists) {
              newCartItems[productId] = parseInt(quantity);
            }
          }
        });
        
        // Solo actualizar si hay productos válidos
        if (Object.keys(newCartItems).length > 0) {
          setCartItems(newCartItems);
        }
      } catch (error) {
        console.error('Error al parsear productos de la URL:', error);
      }
    }
  }, [searchParams, products, setCartItems]);

  return (
    <>
      <Navbar />
      
      {/* Background decorativo */}
      <div className="relative min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100"></div>
        
        {/* Elementos decorativos */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-[#feecaf]/20 to-yellow-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        {/* Contenido principal */}
        <div className="relative z-10">
          <div className="px-6 md:px-16 lg:px-32 pt-8 pb-16">
            {/* Header del carrito */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#feecaf] to-yellow-300 text-gray-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                Tu Carrito de Compras
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Mi <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#feecaf] to-yellow-300">Carrito</span>
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Revisa tus productos seleccionados y procede al checkout
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Lista de productos */}
              <div className="flex-1">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Productos ({getCartCount()} artículos)
                    </h2>
                    {getCartCount() > 0 && (
                      <button
                        onClick={() => {
                          const shareUrl = generateCartShareUrl();
                          if (shareUrl) {
                            navigator.clipboard.writeText(shareUrl);
                            alert('¡URL del carrito copiada al portapapeles!');
                          }
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 text-sm font-medium flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                        Compartir
                      </button>
                    )}
                  </div>
                  
                  {/* Lista de productos en cards */}
                  <div className="space-y-4">
                    {Object.keys(cartItems).map((itemId) => {
                      const product = products.find(product => product._id === itemId);

                      if (!product || cartItems[itemId] <= 0) return null;

                      return (
                        <div key={itemId} className="bg-white border border-gray-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                          <div className="flex items-center gap-6">
                            {/* Imagen del producto */}
                            <div className="flex-shrink-0">
                              <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden">
                                {product.image && product.image[0] ? (
                                  <Image
                                    src={product.image[0]}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    width={80}
                                    height={80}
                                  />
                                ) : (
                                  <Image
                                    src="/placeholder-product.jpeg"
                                    alt={product.name}
                                    width={80}
                                    height={80}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                            </div>

                            {/* Información del producto */}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                                {product.name}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                {product.description}
                              </p>
                              
                              {/* Precio */}
                              <div className="flex items-center gap-4 mb-3">
                                <div className="flex flex-col">
                                  <span className={`text-lg font-bold ${cartItems[itemId] >= (product.minQuantity && product.minQuantity > 0 ? product.minQuantity : 1) ? 'text-green-600' : 'text-gray-900'}`}>
                                    ${cartItems[itemId] >= (product.minQuantity && product.minQuantity > 0 ? product.minQuantity : 1) ? product.offerPrice : product.price}
                                  </span>
                                  {cartItems[itemId] >= (product.minQuantity && product.minQuantity > 0 ? product.minQuantity : 1) && (
                                    <span className="text-xs text-green-600 font-medium">Precio Mayorista</span>
                                  )}
                                  {cartItems[itemId] < (product.minQuantity && product.minQuantity > 0 ? product.minQuantity : 1) && (
                                    <span className="text-xs text-gray-500">
                                      Necesitas {(product.minQuantity && product.minQuantity > 0 ? product.minQuantity : 1) - cartItems[itemId]} más para precio mayorista
                                    </span>
                                  )}
                                </div>
                                
                                {/* Controles de cantidad */}
                                <div className="flex items-center gap-3">
                                  <button 
                                    onClick={() => updateCartQuantity(product._id, cartItems[itemId] - 1)}
                                    className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                                  >
                                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                    </svg>
                                  </button>
                                  <input 
                                    onChange={e => updateCartQuantity(product._id, Number(e.target.value))} 
                                    type="number" 
                                    value={cartItems[itemId]} 
                                    className="w-12 h-8 border border-gray-200 rounded-lg text-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#feecaf]"
                                  />
                                  <button 
                                    onClick={() => addToCart(product._id)}
                                    className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                                  >
                                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Subtotal y eliminar */}
                            <div className="flex flex-col items-end gap-3">
                              <div className="text-right">
                                <p className="text-lg font-bold text-gray-900">
                                  ${((cartItems[itemId] >= (product.minQuantity && product.minQuantity > 0 ? product.minQuantity : 1) ? product.offerPrice : product.price) * cartItems[itemId]).toFixed(2)}
                                </p>
                                <p className="text-xs text-gray-500">Subtotal</p>
                              </div>
                              <button
                                onClick={() => updateCartQuantity(product._id, 0)}
                                className="px-3 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <button onClick={()=> router.push('/all-products')} className="group flex items-center mt-6 gap-2 text-[#feecaf] hover:text-yellow-300 transition-colors">
                    <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Continuar Comprando
                  </button>
                </div>
              </div>
              
              {/* Resumen del pedido */}
              <div className="lg:w-96">
                <OrderSummary />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Cart = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#feecaf]"></div>
    </div>}>
      <CartContent />
    </Suspense>
  );
};

export default Cart;
