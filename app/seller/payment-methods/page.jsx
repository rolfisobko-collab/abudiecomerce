'use client';
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const PaymentMethods = () => {
    const { user } = useAppContext();
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        type: '',
        category: '',
        country: '',
        currency: '',
        name: '',
        bankName: '',
        accountNumber: '',
        accountHolder: '',
        cbu: '',
        pix: '',
        walletAddress: '',
        network: '',
        instructions: '',
        minAmount: '',
        maxAmount: '',
        processingTime: ''
    });

    const fetchPaymentMethods = async () => {
        try {
            const { data } = await axios.get('/api/payment-methods', {
                withCredentials: true
            });
            if (data.success) {
                setPaymentMethods(data.paymentMethods);
                setLoading(false);
            } else {
                toast.error(data.message);
                setLoading(false);
            }
        } catch (error) {
            toast.error('Error al cargar medios de pago');
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/payment-methods', formData, {
                withCredentials: true
            });
            if (data.success) {
                toast.success('Medio de pago creado exitosamente');
                setFormData({
                    type: '',
                    category: '',
                    country: '',
                    currency: '',
                    name: '',
                    bankName: '',
                    accountNumber: '',
                    accountHolder: '',
                    cbu: '',
                    pix: '',
                    walletAddress: '',
                    network: '',
                    instructions: '',
                    minAmount: '',
                    maxAmount: '',
                    processingTime: ''
                });
                setShowForm(false);
                fetchPaymentMethods();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Error al crear medio de pago');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('¿Estás seguro de que quieres eliminar este medio de pago?')) {
            try {
                const { data } = await axios.delete(`/api/payment-methods/${id}`, {
                    withCredentials: true
                });
                if (data.success) {
                    toast.success('Medio de pago eliminado exitosamente');
                    fetchPaymentMethods();
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error('Error al eliminar medio de pago');
            }
        }
    };

    useEffect(() => {
        if (user) {
            fetchPaymentMethods();
        }
    }, [user]);

    return (
        <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loading />
                </div>
            ) : (
                <div className="md:p-10 p-4 space-y-5">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium">Medios de Pago</h2>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-[#feecaf] text-black px-4 py-2 rounded-md hover:bg-[#feecaf]/80"
                    >
                        {showForm ? 'Cancelar' : 'Agregar Medio de Pago'}
                    </button>
                </div>

                {showForm && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-medium mb-4">Nuevo Medio de Pago</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Tipo de Pago */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tipo de Pago
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value, category: '' })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#feecaf] focus:border-transparent outline-none"
                                    required
                                >
                                    <option value="">Seleccionar tipo</option>
                                    <option value="BANK_TRANSFER">Transferencia Bancaria</option>
                                    <option value="CRYPTO">Criptomoneda</option>
                                </select>
                            </div>

                            {/* Categoría */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Categoría
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => {
                                        const category = e.target.value;
                                        let country = '';
                                        let currency = '';
                                        
                                        // Auto-seleccionar país y moneda según la categoría
                                        if (category === 'CBU') {
                                            country = 'AR';
                                            currency = 'ARS';
                                        } else if (category === 'PIX' || category === 'TED') {
                                            country = 'BR';
                                            currency = 'BRL';
                                        } else if (category.includes('USDT') || category === 'BTC' || category === 'ETH' || category === 'BNB') {
                                            country = 'GLOBAL';
                                            currency = 'USD';
                                        }
                                        
                                        setFormData({ 
                                            ...formData, 
                                            category, 
                                            country, 
                                            currency 
                                        });
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#feecaf] focus:border-transparent outline-none"
                                    required
                                    disabled={!formData.type}
                                >
                                    <option value="">Seleccionar categoría</option>
                                    {formData.type === 'BANK_TRANSFER' && (
                                        <>
                                            <option value="CBU">CBU (Argentina)</option>
                                            <option value="PIX">PIX (Brasil)</option>
                                            <option value="TED">TED (Brasil)</option>
                                        </>
                                    )}
                                    {formData.type === 'CRYPTO' && (
                                        <>
                                            <option value="USDT_TRON">USDT TRON</option>
                                            <option value="USDT_ETHEREUM">USDT Ethereum</option>
                                            <option value="USDT_BSC">USDT BSC</option>
                                            <option value="USDT_POLYGON">USDT Polygon</option>
                                            <option value="BTC">Bitcoin</option>
                                            <option value="ETH">Ethereum</option>
                                            <option value="BNB">BNB</option>
                                        </>
                                    )}
                                </select>
                            </div>

                            {/* País */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    País
                                </label>
                                <input
                                    type="text"
                                    value={formData.country === 'AR' ? 'Argentina' : 
                                           formData.country === 'BR' ? 'Brasil' : 
                                           formData.country === 'PY' ? 'Paraguay' : 
                                           formData.country === 'GLOBAL' ? 'Global (Cripto)' : ''}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                                    readOnly
                                />
                            </div>

                            {/* Moneda */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Moneda
                                </label>
                                <input
                                    type="text"
                                    value={formData.currency === 'ARS' ? 'Peso Argentino (ARS)' : 
                                           formData.currency === 'BRL' ? 'Real Brasileño (BRL)' : 
                                           formData.currency === 'PYG' ? 'Guaraní Paraguayo (PYG)' : 
                                           formData.currency === 'USD' ? 'Dólar Americano (USD)' : 
                                           formData.currency === 'BTC' ? 'Bitcoin (BTC)' : 
                                           formData.currency === 'ETH' ? 'Ethereum (ETH)' : 
                                           formData.currency === 'BNB' ? 'BNB (BNB)' : ''}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                                    readOnly
                                />
                            </div>


                            {/* Nombre del Medio (Generado automáticamente) */}
                            {formData.name && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre del Medio (Generado automáticamente)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-green-50 text-green-800 font-medium"
                                        readOnly
                                    />
                                </div>
                            )}

                            {/* Mensaje informativo */}
                            {!formData.type && (
                                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                                    <p className="text-sm text-yellow-800">
                                        <strong>Instrucciones:</strong> Primero selecciona el tipo de pago (Transferencia Bancaria o Criptomoneda) 
                                        para ver los campos específicos que necesitas completar.
                                    </p>
                                </div>
                            )}

                            {/* Campos específicos para transferencias bancarias */}
                            {formData.type === 'BANK_TRANSFER' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nombre del Banco
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.bankName}
                                            onChange={(e) => {
                                                const bankName = e.target.value;
                                                // Generar nombre automático basado en banco y categoría
                                                let autoName = '';
                                                if (bankName && formData.category) {
                                                    if (formData.category === 'CBU') {
                                                        autoName = `${bankName} - CBU`;
                                                    } else if (formData.category === 'PIX') {
                                                        autoName = `${bankName} - PIX`;
                                                    } else if (formData.category === 'TED') {
                                                        autoName = `${bankName} - TED`;
                                                    }
                                                }
                                                setFormData({ ...formData, bankName, name: autoName });
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#feecaf] focus:border-transparent outline-none"
                                            placeholder="Ej: Banco Santander"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Número de Cuenta
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.accountNumber}
                                            onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#feecaf] focus:border-transparent outline-none"
                                            placeholder="Número de cuenta bancaria"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Titular de la Cuenta
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.accountHolder}
                                            onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#feecaf] focus:border-transparent outline-none"
                                            placeholder="Nombre del titular"
                                            required
                                        />
                                    </div>
                                    {formData.category === 'CBU' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                CBU
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.cbu}
                                                onChange={(e) => setFormData({ ...formData, cbu: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#feecaf] focus:border-transparent outline-none"
                                                placeholder="1234567890123456789012"
                                                required
                                            />
                                        </div>
                                    )}
                                    {formData.category === 'PIX' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Clave PIX
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.pix}
                                                onChange={(e) => setFormData({ ...formData, pix: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#feecaf] focus:border-transparent outline-none"
                                                placeholder="CPF, email, teléfono o clave aleatoria"
                                                required
                                            />
                                        </div>
                                    )}
                                    {formData.category === 'TED' && (
                                        <div className="p-3 bg-blue-50 rounded-md">
                                            <p className="text-sm text-blue-800">
                                                <strong>Nota:</strong> Para TED, solo se requiere el nombre del banco, número de cuenta y titular. 
                                                No se necesita información adicional específica.
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Campos específicos para criptomonedas */}
                            {formData.type === 'CRYPTO' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Dirección de Wallet
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.walletAddress}
                                            onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#feecaf] focus:border-transparent outline-none"
                                            placeholder="Dirección de la wallet"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Red
                                        </label>
                                        <select
                                            value={formData.network}
                                            onChange={(e) => {
                                                const network = e.target.value;
                                                // Generar nombre automático basado en categoría y red
                                                let autoName = '';
                                                if (formData.category && network) {
                                                    if (formData.category === 'USDT_TRON') {
                                                        autoName = `USDT TRON (${network})`;
                                                    } else if (formData.category === 'USDT_ETHEREUM') {
                                                        autoName = `USDT Ethereum (${network})`;
                                                    } else if (formData.category === 'USDT_BSC') {
                                                        autoName = `USDT BSC (${network})`;
                                                    } else if (formData.category === 'USDT_POLYGON') {
                                                        autoName = `USDT Polygon (${network})`;
                                                    } else if (formData.category === 'BTC') {
                                                        autoName = `Bitcoin (${network})`;
                                                    } else if (formData.category === 'ETH') {
                                                        autoName = `Ethereum (${network})`;
                                                    } else if (formData.category === 'BNB') {
                                                        autoName = `BNB (${network})`;
                                                    }
                                                }
                                                setFormData({ ...formData, network, name: autoName });
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#feecaf] focus:border-transparent outline-none"
                                            required
                                        >
                                            <option value="">Seleccionar red</option>
                                            {formData.category === 'USDT_TRON' && (
                                                <option value="TRC20">TRC20 (TRON)</option>
                                            )}
                                            {formData.category === 'USDT_ETHEREUM' && (
                                                <option value="ERC20">ERC20 (Ethereum)</option>
                                            )}
                                            {formData.category === 'USDT_BSC' && (
                                                <option value="BEP20">BEP20 (Binance Smart Chain)</option>
                                            )}
                                            {formData.category === 'USDT_POLYGON' && (
                                                <option value="POLYGON">Polygon</option>
                                            )}
                                            {formData.category === 'BTC' && (
                                                <>
                                                    <option value="BITCOIN">Bitcoin</option>
                                                    <option value="LIGHTNING">Lightning Network</option>
                                                </>
                                            )}
                                            {formData.category === 'ETH' && (
                                                <option value="ERC20">ERC20 (Ethereum)</option>
                                            )}
                                            {formData.category === 'BNB' && (
                                                <option value="BEP20">BEP20 (Binance Smart Chain)</option>
                                            )}
                                        </select>
                                    </div>
                                </>
                            )}

                            {/* Instrucciones */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Instrucciones para el Cliente
                                </label>
                                <textarea
                                    value={formData.instructions}
                                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#feecaf] focus:border-transparent outline-none"
                                    placeholder="Instrucciones detalladas para realizar el pago"
                                    rows={3}
                                    required
                                />
                            </div>

                            {/* Montos mínimos y máximos */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Monto Mínimo
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.minAmount}
                                        onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#feecaf] focus:border-transparent outline-none"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Monto Máximo
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.maxAmount}
                                        onChange={(e) => setFormData({ ...formData, maxAmount: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#feecaf] focus:border-transparent outline-none"
                                        placeholder="999999999"
                                    />
                                </div>
                            </div>

                            {/* Tiempo de procesamiento */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tiempo de Procesamiento
                                </label>
                                <input
                                    type="text"
                                    value={formData.processingTime}
                                    onChange={(e) => setFormData({ ...formData, processingTime: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#feecaf] focus:border-transparent outline-none"
                                    placeholder="Ej: Inmediato, 1-3 días hábiles"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="bg-[#feecaf] text-black px-6 py-2 rounded-md hover:bg-[#feecaf]/80"
                                >
                                    Crear Medio de Pago
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="grid gap-4">
                    {paymentMethods.map((method) => (
                        <div key={method._id} className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            method.type === 'BANK_TRANSFER' 
                                                ? 'bg-blue-100 text-blue-800' 
                                                : 'bg-green-100 text-green-800'
                                        }`}>
                                            {method.category} ({method.country})
                                        </span>
                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                            {method.currency}
                                        </span>
                                        <h3 className="text-lg font-medium">{method.name}</h3>
                                    </div>
                                    
                                    <div className="space-y-2 text-sm">
                                        {method.type === 'BANK_TRANSFER' && (
                                            <>
                                                <p><strong>Banco:</strong> {method.bankName}</p>
                                                <p><strong>Cuenta:</strong> {method.accountNumber}</p>
                                                <p><strong>Titular:</strong> {method.accountHolder}</p>
                                                {method.cbu && <p><strong>CBU:</strong> <span className="font-mono">{method.cbu}</span></p>}
                                                {method.pix && <p><strong>PIX:</strong> <span className="font-mono">{method.pix}</span></p>}
                                            </>
                                        )}
                                        
                                        {method.type === 'CRYPTO' && (
                                            <>
                                                <p><strong>Wallet:</strong> <span className="font-mono break-all">{method.walletAddress}</span></p>
                                                <p><strong>Red:</strong> {method.network}</p>
                                            </>
                                        )}
                                        
                                        <p><strong>Instrucciones:</strong> {method.instructions}</p>
                                        <p><strong>Monto:</strong> {method.minAmount} - {method.maxAmount} {method.currency}</p>
                                        <p><strong>Procesamiento:</strong> {method.processingTime}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(method._id)}
                                    className="text-red-600 hover:text-red-800 ml-4"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {paymentMethods.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No hay medios de pago configurados</p>
                        <p className="text-sm text-gray-400 mt-2">Agrega un medio de pago para que los clientes puedan realizar pedidos</p>
                    </div>
                )}
            </div>
            )}
        </div>
    );
};

export default PaymentMethods;
