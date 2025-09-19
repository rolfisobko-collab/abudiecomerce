// Script para probar las tasas de cambio
import connectDB from '../config/db.js'
import ExchangeRate from '../models/ExchangeRate.js'

async function testExchangeRates() {
    try {
        console.log('🔄 Conectando a la base de datos...')
        await connectDB()
        
        console.log('📊 Probando colección exchange_rates...')
        
        // Crear una tasa de cambio de prueba
        const testRates = {
            rates: {
                USD: 1,
                ARS: 1000,
                BRL: 5.2,
                PYG: 7500
            },
            source: 'test_script',
            isActive: true
        }
        
        // Desactivar tasas anteriores
        await ExchangeRate.updateMany({ isActive: true }, { isActive: false })
        
        // Crear nueva tasa
        const newRate = await ExchangeRate.create(testRates)
        console.log('✅ Tasa de cambio creada:', newRate)
        
        // Buscar tasa activa
        const activeRate = await ExchangeRate.findOne({ isActive: true })
        console.log('✅ Tasa activa encontrada:', activeRate)
        
        // Listar todas las tasas
        const allRates = await ExchangeRate.find({}).sort({ createdAt: -1 })
        console.log('📋 Todas las tasas:', allRates.length, 'documentos')
        
        console.log('🎉 Prueba completada exitosamente!')
        
    } catch (error) {
        console.error('❌ Error en la prueba:', error)
    } finally {
        process.exit(0)
    }
}

testExchangeRates()
