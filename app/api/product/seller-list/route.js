import connectDB from '@/config/db'
import Product from '@/models/Product'
import Category from '@/models/Category'
import Brand from '@/models/Brand'
import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/adminAuth'

export async function GET(request) {
    try {
        console.log('🔍 [SELLER LIST DEBUG] Iniciando proceso de listar productos...')
        
        console.log('🔍 [SELLER LIST DEBUG] Conectando a la base de datos...')
        await connectDB()
        console.log('✅ [SELLER LIST DEBUG] Conexión exitosa')

        console.log('🔍 [SELLER LIST DEBUG] Buscando productos...')
        const products = await Product.find({})
        console.log('🔍 [SELLER LIST DEBUG] Productos encontrados:', products.length)
        
        // Obtener todas las categorías para mapear IDs a nombres
        const categories = await Category.find({})
        const categoryMap = {}
        categories.forEach(cat => {
            categoryMap[cat._id.toString()] = cat.name
        })
        
        // Obtener todas las marcas para mapear IDs a nombres
        const brands = await Brand.find({})
        const brandMap = {}
        brands.forEach(brand => {
            brandMap[brand._id.toString()] = brand.name
        })
        
        // Mapear los productos para incluir el nombre de la categoría y marca
        const productsWithNames = products.map(product => ({
            ...product.toObject(),
            categoryName: categoryMap[product.category] || product.category,
            brandName: brandMap[product.brand] || product.brand || 'Sin marca'
        }))
        
        console.log('🔍 [SELLER LIST DEBUG] Productos procesados con nombres de categoría y marca')
        
        return NextResponse.json({ success:true, products: productsWithNames })

    } catch (error) {
        console.log('❌ [SELLER LIST DEBUG] Error:', error.message)
        return NextResponse.json({ success: false, message: error.message })
    }
}