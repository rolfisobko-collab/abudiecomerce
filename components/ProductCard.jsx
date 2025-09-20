import React from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Eye, Heart } from 'lucide-react'
import { assets } from '@/assets/assets'
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import { useCurrency } from '@/context/CurrencyContext';
import StarRating from './StarRating';

const ProductCard = ({ product }) => {

    const { router, getCategoryName, addToCart } = useAppContext()
    const { formatPrice } = useCurrency()

    return (
        <motion.div
            onClick={() => { router.push('/product/' + product._id); scrollTo(0, 0) }}
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#feecaf] cursor-pointer w-full max-w-[240px] min-h-[360px] flex flex-col mx-auto"
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Imagen del producto */}
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 w-full h-40 overflow-hidden flex-shrink-0">
                {product.image && product.image[0] ? (
                    <Image
                        src={product.image[0]}
                        alt={product.name}
                        className="group-hover:scale-110 transition-transform duration-500 object-cover w-full h-full"
                        width={800}
                        height={800}
                    />
                ) : (
                    <Image
                        src="/placeholder-product.jpeg"
                        alt={product.name}
                        className="group-hover:scale-110 transition-transform duration-500 object-cover w-full h-full"
                        width={800}
                        height={800}
                    />
                )}
                
                {/* Overlay con botones */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                        <motion.button
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push('/product/' + product._id);
                            }}
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Eye className="w-4 h-4 text-gray-800" />
                        </motion.button>
                        <motion.button
                            onClick={(e) => {
                                e.stopPropagation();
                                addToCart(product._id, 1);
                            }}
                            className="p-2 bg-[#feecaf] rounded-full hover:bg-yellow-300 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <ShoppingCart className="w-4 h-4 text-gray-800" />
                        </motion.button>
                    </div>
                </div>

                {/* Botón de favoritos */}
                <motion.button 
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
                </motion.button>

                {/* Badge de descuento */}
                {product.price > product.offerPrice && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{Math.round(((product.price - product.offerPrice) / product.price) * 100)}%
                    </div>
                )}
            </div>

            {/* Contenido del producto */}
            <div className="p-3 flex flex-col flex-1 justify-between min-h-0">
                <div className="flex-1 min-h-0">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 leading-tight text-sm">
                        {product.name}
                    </h3>
                    
                    <p className="text-xs text-gray-500 mb-1 line-clamp-1">
                        {product.description}
                    </p>
                    
                    <p className="text-xs text-blue-600 font-medium capitalize mb-1">
                        {getCategoryName(product.category)}
                    </p>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-2">
                        <StarRating
                            rating={product.averageRating || 0}
                            totalRatings={product.totalRatings || 0}
                            size="xs"
                            showCount={false}
                        />
                        <span className="text-xs text-gray-500">
                            ({product.totalRatings || 0})
                        </span>
                    </div>

                    {/* Precio */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-bold text-gray-900">
                            {formatPrice(product.offerPrice)}
                        </span>
                        {product.price > product.offerPrice && (
                            <span className="text-sm text-gray-500 line-through">
                                {formatPrice(product.price)}
                            </span>
                        )}
                    </div>
                </div>

                {/* Botón de agregar al carrito */}
                <div className="mt-auto pt-2">
                    <motion.button
                        onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product._id, 1);
                        }}
                        className="w-full bg-gradient-to-r from-[#feecaf] to-yellow-300 text-gray-800 py-2.5 px-4 rounded-xl font-semibold hover:from-yellow-300 hover:to-[#feecaf] transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
                        <span>Agregar al carrito</span>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )
}

export default ProductCard