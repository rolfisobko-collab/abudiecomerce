import React from 'react';
import { FaTh, FaList, FaSortAmountDown, FaFilter } from 'react-icons/fa';

const ProductHeader = ({ 
    viewMode, 
    onViewModeChange, 
    sortBy, 
    onSortChange, 
    productCount,
    showFilters,
    onToggleFilters 
}) => {
    const sortOptions = [
        { value: 'name', label: 'Nombre A-Z' },
        { value: 'name-desc', label: 'Nombre Z-A' },
        { value: 'price-asc', label: 'Precio: Menor a Mayor' },
        { value: 'price-desc', label: 'Precio: Mayor a Menor' },
        { value: 'newest', label: 'Más recientes' },
        { value: 'oldest', label: 'Más antiguos' }
    ];

    return (
        <div className="bg-white border-b border-gray-200 p-3 sm:p-4">
            <div className="flex flex-col gap-4">
                {/* Información de resultados */}
                <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-sm text-gray-600">
                        {productCount} producto{productCount !== 1 ? 's' : ''} encontrado{productCount !== 1 ? 's' : ''}
                    </p>
                    
                    {/* Botón de filtros para móvil */}
                    <button
                        onClick={onToggleFilters}
                        className="lg:hidden flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm hover:bg-gray-50 transition-colors"
                    >
                        <FaFilter className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden xs:inline">Filtros</span>
                    </button>
                </div>

                {/* Controles */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    {/* Selector de ordenamiento */}
                    <div className="flex items-center gap-2 flex-1">
                        <FaSortAmountDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                        <select
                            value={sortBy}
                            onChange={(e) => onSortChange(e.target.value)}
                            className="flex-1 px-2 sm:px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        >
                            {sortOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Toggle de vista */}
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden self-start">
                        <button
                            onClick={() => onViewModeChange('grid')}
                            className={`p-2 transition-colors ${
                                viewMode === 'grid' 
                                    ? 'bg-black text-white' 
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                            title="Vista de cuadrícula"
                        >
                            <FaTh className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <button
                            onClick={() => onViewModeChange('list')}
                            className={`p-2 transition-colors ${
                                viewMode === 'list' 
                                    ? 'bg-black text-white' 
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                            title="Vista de lista"
                        >
                            <FaList className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductHeader;
