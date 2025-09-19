import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, ShoppingCart } from "lucide-react";
import ProductCard from "./ProductCard";
import Loading from "./Loading";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { assets } from "@/assets/assets";
import StarRating from "./StarRating";

const HomeProducts = () => {

  const { products, router, isLoadingProducts } = useAppContext()

  // Limitar a máximo 10 productos (2 filas de 5 columnas en pantallas grandes)
  const limitedProducts = products.slice(0, 10)

  // Componente de skeleton más pequeño para la home
  const ProductSkeleton = () => (
    <motion.div 
      className="bg-white rounded-2xl shadow-lg border border-gray-100 w-[240px] h-[360px] overflow-hidden flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse w-full h-40 flex-shrink-0"></div>
      <div className="p-3 flex flex-col flex-1 justify-between">
        <div className="space-y-2">
          <div className="bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse h-3 w-3/4 rounded-lg"></div>
          <div className="bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse h-3 w-1/2 rounded-lg"></div>
          <div className="bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse h-3 w-1/3 rounded-lg"></div>
        </div>
        <div className="bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse h-8 w-full rounded-xl"></div>
      </div>
    </motion.div>
  )

  // Componente de ProductCard más pequeño para la home
  const SmallProductCard = ({ product }) => {
    const { currency, router, getCategoryName, addToCart } = useAppContext()

    return (
      <motion.div
        onClick={() => { router.push('/product/' + product._id); scrollTo(0, 0) }}
        className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#feecaf] cursor-pointer w-[240px] h-[360px] flex flex-col"
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Imagen del producto */}
        <div className="relative h-40 overflow-hidden flex-shrink-0">
          {product.image && product.image[0] ? (
            <Image
              src={product.image[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <Image
              src="/placeholder-product.jpeg"
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          )}
          {/* Badge de descuento */}
          {product.offerPrice && product.offerPrice < product.price && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              -{Math.round(((product.price - product.offerPrice) / product.price) * 100)}%
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-3 flex flex-col flex-1 justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-[#feecaf] transition-colors">
              {product.name}
            </h3>
            <p className="text-xs text-gray-500 line-clamp-1">
              {getCategoryName(product.category)}
            </p>
            <p className="text-xs text-gray-600 line-clamp-1">
              {product.description}
            </p>
          </div>

          {/* Rating */}
          <div className="mt-2">
            <StarRating 
              rating={product.rating || 0} 
              productId={product._id}
              size="sm"
            />
          </div>

          {/* Precio y botón */}
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2">
              {product.offerPrice && product.offerPrice < product.price ? (
                <>
                  <span className="text-lg font-bold text-gray-900">
                    {currency}{product.offerPrice}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {currency}{product.price}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-gray-900">
                  {currency}{product.price}
                </span>
              )}
            </div>
            
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product._id);
              }}
              className="w-full bg-gradient-to-r from-[#feecaf] to-yellow-300 text-gray-800 py-2 px-3 rounded-xl font-semibold text-sm hover:from-yellow-300 hover:to-[#feecaf] transition-all duration-300 shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Agregar al Carrito
            </motion.button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col items-center pt-14">
      {/* Header mejorado */}
      <div className="w-full mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-[#feecaf] to-yellow-300 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-gray-800" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Productos <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#feecaf] to-yellow-300">Populares</span>
          </h2>
        </div>
        <p className="text-gray-600 text-lg max-w-2xl">
          Los productos más vendidos y mejor valorados por nuestros clientes
        </p>
      </div>
      
      {isLoadingProducts ? (
        <div className="flex flex-wrap gap-6 justify-center mt-6 pb-14 w-full">
          {Array.from({ length: 10 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-6 justify-center mt-6 pb-14 w-full">
            {limitedProducts.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <SmallProductCard product={product} />
              </motion.div>
            ))}
          </div>
          
          {/* Botón mejorado */}
          <motion.button 
            onClick={() => { router.push('/all-products') }}
            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#feecaf] to-yellow-300 text-gray-800 font-semibold rounded-xl hover:from-yellow-300 hover:to-[#feecaf] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Ver todos los productos</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </motion.button>
        </>
      )}
    </div>
  );
};

export default HomeProducts;
