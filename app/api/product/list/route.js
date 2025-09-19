import connectDB from '@/config/db'
import Product from '@/models/Product'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
        await connectDB()

        // Consulta simple para debug
        const products = await Product.find({}).lean();
        console.log('🔍 [ATLAS] Total productos encontrados:', products.length);
        
        // Verificar si hay productos con campos diferentes
        if (products.length > 0) {
            console.log('🔍 [ATLAS] Primer producto:', products[0]);
            console.log('🔍 [ATLAS] Muestra de productos:', products.slice(0, 3).map(p => ({ name: p.name, userId: p.userId })));
        }
        
        return NextResponse.json({ 
            success: true, 
            products,
            source: 'atlas',
            count: products.length
        })

    } catch (error) {
        console.error('❌ [ATLAS] Error:', error.message);
        return NextResponse.json({ 
            success: false, 
            message: 'Error al cargar productos desde Atlas',
            error: error.message 
        })
    }
}