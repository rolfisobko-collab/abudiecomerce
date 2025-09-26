import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';

const ProductFilters = ({ 
    onFiltersChange, 
    categories = [], 
    priceRange = { min: 0, max: 1000 },
    selectedFilters = {}
}) => {
    const { products, categories: allCategories, getCategoryName } = useAppContext();
    const [localFilters, setLocalFilters] = useState(selectedFilters);
    const [brands, setBrands] = useState([]);

    // Cargar marcas desde la API
    const fetchBrands = async () => {
        try {
            const { data } = await axios.get('/api/brands');
            if (data.success) {
                setBrands(data.brands);
            }
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    };

    // Obtener categorías únicas de los productos con sus nombres
    const uniqueCategories = [...new Set(products.map(product => product.category))].filter(Boolean);
    const categoriesWithNames = uniqueCategories.map(categoryId => {
        const categoryName = getCategoryName(categoryId);
        console.log('🔍 [FILTER DEBUG] Categoría ID:', categoryId, 'Nombre:', categoryName);
        return {
            id: categoryId,
            name: categoryName || `Categoría ${categoryId.slice(-4)}` // Fallback si no encuentra nombre
        };
    });
    
    // Obtener marcas únicas de los productos
    const uniqueBrands = [...new Set(products.map(product => product.brand))].filter(Boolean);
    const brandsWithNames = uniqueBrands.map(brandId => {
        const brand = brands.find(b => b._id === brandId);
        return {
            id: brandId,
            name: brand ? brand.name : brandId
        };
    });

    console.log('🔍 [FILTER DEBUG] Productos recibidos:', products.length);
    console.log('🔍 [FILTER DEBUG] Categorías únicas:', uniqueCategories.length);
    console.log('🔍 [FILTER DEBUG] Marcas únicas:', uniqueBrands.length);
    console.log('🔍 [FILTER DEBUG] Marcas cargadas:', brands.length);
    
    // Calcular rango de precios real
    const prices = products.map(p => p.offerPrice).filter(p => p > 0);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 1000;

    const handleFilterChange = (filterType, value) => {
        const newFilters = { ...localFilters };
        
        console.log('🔍 [FILTER COMPONENT DEBUG] Cambio de filtro:', { filterType, value, currentFilters: localFilters });
        
        if (filterType === 'categories') {
            if (newFilters.categories?.includes(value)) {
                newFilters.categories = newFilters.categories.filter(c => c !== value);
            } else {
                newFilters.categories = [...(newFilters.categories || []), value];
            }
        } else if (filterType === 'brands') {
            if (newFilters.brands?.includes(value)) {
                newFilters.brands = newFilters.brands.filter(b => b !== value);
            } else {
                newFilters.brands = [...(newFilters.brands || []), value];
            }
        } else if (filterType === 'priceRange') {
            newFilters.priceRange = value;
        } else if (filterType === 'inStock') {
            newFilters.inStock = value;
        }
        
        console.log('🔍 [FILTER COMPONENT DEBUG] Nuevos filtros:', newFilters);
        setLocalFilters(newFilters);
        onFiltersChange(newFilters);
    };

    const clearFilters = () => {
        const clearedFilters = {};
        setLocalFilters(clearedFilters);
        onFiltersChange(clearedFilters);
    };

    // Cargar marcas al montar el componente
    useEffect(() => {
        fetchBrands();
    }, []);

    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Filtros</h3>
                <button 
                    onClick={clearFilters}
                    className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 underline"
                >
                    Limpiar todo
                </button>
            </div>

            {/* Filtro por categorías */}
            <div className="mb-4 sm:mb-6">
                <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-2 sm:mb-3">Categorías</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                    {categoriesWithNames.map(category => (
                        <label key={category.id} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={localFilters.categories?.includes(category.id) || false}
                                onChange={() => handleFilterChange('categories', category.id)}
                                className="h-3 w-3 sm:h-4 sm:w-4 text-black focus:ring-black border-gray-300 rounded"
                            />
                            <span className="ml-2 text-xs sm:text-sm text-gray-700 capitalize">
                                {category.name} ({products.filter(p => p.category === category.id).length})
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Filtro por marcas */}
            <div className="mb-4 sm:mb-6">
                <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-2 sm:mb-3">Marcas</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                    {brandsWithNames.map(brand => (
                        <label key={brand.id} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={localFilters.brands?.includes(brand.id) || false}
                                onChange={() => handleFilterChange('brands', brand.id)}
                                className="h-3 w-3 sm:h-4 sm:w-4 text-black focus:ring-black border-gray-300 rounded"
                            />
                            <span className="ml-2 text-xs sm:text-sm text-gray-700 capitalize">
                                {brand.name} ({products.filter(p => p.brand === brand.id).length})
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Filtro por rango de precios */}
            <div className="mb-4 sm:mb-6">
                <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-2 sm:mb-3">Rango de precios</h4>
                <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center space-x-2">
                        <input
                            type="number"
                            placeholder="Mín"
                            value={localFilters.priceRange?.min || ''}
                            onChange={(e) => handleFilterChange('priceRange', {
                                ...localFilters.priceRange,
                                min: parseFloat(e.target.value) || 0
                            })}
                            className="w-16 sm:w-20 px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                        />
                        <span className="text-gray-500 text-xs sm:text-sm">-</span>
                        <input
                            type="number"
                            placeholder="Máx"
                            value={localFilters.priceRange?.max || ''}
                            onChange={(e) => handleFilterChange('priceRange', {
                                ...localFilters.priceRange,
                                max: parseFloat(e.target.value) || maxPrice
                            })}
                            className="w-16 sm:w-20 px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                        />
                    </div>
                    <div className="text-xs text-gray-500">
                        Rango: ${minPrice} - ${maxPrice}
                    </div>
                </div>
            </div>

            {/* Filtro por disponibilidad */}
            <div className="mb-4 sm:mb-6">
                <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-2 sm:mb-3">Disponibilidad</h4>
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={localFilters.inStock || false}
                        onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                        className="h-3 w-3 sm:h-4 sm:w-4 text-black focus:ring-black border-gray-300 rounded"
                    />
                    <span className="ml-2 text-xs sm:text-sm text-gray-700">
                        Solo productos disponibles
                    </span>
                </label>
            </div>

            {/* Contador de resultados */}
            <div className="pt-3 sm:pt-4 border-t border-gray-200">
                <p className="text-xs sm:text-sm text-gray-600">
                    {products.length} productos encontrados
                </p>
            </div>
        </div>
    );
};

export default ProductFilters;
