'use client';
import React, { useEffect, useState } from "react";
import { assets, orderDummyData } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const Orders = () => {

    const { currency, getToken, user } = useAppContext();

    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('todos');

    const fetchSellerOrders = async () => {
        console.log('🔍 [ORDERS DEBUG] Iniciando fetchSellerOrders...')
        try {
            console.log('🔍 [ORDERS DEBUG] Haciendo petición a /api/order/seller-orders...')
            const { data } = await axios.get(
                '/api/order/seller-orders',
                { 
                    withCredentials: true
                }
            )
            console.log('🔍 [ORDERS DEBUG] Respuesta recibida:', data)
            if (data.success) {
                console.log('🔍 [ORDERS DEBUG] Éxito, órdenes:', data.orders.length)
                setOrders(data.orders)
                setLoading(false)
            } else {
                console.log('🔍 [ORDERS DEBUG] Error en respuesta:', data.message)
                toast.error(data.message)
                setLoading(false)
            }

        } catch (error) {
            console.log('🔍 [ORDERS DEBUG] Error en catch:', error.message)
            toast.error(error.message)
            setLoading(false)
        }
    }

    // Función para filtrar órdenes por estado
    const filterOrdersByStatus = (orders, status) => {
        if (status === 'todos') {
            return orders;
        }
        // Mapear los estados para que coincidan con los datos reales
        const statusMap = {
            'pendiente': 'Pedido Realizado',
            'en_procesado': 'En Proceso',
            'en_camino': 'Enviado',
            'entregado': 'Entregado'
        };
        const targetStatus = statusMap[status] || status;
        return orders.filter(order => (order.status || 'Pedido Realizado') === targetStatus);
    };

    // Efecto para filtrar órdenes cuando cambia el filtro
    useEffect(() => {
        setFilteredOrders(filterOrdersByStatus(orders, statusFilter));
    }, [orders, statusFilter]);

    useEffect(() => {
        fetchSellerOrders();
    }, []);

    return (
        <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loading />
                </div>
            ) : (
                <div className="md:p-10 p-4 space-y-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h2 className="text-lg font-medium">Pedidos</h2>
                    
                    {/* Filtro por estado */}
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-700">
                            Filtrar por estado:
                        </label>
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#feecaf] focus:border-transparent outline-none text-sm bg-white"
                        >
                            <option value="todos">Todos</option>
                            <option value="pendiente">🟡 Pedido Realizado</option>
                            <option value="en_procesado">🟠 En Proceso</option>
                            <option value="en_camino">🚚 Enviado</option>
                            <option value="entregado">✅ Entregado</option>
                        </select>
                    </div>
                </div>

                {/* Contador de órdenes */}
                <div className="bg-[#feecaf]/10 border border-[#feecaf] rounded-lg p-3">
                    <p className="text-sm text-gray-700">
                        Mostrando <span className="font-semibold text-[#feecaf]">{filteredOrders.length}</span> de <span className="font-semibold">{orders.length}</span> pedidos
                    </p>
                </div>

                <div className="max-w-4xl rounded-md">
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                            </div>
                            <p className="text-gray-500">
                                {orders.length === 0 
                                    ? "No hay órdenes aún" 
                                    : "No hay pedidos con el estado seleccionado"
                                }
                            </p>
                        </div>
                    ) : (
                        filteredOrders.map((order, index) => (
                        <div key={index} className="flex flex-col md:flex-row gap-5 justify-between p-5 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex-1 flex gap-5 max-w-80">
                                    <div className="flex-shrink-0 w-16 h-16 bg-[#feecaf]/20 rounded-lg flex items-center justify-center">
                                        <svg className="w-8 h-8 text-[#feecaf]" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z" fill="#feecaf"/>
                                            <path d="M9 8V17H11V8H9ZM13 8V17H15V8H13Z" fill="#feecaf"/>
                                        </svg>
                                    </div>
                                <div className="flex flex-col gap-2">
                                    <span className="font-medium text-gray-900">
                                        {order.items.map((item) => (item.product?.name || 'Producto no disponible') + ` x ${item.quantity}`).join(", ")}
                                    </span>
                                    <span className="text-sm text-gray-600">Artículos: {order.items.length}</span>
                                    <span className="text-xs text-gray-500">ID: {order._id?.substring(0, 8)}...</span>
                                </div>
                            </div>
                            <div>
                                <p>
                                    <span className="font-medium">{order.address.fullName}</span>
                                    <br />
                                    <span >{order.address.area}</span>
                                    <br />
                                    <span>{`${order.address.city}, ${order.address.state}`}</span>
                                    <br />
                                    <span>{order.address.phoneNumber}</span>
                                </p>
                            </div>
                            <p className="font-medium my-auto">{currency}{order.amount}</p>
                            <div>
                                <div className="flex flex-col gap-2">
                                    <p className="flex flex-col">
                                        <span>Método : Contra Entrega</span>
                                        <span>Fecha : {new Date(order.date).toLocaleDateString()}</span>
                                        <span>Pago : {order.paymentMethod ? `${order.paymentMethod.name} (${order.paymentMethod.category})` : 'Pendiente'}</span>
                                        {order.paymentProof && (
                                            <span className="text-xs text-gray-500">Comprobante: {order.paymentProof.substring(0, 20)}...</span>
                                        )}
                                    </p>
                                    <div className="mt-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Estado del Pedido:
                                        </label>
                                            <select 
                                                value={order.status || 'Order Placed'}
                                                onChange={async (e) => {
                                                    const newStatus = e.target.value;
                                                    try {
                                                        const response = await axios.put('/api/order/update-status', {
                                                            orderId: order._id,
                                                            status: newStatus
                                                        }, {
                                                            withCredentials: true
                                                        });
                                                        
                                                        if (response.data.success) {
                                                            // Actualizar el estado local
                                                            const updatedOrders = orders.map(o => 
                                                                o._id === order._id 
                                                                    ? { ...o, status: newStatus }
                                                                    : o
                                                            );
                                                            setOrders(updatedOrders);
                                                            toast.success(`Estado actualizado a: ${newStatus}`);
                                                        }
                                                    } catch (error) {
                                                        console.error('Error al actualizar estado:', error);
                                                        toast.error('Error al actualizar el estado');
                                                    }
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#feecaf] focus:border-transparent outline-none text-sm bg-white"
                                            >
                                            <option value="Pedido Realizado">🟡 Pedido Realizado</option>
                                            <option value="En Proceso">🟠 En Proceso</option>
                                            <option value="Enviado">🚚 Enviado</option>
                                            <option value="Entregado">✅ Entregado</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ))
                    )}
                </div>
            </div>
            )}
        </div>
    );
};

export default Orders;