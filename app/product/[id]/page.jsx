"use client"
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import StarRating from "@/components/StarRating";
import ProductRatingForm from "@/components/ProductRatingForm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import React from "react";

const Product = () => {

    const { id } = useParams();

    const { products, router, addToCart, user, getCategoryName } = useAppContext()

    const [mainImage, setMainImage] = useState(null);
    const [productData, setProductData] = useState(null);
    const [ratings, setRatings] = useState([]);
    const [showRatingForm, setShowRatingForm] = useState(false);

    const fetchProductData = async () => {
        const product = products.find(product => product._id === id);
        if (product) {
            // Asegurar que el producto tenga minQuantity
            setProductData({
                ...product,
                minQuantity: product.minQuantity && product.minQuantity > 0 ? product.minQuantity : 1
            });
            
            // Cargar ratings del producto
            fetchRatings(product._id);
        }
    }

    const fetchRatings = async (productId) => {
        try {
            const response = await fetch(`/api/product/rating?productId=${productId}`);
            const data = await response.json();
            if (data.success) {
                setRatings(data.ratings);
            }
        } catch (error) {
            console.error('Error fetching ratings:', error);
        }
    }

    const handleRatingSubmit = (newRating) => {
        // Actualizar la lista de ratings
        fetchRatings(productData._id);
        setShowRatingForm(false);
    }

    useEffect(() => {
        fetchProductData();
    }, [id, products.length])

    return productData ? (
        <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            <div className="px-6 md:px-16 lg:px-32 pt-8 pb-16">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
                    <a href="/" className="hover:text-[#feecaf] transition-colors">Inicio</a>
                    <span>/</span>
                    <a href="/all-products" className="hover:text-[#feecaf] transition-colors">Productos</a>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">{productData.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* Galería de imágenes */}
                    <div className="space-y-6">
                        {/* Imagen principal */}
                        <div className="relative group">
                            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
                        {(mainImage || (productData.image && productData.image[0])) ? (
                            <Image
                                src={mainImage || productData.image[0]}
                                        alt={productData.name}
                                        className="w-full h-96 lg:h-[500px] object-cover group-hover:scale-105 transition-transform duration-500"
                                width={1280}
                                height={720}
                            />
                        ) : (
                            <Image
                                src="/placeholder-product.jpeg"
                                alt={productData.name}
                                        className="w-full h-96 lg:h-[500px] object-cover group-hover:scale-105 transition-transform duration-500"
                                width={1280}
                                height={720}
                            />
                        )}
                    </div>

                            {/* Badge de descuento */}
                            {productData.price > productData.offerPrice && (
                                <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
                                    -{Math.round(((productData.price - productData.offerPrice) / productData.price) * 100)}% OFF
                                </div>
                            )}
                        </div>

                        {/* Miniaturas */}
                    <div className="grid grid-cols-4 gap-4">
                        {productData.image && productData.image.length > 0 ? (
                            productData.image.map((image, index) => (
                                image ? (
                                    <div
                                        key={index}
                                        onClick={() => setMainImage(image)}
                                            className={`cursor-pointer rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                                                (mainImage || productData.image[0]) === image 
                                                    ? 'border-[#feecaf] shadow-xl scale-105' 
                                                    : 'border-gray-200/50 hover:border-[#feecaf]/50'
                                            }`}
                                    >
                                        <Image
                                            src={image}
                                                alt={productData.name}
                                                className="w-full h-20 object-cover"
                                                width={200}
                                                height={80}
                                        />
                                    </div>
                                ) : null
                            ))
                        ) : (
                            <div
                                onClick={() => setMainImage('/placeholder-product.jpeg')}
                                    className="cursor-pointer rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm shadow-lg border-2 border-gray-200/50 hover:border-[#feecaf]/50 transition-all duration-300 hover:shadow-xl col-span-4"
                            >
                                <Image
                                    src="/placeholder-product.jpeg"
                                    alt={productData.name}
                                        className="w-full h-20 object-cover"
                                        width={200}
                                        height={80}
                                />
                            </div>
                        )}
                    </div>
                </div>

                    {/* Información del producto */}
                    <div className="space-y-8">
                        {/* Header del producto */}
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                        {productData.name}
                    </h1>
                            <div className="flex items-center gap-4 mb-6">
                                <StarRating 
                                    rating={productData.averageRating || 0} 
                                    totalRatings={productData.totalRatings || 0}
                                    size="lg"
                                    showCount={true}
                                />
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    <span className="capitalize">{getCategoryName(productData.category)}</span>
                        </div>
                    </div>
                            <p className="text-gray-600 text-lg leading-relaxed">
                        {productData.description}
                    </p>
                        </div>

                        {/* Precios */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 font-medium">Precio Minorista:</span>
                                    <span className="text-3xl font-bold text-gray-900">${productData.price}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 font-medium">Precio Mayorista:</span>
                        <div className="flex items-center gap-3">
                                        <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                                            ${productData.offerPrice}
                                        </span>
                                        <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                                Desde {productData.minQuantity && productData.minQuantity > 0 ? productData.minQuantity : 1} unidades
                            </span>
                        </div>
                                </div>
                                <div className="bg-gradient-to-r from-[#feecaf]/20 to-yellow-300/20 border border-[#feecaf]/30 rounded-xl p-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <svg className="w-5 h-5 text-[#feecaf]" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                        <span className="font-medium">
                                            Ahorra ${(productData.price - productData.offerPrice).toFixed(2)} por unidad comprando {productData.minQuantity && productData.minQuantity > 0 ? productData.minQuantity : 1} o más
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Especificaciones */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Especificaciones</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex justify-between py-3 border-b border-gray-200/50">
                                    <span className="text-gray-600 font-medium">Marca</span>
                                    <span className="text-gray-900 font-semibold">Genérica</span>
                                </div>
                                <div className="flex justify-between py-3 border-b border-gray-200/50">
                                    <span className="text-gray-600 font-medium">Color</span>
                                    <span className="text-gray-900 font-semibold">Múltiple</span>
                                </div>
                                <div className="flex justify-between py-3 border-b border-gray-200/50">
                                    <span className="text-gray-600 font-medium">Categoría</span>
                                    <span className="text-gray-900 font-semibold capitalize">{getCategoryName(productData.category)}</span>
                    </div>
                                <div className="flex justify-between py-3 border-b border-gray-200/50">
                                    <span className="text-gray-600 font-medium">Cantidad Mínima</span>
                                    <span className="text-gray-900 font-semibold">
                                        {productData.minQuantity && productData.minQuantity > 0 ? productData.minQuantity : 1} unidades
                                    </span>
                    </div>
                            </div>
                        </div>
                        
                        {/* Botones de acción */}
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button 
                                    onClick={() => addToCart(productData._id)} 
                                    className="flex-1 py-4 px-6 bg-white border-2 border-gray-300 text-gray-800 rounded-xl font-semibold hover:border-[#feecaf] hover:bg-[#feecaf]/10 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                                        </svg>
                                Agregar al Carrito
                                    </div>
                            </button>
                                <button 
                                    onClick={() => { 
                                addToCart(productData._id); 
                                router.push('/cart'); 
                                    }} 
                                    className="flex-1 py-4 px-6 bg-gradient-to-r from-[#feecaf] to-yellow-300 text-gray-800 rounded-xl font-semibold hover:from-yellow-300 hover:to-[#feecaf] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                Comprar Ahora
                                    </div>
                            </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

                {/* Sección de Ratings y Reseñas */}
                <div className="mt-20">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Reseñas y Calificaciones</h2>
                                <p className="text-gray-600">Comparte tu experiencia con otros clientes</p>
                            </div>
                            <button
                                onClick={() => setShowRatingForm(!showRatingForm)}
                                className="mt-4 sm:mt-0 px-6 py-3 bg-gradient-to-r from-[#feecaf] to-yellow-300 text-gray-800 rounded-xl font-semibold hover:from-yellow-300 hover:to-[#feecaf] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                {showRatingForm ? 'Cancelar' : 'Escribir Reseña'}
                            </button>
                        </div>

                        {/* Formulario de rating */}
                        {showRatingForm && (
                            <div className="mb-8 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200/50">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Califica este producto</h3>
                                <ProductRatingForm 
                                    productId={productData._id}
                                    onRatingSubmit={handleRatingSubmit}
                                />
                            </div>
                        )}

                        {/* Lista de reseñas */}
                        <div className="space-y-6">
                            {ratings.length > 0 ? (
                                ratings.map((rating, index) => (
                                    <div key={index} className="bg-white border border-gray-200/50 rounded-2xl p-6 shadow-lg">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-[#feecaf] to-yellow-300 rounded-full flex items-center justify-center">
                                                    <span className="text-gray-800 font-semibold text-sm">
                                                        {rating.userName.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="font-semibold text-gray-900">{rating.userName}</span>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <StarRating 
                                                            rating={rating.rating} 
                                                            size="sm"
                                                            showCount={false}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {new Date(rating.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {rating.review && (
                                            <p className="text-gray-700 leading-relaxed">{rating.review}</p>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay reseñas aún</h3>
                                    <p className="text-gray-600">¡Sé el primero en calificar este producto!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Productos relacionados */}
                <div className="mt-20">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#feecaf] to-yellow-300 text-gray-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Productos relacionados
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            También te puede <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#feecaf] to-yellow-300">interesar</span>
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Descubre otros productos que podrían complementar tu compra
                        </p>
                        <div className="w-24 h-1 bg-gradient-to-r from-[#feecaf] to-yellow-300 rounded-full mt-6 mx-auto"></div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
                        {products.slice(0, 5).map((product, index) => (
                            <ProductCard key={index} product={product} />
                        ))}
                    </div>
                    
                    <div className="text-center mt-12">
                        <button 
                            onClick={() => router.push('/all-products')}
                            className="px-8 py-4 bg-gradient-to-r from-[#feecaf] to-yellow-300 text-gray-800 rounded-xl font-semibold hover:from-yellow-300 hover:to-[#feecaf] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            Ver todos los productos
                        </button>
                    </div>
                </div>
            </div>
            <div className="pb-16"></div>
        <Footer />
        <WhatsAppFloat />
    </>
    ) : <Loading />
};

export default Product;