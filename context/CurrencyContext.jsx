'use client'
import { createContext, useContext, useEffect, useState } from 'react'

export const CurrencyContext = createContext()

export const useCurrency = () => {
    return useContext(CurrencyContext)
}

export const CurrencyProvider = ({ children }) => {
    const [selectedCurrency, setSelectedCurrency] = useState('USD')
    const [exchangeRates, setExchangeRates] = useState({})
    const [isLoadingRates, setIsLoadingRates] = useState(false)

    // Configuración de divisas
    const currencies = {
        USD: {
            code: 'USD',
            symbol: '$',
            name: 'Dólar Americano',
            flag: '🇺🇸',
            apiCode: 'USD'
        },
        ARS: {
            code: 'ARS',
            symbol: '$',
            name: 'Peso Argentino',
            flag: '🇦🇷',
            apiCode: 'ARS'
        },
        BRL: {
            code: 'BRL',
            symbol: 'R$',
            name: 'Real Brasileño',
            flag: '🇧🇷',
            apiCode: 'BRL'
        },
        PYG: {
            code: 'PYG',
            symbol: '₲',
            name: 'Guaraní Paraguayo',
            flag: '🇵🇾',
            apiCode: 'PYG'
        }
    }

    // Función para obtener tasas de cambio desde Paraguay
    const fetchExchangeRates = async () => {
        setIsLoadingRates(true)
        
        // Tasas de respaldo realistas
        const fallbackRates = {
            USD: 1,
            ARS: 1000,  // 1 USD = 1000 ARS (aproximado)
            BRL: 5.2,   // 1 USD = 5.2 BRL (aproximado)
            PYG: 7500   // 1 USD = 7500 PYG (aproximado)
        }
        
        try {
            // Primero intentar obtener desde nuestra base de datos
            const dbResponse = await fetch('/api/exchange-rates')
            if (dbResponse.ok) {
                const dbData = await dbResponse.json()
                if (dbData.success && dbData.data) {
                    setExchangeRates(dbData.data.rates)
                    console.log('✅ Tasas de cambio cargadas desde BD:', dbData.data.rates)
                    setIsLoadingRates(false)
                    return
                }
            }
            
            // Si no hay datos en BD, intentar con API de Paraguay
            console.log('🔄 Obteniendo tasas desde API de Paraguay...')
            
            // API del Banco Central del Paraguay (simulada - ajustar según API real)
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                signal: AbortSignal.timeout(10000)
            })
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            const data = await response.json()
            
            if (data && data.rates) {
                const rates = {
                    USD: 1,
                    ARS: data.rates.ARS || fallbackRates.ARS,
                    BRL: data.rates.BRL || fallbackRates.BRL,
                    PYG: data.rates.PYG || fallbackRates.PYG
                }
                
                // Guardar en la base de datos
                try {
                    const saveResponse = await fetch('/api/exchange-rates', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            rates,
                            source: 'paraguay_api'
                        })
                    })
                    
                    if (saveResponse.ok) {
                        console.log('✅ Tasas guardadas en BD exitosamente')
                    }
                } catch (saveError) {
                    console.warn('⚠️ Error al guardar en BD:', saveError.message)
                }
                
                setExchangeRates(rates)
                console.log('✅ Tasas de cambio cargadas desde API de Paraguay:', rates)
            } else {
                throw new Error('Datos de tasas de cambio no válidos')
            }
        } catch (error) {
            console.warn('⚠️ No se pudieron cargar tasas de Paraguay, usando tasas de respaldo:', error.message)
            
            // Usar tasas de respaldo
            setExchangeRates(fallbackRates)
            console.log('✅ Tasas de respaldo aplicadas:', fallbackRates)
        } finally {
            setIsLoadingRates(false)
        }
    }

    // Función para convertir precio
    const convertPrice = (priceInUSD) => {
        if (!priceInUSD || selectedCurrency === 'USD') {
            return priceInUSD
        }
        
        const rate = exchangeRates[selectedCurrency] || 1
        return priceInUSD * rate
    }

    // Función para formatear precio
    const formatPrice = (priceInUSD) => {
        const convertedPrice = convertPrice(priceInUSD)
        const currency = currencies[selectedCurrency]
        
        if (!currency) return `$${convertedPrice}`
        
        // Formatear según la divisa
        switch (selectedCurrency) {
            case 'USD':
                return `$${convertedPrice.toFixed(2)}`
            case 'ARS':
                return `$${Math.round(convertedPrice).toLocaleString()}`
            case 'BRL':
                return `R$${convertedPrice.toFixed(2)}`
            case 'PYG':
                return `₲${Math.round(convertedPrice).toLocaleString()}`
            default:
                return `$${convertedPrice.toFixed(2)}`
        }
    }

    // Cargar tasas de cambio al montar el componente
    useEffect(() => {
        // Cargar divisa guardada en localStorage primero
        if (typeof window !== 'undefined') {
            const savedCurrency = localStorage.getItem('quickcart_currency')
            if (savedCurrency && currencies[savedCurrency]) {
                setSelectedCurrency(savedCurrency)
            }
        }
        
        // Cargar tasas de cambio
        fetchExchangeRates()
        
        // Actualizar tasas automáticamente cada 5 minutos
        const interval = setInterval(() => {
            fetchExchangeRates()
        }, 5 * 60 * 1000) // 5 minutos
        
        return () => clearInterval(interval)
    }, [])

    // Guardar divisa en localStorage cuando cambie
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('quickcart_currency', selectedCurrency)
        }
    }, [selectedCurrency])

    const value = {
        selectedCurrency,
        setSelectedCurrency,
        currencies,
        exchangeRates,
        isLoadingRates,
        convertPrice,
        formatPrice,
        fetchExchangeRates
    }

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    )
}
