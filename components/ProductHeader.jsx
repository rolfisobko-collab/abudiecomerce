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
        <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Información de resultados */}
                <div className="flex items-center gap-4">
                    <p className="text-sm text-gray-600">
                        {productCount} producto{productCount !== 1 ? 's' : ''} encontrado{productCount !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Controles */}
                <div className="flex items-center gap-4">
                    {/* Botón de filtros para móvil */}
                    <button
                        onClick={onToggleFilters}
                        className="sm:hidden flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                    >
                        <FaFilter className="w-4 h-4" />
                        Filtros
                    </button>

                    {/* Selector de ordenamiento */}
                    <div className="flex items-center gap-2">
                        <FaSortAmountDown className="w-4 h-4 text-gray-500" />
                        <select
                            value={sortBy}
                            onChange={(e) => onSortChange(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        >
                            {sortOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Toggle de vista */}
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                        <button
                            onClick={() => onViewModeChange('grid')}
                            className={`p-2 transition-colors ${
                                viewMode === 'grid' 
                                    ? 'bg-black text-white' 
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                            title="Vista de cuadrícula"
                        >
                            <FaTh className="w-4 h-4" />
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
                            <FaList className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductHeader;
