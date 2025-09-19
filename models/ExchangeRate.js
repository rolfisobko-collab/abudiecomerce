import mongoose from 'mongoose'

const exchangeRateSchema = new mongoose.Schema({
    // Tasas de cambio principales
    rates: {
        USD: { type: Number, required: true, default: 1 },
        ARS: { type: Number, required: true, default: 1000 },
        BRL: { type: Number, required: true, default: 5.2 },
        PYG: { type: Number, required: true, default: 7500 }
    },
    
    // Información de la actualización
    lastUpdated: { type: Date, default: Date.now },
    source: { type: String, default: 'paraguay_api' },
    
    // Metadatos
    version: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true,
    collection: 'exchange_rates'
})

// Índice simple para optimizar búsquedas
exchangeRateSchema.index({ isActive: 1 })

// Eliminar el modelo existente si existe
if (mongoose.models.exchange_rates) {
    delete mongoose.models.exchange_rates
}

const ExchangeRate = mongoose.model('exchange_rates', exchangeRateSchema)

export default ExchangeRate
