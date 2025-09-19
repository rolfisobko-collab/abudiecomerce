import connectDB from '@/config/db'
import ExchangeRate from '@/models/ExchangeRate'
import { NextResponse } from 'next/server'

// GET - Obtener las tasas de cambio actuales
export async function GET() {
    try {
        await connectDB()
        
        // Buscar la tasa de cambio activa
        let exchangeRate = await ExchangeRate.findOne({ isActive: true })
        
        if (!exchangeRate) {
            // Si no existe, crear una con tasas por defecto
            exchangeRate = await ExchangeRate.create({
                rates: {
                    USD: 1,
                    ARS: 1000,
                    BRL: 5.2,
                    PYG: 7500
                },
                source: 'default',
                isActive: true
            })
        }
        
        return NextResponse.json({
            success: true,
            data: {
                rates: exchangeRate.rates,
                lastUpdated: exchangeRate.lastUpdated,
                source: exchangeRate.source
            }
        })
        
    } catch (error) {
        console.error('❌ Error al obtener tasas de cambio:', error)
        return NextResponse.json({
            success: false,
            message: 'Error al obtener tasas de cambio',
            error: error.message
        }, { status: 500 })
    }
}

// POST - Actualizar las tasas de cambio
export async function POST(request) {
    try {
        await connectDB()
        
        const { rates, source = 'paraguay_api' } = await request.json()
        
        if (!rates || typeof rates !== 'object') {
            return NextResponse.json({
                success: false,
                message: 'Las tasas de cambio son requeridas'
            }, { status: 400 })
        }
        
        // Actualizar o crear el documento único de tasas de cambio
        const updatedExchangeRate = await ExchangeRate.findOneAndUpdate(
            { isActive: true }, // Buscar documento activo
            {
                rates: {
                    USD: rates.USD || 1,
                    ARS: rates.ARS || 1000,
                    BRL: rates.BRL || 5.2,
                    PYG: rates.PYG || 7500
                },
                source,
                isActive: true,
                lastUpdated: new Date()
            },
            {
                upsert: true, // Crear si no existe
                new: true,    // Devolver el documento actualizado
                setDefaultsOnInsert: true
            }
        )
        
        console.log('✅ Tasas de cambio actualizadas:', updatedExchangeRate.rates)
        
        return NextResponse.json({
            success: true,
            message: 'Tasas de cambio actualizadas exitosamente',
            data: {
                rates: updatedExchangeRate.rates,
                lastUpdated: updatedExchangeRate.lastUpdated,
                source: updatedExchangeRate.source
            }
        })
        
    } catch (error) {
        console.error('❌ Error al actualizar tasas de cambio:', error)
        return NextResponse.json({
            success: false,
            message: 'Error al actualizar tasas de cambio',
            error: error.message
        }, { status: 500 })
    }
}
