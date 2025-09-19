import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Flame, ShoppingCart, Star, Sparkles, Percent, ArrowRight } from 'lucide-react';
import ProductSlider from './ProductSlider';
import { useAppContext } from '@/context/AppContext';

const SmartRecommendations = () => {
    const { products, userData, cartItems, router } = useAppContext();
    const [recommendations, setRecommendations] = useState({
        trending: [],
        basedOnCart: [],
        topRated: [],
        newArrivals: [],
        priceDrop: []
    });

    useEffect(() => {
        if (products.length === 0) return;

        // Productos trending (más vendidos - simulamos con más ratings)
        const trending = [...products]
            .sort((a, b) => (b.totalRatings || 0) - (a.totalRatings || 0))
            .slice(0, 10);

        // Productos mejor calificados
        const topRated = [...products]
            .filter(p => (p.averageRating || 0) >= 4.0)
            .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
            .slice(0, 10);

        // Productos nuevos (más recientes)
        const newArrivals = [...products]
            .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
            .slice(0, 10);

        // Productos con mayor descuento
        const priceDrop = [...products]
            .filter(p => p.price > p.offerPrice)
            .sort((a, b) => {
                const discountA = ((a.price - a.offerPrice) / a.price) * 100;
                const discountB = ((b.price - b.offerPrice) / b.price) * 100;
                return discountB - discountA;
            })
            .slice(0, 10);

        // Recomendaciones basadas en el carrito
        let basedOnCart = [];
        if (Object.keys(cartItems).length > 0) {
            const cartProductIds = Object.keys(cartItems);
            const cartProducts = products.filter(p => cartProductIds.includes(p._id));
            
            if (cartProducts.length > 0) {
                // Obtener categorías de productos en el carrito
                const cartCategories = [...new Set(cartProducts.map(p => p.category))];
                const cartBrands = [...new Set(cartProducts.map(p => p.brand))];
                
                // Recomendar productos de las mismas categorías y marcas
                basedOnCart = products
                    .filter(p => 
                        !cartProductIds.includes(p._id) && // No incluir productos ya en el carrito
                        (cartCategories.includes(p.category) || cartBrands.includes(p.brand))
                    )
                    .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
                    .slice(0, 10);
            }
        }

        // Si no hay productos basados en el carrito, usar productos populares
        if (basedOnCart.length === 0) {
            basedOnCart = [...products]
                .sort((a, b) => (b.totalRatings || 0) - (a.totalRatings || 0))
                .slice(0, 10);
        }

        setRecommendations({
            trending,
            basedOnCart,
            topRated,
            newArrivals,
            priceDrop
        });
    }, [products, cartItems]);

    const getRecommendationConfig = (type) => {
        const configs = {
            trending: {
                title: 'Productos Trending',
                description: 'Los productos más populares entre nuestros clientes',
                icon: Flame,
                gradient: 'from-orange-500 to-red-500',
                bgGradient: 'from-orange-50 to-red-50',
                textColor: 'text-orange-800',
                borderColor: 'border-orange-200'
            },
            basedOnCart: {
                title: 'Basado en tu Carrito',
                description: 'Productos que podrían interesarte basados en tu carrito',
                icon: ShoppingCart,
                gradient: 'from-blue-500 to-indigo-500',
                bgGradient: 'from-blue-50 to-indigo-50',
                textColor: 'text-blue-800',
                borderColor: 'border-blue-200'
            },
            topRated: {
                title: 'Mejor Calificados',
                description: 'Productos con las mejores calificaciones de nuestros clientes',
                icon: Star,
                gradient: 'from-yellow-500 to-amber-500',
                bgGradient: 'from-yellow-50 to-amber-50',
                textColor: 'text-yellow-800',
                borderColor: 'border-yellow-200'
            },
            newArrivals: {
                title: 'Nuevos Productos',
                description: 'Los productos más recientes en nuestro catálogo',
                icon: Sparkles,
                gradient: 'from-green-500 to-emerald-500',
                bgGradient: 'from-green-50 to-emerald-50',
                textColor: 'text-green-800',
                borderColor: 'border-green-200'
            },
            priceDrop: {
                title: 'Ofertas Especiales',
                description: 'Productos con los mejores descuentos del momento',
                icon: Percent,
                gradient: 'from-purple-500 to-pink-500',
                bgGradient: 'from-purple-50 to-pink-50',
                textColor: 'text-purple-800',
                borderColor: 'border-purple-200'
            }
        };
        return configs[type] || configs.trending;
    };

    // Componente para cada sección de recomendación
    const RecommendationSection = ({ type, products, index }) => {
        const [ref, inView] = useInView({
            triggerOnce: true,
            threshold: 0.1,
        });

        const config = getRecommendationConfig(type);
        const IconComponent = config.icon;

        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
            >
                {/* Background con gradiente y elementos decorativos */}
                <div className="absolute inset-0 -m-4">
                    <div className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient} opacity-60 rounded-3xl`}></div>
                    {/* Elementos decorativos de fondo */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/30 to-transparent rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl"></div>
                </div>
                
                {/* Contenido principal */}
                <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-gray-200/50 shadow-xl">
                    {/* Header de la sección */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br ${config.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg`}>
                                <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                                    {config.title}
                                </h3>
                                <p className={`text-xs sm:text-sm ${config.textColor} font-medium`}>
                                    {config.description}
                                </p>
                            </div>
                        </div>
                        
                        {/* Botón Ver más */}
                        <button 
                            onClick={() => router.push('/all-products')}
                            className={`hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${config.gradient} text-white rounded-full text-sm font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
                        >
                            <span>Ver más</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Slider de productos */}
                    <div className="relative p-2 sm:p-4">
                        <ProductSlider
                            title=""
                            products={products}
                            showViewMore={false}
                        />
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="space-y-12">
            {Object.entries(recommendations).map(([type, products], index) => {
                if (!products || products.length === 0) return null;

                return (
                    <RecommendationSection
                        key={type}
                        type={type}
                        products={products}
                        index={index}
                    />
                );
            })}
        </div>
    );
};

export default SmartRecommendations;
