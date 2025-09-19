import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { useAppContext } from '@/context/AppContext';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ProductSlider = ({ title, products, showViewMore = true, onViewMore }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(5);
    const [isAutoPlay, setIsAutoPlay] = useState(true);

    // Calcular items por vista basado en el tamaño de pantalla
    useEffect(() => {
        const updateItemsPerView = () => {
            const width = window.innerWidth;
            const cardWidth = 280 + 24; // ancho del card + gap
            const availableWidth = width - 128; // restando padding del contenedor
            
            if (width < 640) setItemsPerView(1); // sm - 1 card por vista
            else if (width < 768) setItemsPerView(2); // md - 2 cards por vista
            else if (width < 1024) setItemsPerView(3); // lg - 3 cards por vista
            else if (width < 1280) setItemsPerView(4); // xl - 4 cards por vista
            else setItemsPerView(5); // 2xl - 5 cards por vista
        };

        updateItemsPerView();
        window.addEventListener('resize', updateItemsPerView);
        return () => window.removeEventListener('resize', updateItemsPerView);
    }, []);

    // Auto-play del slider
    useEffect(() => {
        if (!isAutoPlay || products.length <= itemsPerView) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => 
                prevIndex >= products.length - itemsPerView ? 0 : prevIndex + 1
            );
        }, 4000); // Cambiar cada 4 segundos

        return () => clearInterval(interval);
    }, [isAutoPlay, products.length, itemsPerView]);

    const maxIndex = Math.max(0, products.length - itemsPerView);

    const nextSlide = () => {
        setCurrentIndex(currentIndex >= maxIndex ? 0 : currentIndex + 1);
    };

    const prevSlide = () => {
        setCurrentIndex(currentIndex <= 0 ? maxIndex : currentIndex - 1);
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <div className="w-full">
            {/* Header del slider */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                <div className="flex items-center gap-4">
                    {/* Indicadores de auto-play */}
                    <button
                        onClick={() => setIsAutoPlay(!isAutoPlay)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            isAutoPlay 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-600'
                        }`}
                    >
                        {isAutoPlay ? 'Auto' : 'Manual'}
                    </button>
                    
                    {/* Controles de navegación */}
                    {products.length > itemsPerView && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={prevSlide}
                                className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-[#feecaf] group"
                            >
                                <FaChevronLeft className="w-4 h-4 text-gray-600 group-hover:text-[#feecaf] transition-colors" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-[#feecaf] group"
                            >
                                <FaChevronRight className="w-4 h-4 text-gray-600 group-hover:text-[#feecaf] transition-colors" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Slider container */}
            <div className="relative overflow-hidden rounded-2xl">
                <div 
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ 
                        transform: `translateX(-${currentIndex * (280 + 24)}px)`,
                        gap: '24px'
                    }}
                >
                    {products.map((product, index) => (
                        <div 
                            key={product._id || index}
                            className="flex-shrink-0"
                            style={{ width: '280px' }}
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Indicadores de puntos */}
            {products.length > itemsPerView && (
                <div className="flex justify-center mt-6 gap-2">
                    {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                index === currentIndex 
                                    ? 'bg-gradient-to-r from-[#feecaf] to-yellow-300 shadow-lg scale-110' 
                                    : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                        />
                    ))}
                </div>
            )}

            {/* Botón Ver más */}
            {showViewMore && onViewMore && (
                <div className="text-center mt-6">
                    <button
                        onClick={onViewMore}
                        className="px-8 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        Ver más
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductSlider;
