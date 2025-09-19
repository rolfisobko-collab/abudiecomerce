import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';

const ProductFilters = ({ 
    onFiltersChange, 
    categories = [], 
    priceRange = { min: 0, max: 1000 },
    selectedFilters = {}
}) => {
    const { products, categories: allCategories, getCategoryName } = useAppContext();
    const [localFilters, setLocalFilters] = useState(selectedFilters);

    // Obtener categorías únicas de los productos con sus nombres
    const uniqueCategories = [...new Set(products.map(product => product.category))].filter(Boolean);
    const categoriesWithNames = uniqueCategories.map(categoryId => ({
        id: categoryId,
        name: getCategoryName(categoryId)
    }));
    
    // Calcular rango de precios real
    const prices = products.map(p => p.offerPrice).filter(p => p > 0);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    const handleFilterChange = (filterType, value) => {
        const newFilters = { ...localFilters };
        
        if (filterType === 'categories') {
            if (newFilters.categories?.includes(value)) {
                newFilters.categories = newFilters.categories.filter(c => c !== value);
            } else {
                newFilters.categories = [...(newFilters.categories || []), value];
            }
        } else if (filterType === 'priceRange') {
            newFilters.priceRange = value;
        } else if (filterType === 'inStock') {
            newFilters.inStock = value;
        }
        
        setLocalFilters(newFilters);
        onFiltersChange(newFilters);
    };

    const clearFilters = () => {
        const clearedFilters = {};
        setLocalFilters(clearedFilters);
        onFiltersChange(clearedFilters);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
                <button 
                    onClick={clearFilters}
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                    Limpiar todo
                </button>
            </div>

            {/* Filtro por categorías */}
            <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Categorías</h4>
                <div className="space-y-2">
                    {categoriesWithNames.map(category => (
                        <label key={category.id} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={localFilters.categories?.includes(category.id) || false}
                                onChange={() => handleFilterChange('categories', category.id)}
                                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700 capitalize">
                                {category.name} ({products.filter(p => p.category === category.id).length})
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Filtro por rango de precios */}
            <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Rango de precios</h4>
                <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                        <input
                            type="number"
                            placeholder="Mín"
                            value={localFilters.priceRange?.min || ''}
                            onChange={(e) => handleFilterChange('priceRange', {
                                ...localFilters.priceRange,
                                min: parseFloat(e.target.value) || 0
                            })}
                            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                        />
                        <span className="text-gray-500">-</span>
                        <input
                            type="number"
                            placeholder="Máx"
                            value={localFilters.priceRange?.max || ''}
                            onChange={(e) => handleFilterChange('priceRange', {
                                ...localFilters.priceRange,
                                max: parseFloat(e.target.value) || maxPrice
                            })}
                            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                        />
                    </div>
                    <div className="text-xs text-gray-500">
                        Rango: ${minPrice} - ${maxPrice}
                    </div>
                </div>
            </div>

            {/* Filtro por disponibilidad */}
            <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Disponibilidad</h4>
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={localFilters.inStock || false}
                        onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                        className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                        Solo productos disponibles
                    </span>
                </label>
            </div>

            {/* Contador de resultados */}
            <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                    {products.length} productos encontrados
                </p>
            </div>
        </div>
    );
};

export default ProductFilters;
