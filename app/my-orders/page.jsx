'use client';
import React, { useEffect, useState } from "react";
import { assets, orderDummyData } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Package, MapPin, CreditCard, Calendar, Truck, CheckCircle, Clock, AlertCircle } from "lucide-react";

const MyOrders = () => {

    const { currency, getToken, user } = useAppContext();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            
            const token = await getToken()

            const {data} = await axios.get('/api/order/list', {headers:{Authorization:`Bearer ${token}`}})

            if (data.success) {
                setOrders(data.orders.reverse())
                setLoading(false)
            }else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (user) {
        fetchOrders();
        }
    }, [user]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pendiente':
                return <Clock className="w-4 h-4" />;
            case 'en_procesado':
                return <Package className="w-4 h-4" />;
            case 'en_camino':
                return <Truck className="w-4 h-4" />;
            case 'entregado':
                return <CheckCircle className="w-4 h-4" />;
            default:
                return <AlertCircle className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pendiente':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'en_procesado':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'en_camino':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'entregado':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <>
            <Navbar />
            
            {/* Background decorativo */}
            <div className="relative min-h-screen">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100"></div>
                
                {/* Elementos decorativos */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-[#feecaf]/20 to-yellow-300/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
                </div>
                
                {/* Contenido principal */}
                <div className="relative z-10">
                    <div className="px-6 md:px-16 lg:px-32 pt-8 pb-16">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#feecaf] to-yellow-300 text-gray-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                                <Package className="w-4 h-4" />
                                Mis Pedidos
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                Mis <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#feecaf] to-yellow-300">Pedidos</span>
                            </h1>
                            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                                Revisa el estado de todos tus pedidos y su historial
                            </p>
                        </div>

                        {/* Lista de pedidos */}
                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <Loading />
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {orders.length === 0 ? (
                                    <div className="text-center py-20">
                                        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Package className="w-12 h-12 text-gray-400" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes pedidos aún</h3>
                                        <p className="text-gray-600 mb-6">Cuando realices tu primer pedido, aparecerá aquí</p>
                                        <motion.button
                                            onClick={() => window.location.href = '/all-products'}
                                            className="bg-gradient-to-r from-[#feecaf] to-yellow-300 text-gray-800 px-6 py-3 rounded-xl font-semibold hover:from-yellow-300 hover:to-[#feecaf] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Comenzar a Comprar
                                        </motion.button>
                                    </div>
                                ) : (
                                    orders.map((order, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6 hover:shadow-2xl transition-all duration-300"
                                        >
                                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                                {/* Información del pedido */}
                                                <div className="lg:col-span-2">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-16 h-16 bg-gradient-to-br from-[#feecaf] to-yellow-300 rounded-xl flex items-center justify-center flex-shrink-0">
                                                            <Package className="w-8 h-8 text-gray-800" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                                Pedido #{order._id?.slice(-8) || index + 1}
                                                            </h3>
                                                            <div className="space-y-1">
                                                                {order.items.map((item, itemIndex) => (
                                                                    <p key={itemIndex} className="text-sm text-gray-600">
                                                                        {item.product.name} x {item.quantity}
                                                                    </p>
                                                                ))}
                                                            </div>
                                                            <p className="text-sm text-gray-500 mt-2">
                                                                {order.items.length} artículo{order.items.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                                                    </div>
                                                </div>

                                                {/* Dirección de entrega */}
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-4 h-4 text-gray-500" />
                                                        <span className="text-sm font-medium text-gray-700">Dirección</span>
                                                    </div>
                                                    <div className="text-sm text-gray-600 space-y-1">
                                                        <p className="font-medium">{order.address.fullName}</p>
                                                        <p>{order.address.area}</p>
                                                        <p>{order.address.city}, {order.address.state}</p>
                                                        <p>{order.address.phoneNumber}</p>
                                                    </div>
                                                </div>

                                                {/* Información de pago y estado */}
                                                <div className="space-y-4">
                                                    <div className="text-right">
                                                        <p className="text-2xl font-bold text-gray-900">
                                                            {currency}{order.amount}
                                    </p>
                                </div>
                                                    
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-2">
                                                            <CreditCard className="w-4 h-4 text-gray-500" />
                                                            <span className="text-sm text-gray-600">
                                                                {order.paymentMethod ? `${order.paymentMethod.name}` : 'Contra Entrega'}
                                                            </span>
                                                        </div>
                                                        
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 text-gray-500" />
                                                            <span className="text-sm text-gray-600">
                                                                {new Date(order.date).toLocaleDateString('es-ES')}
                                                            </span>
                                                        </div>
                                                        
                                                        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                                                            {getStatusIcon(order.status)}
                                            {order.status === 'pendiente' ? 'Pendiente' :
                                             order.status === 'en_procesado' ? 'En Procesado' :
                                             order.status === 'en_camino' ? 'En Camino' :
                                             order.status === 'entregado' ? 'Entregado' :
                                             'Pendiente'}
                                                        </div>
                                                    </div>
                                                </div>
                                </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MyOrders;