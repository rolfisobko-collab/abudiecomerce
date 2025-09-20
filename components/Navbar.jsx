"use client"
import React, { useState, useEffect, useRef } from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon } from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { FaSearch, FaTimes, FaShoppingCart, FaBars, FaUser } from "react-icons/fa";
import CurrencySelector from "./CurrencySelector";
import { useCurrency } from "@/context/CurrencyContext";

const Navbar = () => {

  const { isSeller, router, user, signOut, products, cartItems } = useAppContext();
  const { formatPrice } = useCurrency();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);

  // Función para obtener el contador del carrito
  const getCartCount = () => {
    return Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);
  };

  // Función de búsqueda súper potente
  const performSearch = (query) => {
    if (!query.trim() || !products.length) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const searchTerm = query.toLowerCase().trim();
    const results = products.filter(product => {
      // Búsqueda en nombre
      const nameMatch = product.name.toLowerCase().includes(searchTerm);
      
      // Búsqueda en descripción
      const descMatch = product.description.toLowerCase().includes(searchTerm);
      
      // Búsqueda en categoría
      const categoryMatch = product.category.toLowerCase().includes(searchTerm);
      
      // Búsqueda en precio (como string)
      const priceMatch = product.price.toString().includes(searchTerm) || 
                        product.offerPrice.toString().includes(searchTerm);
      
      // Búsqueda en cantidad mínima
      const minQtyMatch = product.minQuantity.toString().includes(searchTerm);
      
      // Búsqueda por palabras clave (divide el término de búsqueda)
      const searchWords = searchTerm.split(' ').filter(word => word.length > 0);
      const keywordMatch = searchWords.some(word => 
        product.name.toLowerCase().includes(word) ||
        product.description.toLowerCase().includes(word) ||
        product.category.toLowerCase().includes(word) ||
        product.price.toString().includes(word) ||
        product.offerPrice.toString().includes(word)
      );

      // Búsqueda por sinónimos comunes
      const synonymMatch = searchWords.some(word => {
        const synonyms = {
          'telefono': ['phone', 'celular', 'móvil', 'smartphone'],
          'laptop': ['notebook', 'computadora', 'pc'],
          'auricular': ['headphone', 'audífono', 'cascos'],
          'cargador': ['charger', 'cable'],
          'fund': ['funda', 'case', 'estuche'],
          'barato': ['económico', 'low', 'cheap'],
          'caro': ['costoso', 'expensive', 'premium']
        };
        
        return Object.entries(synonyms).some(([key, values]) => 
          (word === key && product.name.toLowerCase().includes(word)) ||
          values.some(synonym => 
            word === synonym && (
              product.name.toLowerCase().includes(synonym) ||
              product.description.toLowerCase().includes(synonym) ||
              product.category.toLowerCase().includes(synonym)
            )
          )
        );
      });

      return nameMatch || descMatch || categoryMatch || priceMatch || minQtyMatch || keywordMatch || synonymMatch;
    });

    // Ordenar resultados por relevancia
    const sortedResults = results.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      
      // Priorizar coincidencias exactas en el nombre
      if (aName === searchTerm) return -1;
      if (bName === searchTerm) return 1;
      
      // Priorizar coincidencias que empiecen con el término
      if (aName.startsWith(searchTerm) && !bName.startsWith(searchTerm)) return -1;
      if (bName.startsWith(searchTerm) && !aName.startsWith(searchTerm)) return 1;
      
      // Ordenar alfabéticamente
      return aName.localeCompare(bName);
    });

    setSearchResults(sortedResults.slice(0, 8)); // Máximo 8 resultados
    setShowSearchResults(sortedResults.length > 0);
  };

  // Debounce para evitar búsquedas excesivas
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, products]);

  // Cerrar resultados al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target) &&
          resultsRef.current && !resultsRef.current.contains(event.target)) {
        setShowSearchResults(false);
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/all-products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchResults(false);
      setIsSearchFocused(false);
    }
  };

  const handleResultClick = (productId) => {
    console.log('🔍 [SEARCH DEBUG] Click en producto:', productId);
    router.push(`/product/${productId}`);
    setShowSearchResults(false);
    setIsSearchFocused(false);
    setSearchQuery('');
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/95 border-b border-gray-800/50 shadow-lg">
      <div className="flex items-center justify-between px-4 md:px-6 lg:px-16 py-4">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            className="cursor-pointer w-24 md:w-28 lg:w-32 transition-transform duration-300 hover:scale-105"
            onClick={() => router.push('/')}
            src="/abudilogo2.png"
            alt="logo"
            width={128}
            height={128}
          />
        </div>

        {/* Navegación Desktop */}
        <div className="hidden lg:flex items-center gap-8">
          <Link href="/" className="relative group text-white hover:text-[#feecaf] transition-all duration-300 font-medium">
            <span>Inicio</span>
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#feecaf] to-yellow-300 transition-all duration-300 group-hover:w-full"></div>
          </Link>
          <Link href="/all-products" className="relative group text-white hover:text-[#feecaf] transition-all duration-300 font-medium">
            <span>Tienda</span>
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#feecaf] to-yellow-300 transition-all duration-300 group-hover:w-full"></div>
          </Link>
          <Link href="/about-us" className="relative group text-white hover:text-[#feecaf] transition-all duration-300 font-medium">
            <span>Acerca de Nosotros</span>
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#feecaf] to-yellow-300 transition-all duration-300 group-hover:w-full"></div>
          </Link>
          <Link href="/contact" className="relative group text-white hover:text-[#feecaf] transition-all duration-300 font-medium">
            <span>Contacto</span>
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#feecaf] to-yellow-300 transition-all duration-300 group-hover:w-full"></div>
          </Link>
        </div>

        {/* Sección derecha Desktop */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Buscador funcional */}
          <div className="relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className="w-64 px-4 py-2.5 pl-12 pr-12 text-gray-900 bg-white/90 backdrop-blur-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#feecaf] focus:bg-white transition-all duration-300 shadow-lg border border-gray-200/50"
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setShowSearchResults(false);
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>

            {/* Resultados de búsqueda */}
            {showSearchResults && searchResults.length > 0 && (
              <div 
                ref={resultsRef}
                className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 z-50 max-h-96 overflow-y-auto"
              >
                <div className="p-4">
                  <div className="text-xs text-gray-500 mb-3 px-2 font-medium">
                    {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} encontrado{searchResults.length !== 1 ? 's' : ''}
                  </div>
                  {searchResults.map((product) => (
                    <button
                      key={product._id}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('🔍 [SEARCH DEBUG] Botón clickeado para producto:', product._id, product.name);
                        handleResultClick(product._id);
                      }}
                      className="w-full flex items-center gap-4 p-3 hover:bg-gradient-to-r hover:from-[#feecaf]/10 hover:to-yellow-300/10 rounded-xl transition-all duration-300 text-left group"
                    >
                      <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex-shrink-0 overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                        {product.image && product.image.length > 0 && product.image[0] ? (
                          <Image
                            src={product.image[0]}
                            alt={product.name}
                            width={56}
                            height={56}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image
                            src="/placeholder-product.jpeg"
                            alt={product.name}
                            width={56}
                            height={56}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate group-hover:text-[#feecaf] transition-colors">{product.name}</h4>
                        <p className="text-sm text-gray-500 truncate capitalize">{product.category}</p>
                        <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#feecaf] to-yellow-300">{formatPrice(product.price)}</p>
                      </div>
                    </button>
                  ))}
                  {searchResults.length >= 8 && (
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full p-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-[#feecaf] to-yellow-300 hover:from-yellow-300 hover:to-[#feecaf] rounded-xl transition-all duration-300 border-t border-gray-200/50 font-semibold"
                    >
                      Ver todos los resultados
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Mensaje cuando no hay resultados */}
            {showSearchResults && searchResults.length === 0 && searchQuery.trim() && (
              <div 
                ref={resultsRef}
                className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 z-50 p-6"
              >
                <div className="text-center text-gray-500">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaSearch className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="font-medium">No se encontraron productos</p>
                  <p className="text-sm mt-1">Intenta con otros términos de búsqueda</p>
                </div>
              </div>
            )}
          </div>

          {/* Selector de Divisas */}
          <div className="bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <CurrencySelector />
          </div>

          {/* Carrito */}
          <button 
            onClick={() => router.push('/cart')}
            className="relative flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-300 text-white border border-white/20"
          >
            <FaShoppingCart className="w-5 h-5" />
            <span className="font-medium">Carrito</span>
            {getCartCount() > 0 && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {getCartCount()}
              </div>
            )}
          </button>

          {/* Usuario */}
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-300 text-white border border-white/20"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[#feecaf] to-yellow-300 rounded-full flex items-center justify-center">
                  <Image src={assets.user_icon} alt="user icon" width={16} height={16} />
                </div>
                <span className="font-medium">{user.name}</span>
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl py-2 z-50 border border-gray-200/50">
                  <button 
                    onClick={() => { router.push('/my-orders'); setShowUserMenu(false); }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-[#feecaf]/10 hover:to-yellow-300/10 transition-all duration-300"
                  >
                    <BagIcon />
                    <span>Mis Pedidos</span>
                  </button>
                  <hr className="my-2 border-gray-200/50" />
                  <button 
                    onClick={() => { signOut(); setShowUserMenu(false); }}
                    className="w-full px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 transition-all duration-300 text-left"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              href="/auth/signin" 
              className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-300 text-white border border-white/20"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-[#feecaf] to-yellow-300 rounded-full flex items-center justify-center">
                <Image src={assets.user_icon} alt="user icon" width={16} height={16} />
              </div>
              <span className="font-medium">Cuenta</span>
            </Link>
          )}
        </div>

        {/* Sección móvil - Solo buscador y menú hamburguesa */}
        <div className="lg:hidden flex items-center gap-3">
          {/* Buscador móvil */}
          <div className="relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-32 px-3 py-2 pl-8 pr-8 text-gray-900 bg-white/90 backdrop-blur-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#feecaf] focus:bg-white transition-all duration-300 text-sm shadow-lg border border-gray-200/50"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-3 h-3" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setShowSearchResults(false);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              )}
            </form>

            {/* Resultados de búsqueda móvil */}
            {showSearchResults && searchResults.length > 0 && (
              <div 
                ref={resultsRef}
                className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 z-50 max-h-80 overflow-y-auto"
              >
                <div className="p-3">
                  <div className="text-xs text-gray-500 mb-2 px-2 font-medium">
                    {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''}
                  </div>
                  {searchResults.map((product) => (
                    <button
                      key={product._id}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('🔍 [SEARCH DEBUG] Botón móvil clickeado para producto:', product._id, product.name);
                        handleResultClick(product._id);
                      }}
                      className="w-full flex items-center gap-3 p-2 hover:bg-gradient-to-r hover:from-[#feecaf]/10 hover:to-yellow-300/10 rounded-xl transition-all duration-300 text-left group"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex-shrink-0 overflow-hidden shadow-sm">
                        {product.image && product.image.length > 0 && product.image[0] ? (
                          <Image
                            src={product.image[0]}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image
                            src="/placeholder-product.jpeg"
                            alt={product.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate text-sm group-hover:text-[#feecaf] transition-colors">{product.name}</h4>
                        <p className="text-xs text-gray-500 truncate capitalize">{product.category}</p>
                        <p className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#feecaf] to-yellow-300">{formatPrice(product.price)}</p>
                      </div>
                    </button>
                  ))}
                  {searchResults.length >= 8 && (
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full p-3 text-center text-transparent bg-clip-text bg-gradient-to-r from-[#feecaf] to-yellow-300 hover:from-yellow-300 hover:to-[#feecaf] rounded-xl transition-all duration-300 border-t border-gray-200/50 text-sm font-semibold"
                    >
                      Ver todos
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Mensaje cuando no hay resultados móvil */}
            {showSearchResults && searchResults.length === 0 && searchQuery.trim() && (
              <div 
                ref={resultsRef}
                className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 z-50 p-4"
              >
                <div className="text-center text-gray-500">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FaSearch className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium">No se encontraron productos</p>
                </div>
              </div>
            )}
          </div>

          {/* Menú hamburguesa */}
          <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-300 text-white border border-white/20"
          >
            <FaBars className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {showMobileMenu && (
        <div className="lg:hidden bg-black/95 backdrop-blur-md border-t border-gray-800/50">
          <div className="px-4 py-4 space-y-3">
            {/* Navegación principal */}
            <Link 
              href="/" 
              onClick={() => setShowMobileMenu(false)}
              className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-all duration-300"
            >
              <HomeIcon />
              <span>Inicio</span>
            </Link>
            <Link 
              href="/all-products" 
              onClick={() => setShowMobileMenu(false)}
              className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-all duration-300"
            >
              <BoxIcon />
              <span>Tienda</span>
            </Link>
            <Link 
              href="/about-us" 
              onClick={() => setShowMobileMenu(false)}
              className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-all duration-300"
            >
              <FaUser className="w-4 h-4" />
              <span>Acerca de Nosotros</span>
            </Link>
            <Link 
              href="/contact" 
              onClick={() => setShowMobileMenu(false)}
              className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-all duration-300"
            >
              <FaUser className="w-4 h-4" />
              <span>Contacto</span>
            </Link>

            {/* Separador */}
            <hr className="my-4 border-gray-700/50" />

            {/* Selector de Divisas */}
            <div className="px-4 py-3">
              <div className="text-white text-sm font-medium mb-2">Moneda</div>
              <div className="bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <CurrencySelector />
              </div>
            </div>

            {/* Carrito */}
            <button 
              onClick={() => { router.push('/cart'); setShowMobileMenu(false); }}
              className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-all duration-300 w-full text-left"
            >
              <div className="relative">
                <FaShoppingCart className="w-4 h-4" />
                {getCartCount() > 0 && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {getCartCount()}
                  </div>
                )}
              </div>
              <span>Carrito ({getCartCount()} artículos)</span>
            </button>

            {/* Usuario */}
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-4 py-3 text-white">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#feecaf] to-yellow-300 rounded-full flex items-center justify-center">
                    <Image src={assets.user_icon} alt="user icon" width={16} height={16} />
                  </div>
                  <span className="font-medium">{user.name}</span>
                </div>
                <button 
                  onClick={() => { router.push('/my-orders'); setShowMobileMenu(false); }}
                  className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-all duration-300 w-full text-left"
                >
                  <BagIcon />
                  <span>Mis Pedidos</span>
                </button>
                <button 
                  onClick={() => { signOut(); setShowMobileMenu(false); }}
                  className="flex items-center gap-3 px-4 py-3 text-white hover:bg-red-500/20 rounded-xl transition-all duration-300 w-full text-left"
                >
                  <FaUser className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            ) : (
              <Link 
                href="/auth/signin" 
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-all duration-300"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[#feecaf] to-yellow-300 rounded-full flex items-center justify-center">
                  <Image src={assets.user_icon} alt="user icon" width={16} height={16} />
                </div>
                <span>Iniciar Sesión</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;