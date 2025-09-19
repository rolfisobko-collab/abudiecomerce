'use client'
import { useState, useRef, useEffect } from 'react'
import { useCurrency } from '@/context/CurrencyContext'
import { ChevronDown } from 'lucide-react'

export default function CurrencySelector() {
    const { selectedCurrency, setSelectedCurrency, currencies, isLoadingRates } = useCurrency()
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleCurrencyChange = (currencyCode) => {
        setSelectedCurrency(currencyCode)
        setIsOpen(false)
    }

    const currentCurrency = currencies[selectedCurrency]

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
                <span className="text-lg">{currentCurrency?.flag}</span>
                <span className="hidden sm:inline">{currentCurrency?.code}</span>
                {isLoadingRates ? (
                    <div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-600 rounded-full animate-spin"></div>
                ) : (
                    <ChevronDown 
                        className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                    />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    {Object.values(currencies).map((currency) => (
                        <button
                            key={currency.code}
                            onClick={() => handleCurrencyChange(currency.code)}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors duration-200 ${
                                selectedCurrency === currency.code 
                                    ? 'bg-gray-50 text-gray-900' 
                                    : 'text-gray-700'
                            }`}
                        >
                            <span className="text-lg">{currency.flag}</span>
                            <div className="flex flex-col items-start">
                                <span className="font-medium">{currency.code}</span>
                                <span className="text-xs text-gray-500">{currency.name}</span>
                            </div>
                            {selectedCurrency === currency.code && (
                                <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
