'use client'
import ProductCard from "@/components/ProductCard";
import ProductListItem from "@/components/ProductListItem";
import ProductFilters from "@/components/ProductFilters";
import ProductHeader from "@/components/ProductHeader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { useAppContext } from "@/context/AppContext";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

const AllProductsContent = () => {
    const { products, categories, getCategoryName, isLoadingProducts } = useAppContext();
    
    console.log('🔍 [ALL PRODUCTS DEBUG] Productos cargados:', products.length);
    console.log('🔍 [ALL PRODUCTS DEBUG] Categorías cargadas:', categories.length);
    console.log('🔍 [ALL PRODUCTS DEBUG] Cargando productos:', isLoadingProducts);
    const searchParams = useSearchParams();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'list'
    const [sortBy, setSortBy] = useState('name');
    const [filters, setFilters] = useState({});
    
    console.log('🔍 [ALL PRODUCTS DEBUG] Estado inicial de filtros:', filters);
    const [showFilters, setShowFilters] = useState(false);

    // Función de búsqueda súper potente (igual que en navbar)
    const performSearch = (query, productList) => {
        if (!query.trim()) {
            return productList;
        }

        const searchTerm = query.toLowerCase().trim();
        return productList.filter(product => {
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
    };

    // Función para aplicar filtros
    const applyFilters = (productList) => {
        let filtered = [...productList];
        
        console.log('🔍 [FILTER DEBUG] Productos originales:', productList.length);
        console.log('🔍 [FILTER DEBUG] Filtros activos:', filters);
        console.log('🔍 [FILTER DEBUG] Tipo de filtros:', typeof filters, filters);

        // Filtro por categorías
        if (filters.categories && filters.categories.length > 0) {
            console.log('🔍 [FILTER DEBUG] Aplicando filtro de categorías:', filters.categories);
            filtered = filtered.filter(product => 
                filters.categories.includes(product.category)
            );
            console.log('🔍 [FILTER DEBUG] Después de filtro de categorías:', filtered.length);
        }

        // Filtro por marcas
        if (filters.brands && filters.brands.length > 0) {
            console.log('🔍 [FILTER DEBUG] Aplicando filtro de marcas:', filters.brands);
            filtered = filtered.filter(product => 
                filters.brands.includes(product.brand)
            );
            console.log('🔍 [FILTER DEBUG] Después de filtro de marcas:', filtered.length);
        }

        // Filtro por rango de precios
        if (filters.priceRange) {
            const { min, max } = filters.priceRange;
            console.log('🔍 [FILTER DEBUG] Aplicando filtro de precios:', { min, max });
            filtered = filtered.filter(product => {
                const price = product.offerPrice;
                return price >= (min || 0) && price <= (max || Infinity);
            });
            console.log('🔍 [FILTER DEBUG] Después de filtro de precios:', filtered.length);
        }

        // Filtro por disponibilidad
        if (filters.inStock) {
            console.log('🔍 [FILTER DEBUG] Aplicando filtro de stock');
            filtered = filtered.filter(product => product.stock > 0);
            console.log('🔍 [FILTER DEBUG] Después de filtro de stock:', filtered.length);
        }

        console.log('🔍 [FILTER DEBUG] Productos filtrados finales:', filtered.length);
        return filtered;
    };

    // Función para ordenar productos
    const sortProducts = (productList) => {
        const sorted = [...productList];
        
        switch (sortBy) {
            case 'name':
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case 'name-desc':
                return sorted.sort((a, b) => b.name.localeCompare(a.name));
            case 'price-asc':
                return sorted.sort((a, b) => a.offerPrice - b.offerPrice);
            case 'price-desc':
                return sorted.sort((a, b) => b.offerPrice - a.offerPrice);
            case 'newest':
                return sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
            case 'oldest':
                return sorted.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
            default:
                return sorted;
        }
    };

    // Efecto para manejar búsquedas desde el navbar y aplicar filtros/ordenamiento
    useEffect(() => {
        const searchParam = searchParams.get('search');
        let processedProducts = products;

        if (searchParam) {
            setSearchQuery(searchParam);
            processedProducts = performSearch(searchParam, products);
        } else {
            setSearchQuery('');
        }

        // Aplicar filtros
        processedProducts = applyFilters(processedProducts);
        
        // Aplicar ordenamiento
        processedProducts = sortProducts(processedProducts);

        setFilteredProducts(processedProducts);
    }, [searchParams, products, filters, sortBy]);

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
                {/* Header de la página */}
                <div className="relative overflow-hidden">
                    {/* Background decorativo */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#feecaf]/5 via-transparent to-yellow-300/5"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#feecaf]/10 to-transparent rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-yellow-300/10 to-transparent rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10 px-4 sm:px-6 md:px-16 lg:px-32 py-8 sm:py-12">
                        <div className="flex flex-col items-center text-center">
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#feecaf] to-yellow-300 text-gray-800 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-4">
                                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                {searchQuery ? 'Resultados de búsqueda' : 'Catálogo completo'}
                            </div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 px-4">
                                {searchQuery ? (
                                    <>
                                        Resultados para <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#feecaf] to-yellow-300">"{searchQuery}"</span>
                                    </>
                                ) : (
                                    <>
                                        Todos los <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#feecaf] to-yellow-300">Productos</span>
                                    </>
                                )}
                            </h1>
                            <p className="text-gray-600 text-base sm:text-lg max-w-2xl px-4">
                                {searchQuery 
                                    ? `Encontramos ${filteredProducts.length} producto${filteredProducts.length !== 1 ? 's' : ''} que coinciden con tu búsqueda`
                                    : 'Descubre nuestra amplia gama de productos de tecnología y electrónicos'
                                }
                            </p>
                            
                            {/* Mostrar búsqueda actual */}
                            {searchQuery && (
                                <div className="mt-4 flex items-center justify-center gap-2">
                                    <span className="text-sm text-gray-600">Búsqueda:</span>
                                    <span className="bg-[#feecaf] text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                                        "{searchQuery}"
                                    </span>
                                    <button 
                                        onClick={() => {
                                            setSearchQuery('')
                                            // Limpiar URL
                                            window.history.replaceState({}, '', '/all-products')
                                        }}
                                        className="text-gray-500 hover:text-gray-700 text-sm underline"
                                    >
                                        Limpiar
                                    </button>
                                </div>
                            )}
                            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-[#feecaf] to-yellow-300 rounded-full mt-4 sm:mt-6"></div>
                        </div>
                    </div>
                </div>
                
                {/* Contenido principal */}
                <div className="px-4 sm:px-6 md:px-16 lg:px-32 py-8">
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                        {/* Sidebar de filtros - Desktop */}
                        <div className="hidden lg:block w-72 flex-shrink-0">
                            <div className="sticky top-24">
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
                                    <ProductFilters
                                        products={products}
                                        onFiltersChange={setFilters}
                                        selectedFilters={filters}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contenido principal */}
                        <div className="flex-1 min-w-0">
                            {/* Header de productos */}
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-4 sm:p-6 mb-6 lg:mb-8">
                                <ProductHeader
                                    viewMode={viewMode}
                                    onViewModeChange={setViewMode}
                                    sortBy={sortBy}
                                    onSortChange={setSortBy}
                                    productCount={filteredProducts.length}
                                    showFilters={showFilters}
                                    onToggleFilters={() => setShowFilters(!showFilters)}
                                />
                            </div>

                            {/* Filtros móviles - Modal/Drawer */}
                            {showFilters && (
                                <div className="lg:hidden mb-6 lg:mb-8">
                                    {/* Overlay */}
                                    <div 
                                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                                        onClick={() => setShowFilters(false)}
                                    ></div>
                                    
                                    {/* Drawer de filtros */}
                                    <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white z-50 lg:hidden transform transition-transform duration-300 ease-in-out">
                                        <div className="h-full flex flex-col">
                                            {/* Header del drawer */}
                                            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                                                <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
                                                <button
                                                    onClick={() => setShowFilters(false)}
                                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                                >
                                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                            
                                            {/* Contenido del drawer */}
                                            <div className="flex-1 overflow-y-auto p-4">
                                                <ProductFilters
                                                    onFiltersChange={setFilters}
                                                    selectedFilters={filters}
                                                />
                                            </div>
                                            
                                            {/* Footer del drawer */}
                                            <div className="p-4 border-t border-gray-200">
                                                <button
                                                    onClick={() => setShowFilters(false)}
                                                    className="w-full bg-gradient-to-r from-[#feecaf] to-yellow-300 text-gray-800 py-3 rounded-xl font-semibold hover:from-yellow-300 hover:to-[#feecaf] transition-all duration-300"
                                                >
                                                    Aplicar Filtros
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Lista de productos */}
                            {filteredProducts.length > 0 ? (
                                <div className="space-y-6 lg:space-y-8">
                                    {viewMode === 'grid' ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                            {filteredProducts.map((product, index) => (
                                                <ProductCard key={index} product={product} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {filteredProducts.map((product, index) => (
                                                <ProductListItem key={index} product={product} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-12">
                                        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3">No se encontraron productos</h3>
                                        <p className="text-gray-600 mb-6">
                                            {searchQuery 
                                                ? 'Intenta con otros términos de búsqueda o ajusta los filtros'
                                                : 'Ajusta los filtros para ver más productos'
                                            }
                                        </p>
                                        {searchQuery && (
                                            <button
                                                onClick={() => {
                                                    setSearchQuery('');
                                                    setFilters({});
                                                }}
                                                className="px-6 py-3 bg-gradient-to-r from-[#feecaf] to-yellow-300 text-gray-800 rounded-xl font-semibold hover:from-yellow-300 hover:to-[#feecaf] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                            >
                                                Limpiar búsqueda
                                            </button>
                                        )}
                </div>
                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <WhatsAppFloat />
        </>
    );
};

const AllProducts = () => {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#feecaf]"></div>
        </div>}>
            <AllProductsContent />
        </Suspense>
    );
};

export default AllProducts;
