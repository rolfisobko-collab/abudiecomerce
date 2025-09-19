import React from 'react'
import { assets } from '@/assets/assets'
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import StarRating from './StarRating';

const ProductListItem = ({ product }) => {

    const { currency, router, getCategoryName } = useAppContext()

    return (
        <div
            onClick={() => { router.push('/product/' + product._id); scrollTo(0, 0) }}
            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-white"
        >
            {/* Imagen del producto */}
            <div className="relative bg-gray-500/10 rounded-lg w-24 h-24 flex items-center justify-center flex-shrink-0">
                {product.image && product.image[0] ? (
                    <Image
                        src={product.image[0]}
                        alt={product.name}
                        className="object-cover w-full h-full rounded-lg"
                        width={96}
                        height={96}
                    />
                ) : (
                    <Image
                        src="/placeholder-product.jpeg"
                        alt={product.name}
                        className="object-cover w-full h-full rounded-lg"
                        width={96}
                        height={96}
                    />
                )}
            </div>

            {/* Información del producto */}
            <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-gray-900 truncate">{product.name}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                <p className="text-sm text-blue-600 font-medium capitalize mt-1">
                    {getCategoryName(product.category)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                    <StarRating 
                        rating={product.averageRating || 0} 
                        totalRatings={product.totalRatings || 0}
                        size="sm"
                        showCount={true}
                    />
                </div>
            </div>

            {/* Precio y acciones */}
            <div className="flex flex-col items-end gap-2">
                <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">{currency}{product.offerPrice}</p>
                    {product.price !== product.offerPrice && (
                        <p className="text-sm text-gray-500 line-through">{currency}{product.price}</p>
                    )}
                </div>
                <button className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 transition-colors">
                    Ver detalles
                </button>
            </div>
        </div>
    )
}

export default ProductListItem
