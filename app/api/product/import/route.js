import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Brand from "@/models/Brand";
import { isAdminAuthenticated } from "@/lib/adminAuth";

export async function POST(request) {
    try {
        const isAdmin = await isAdminAuthenticated()
        if (!isAdmin) {
            return NextResponse.json({ success: false, message: 'not authorized' })
        }

        const body = await request.json()
        const { products } = body

        if (!products || !Array.isArray(products)) {
            return NextResponse.json({ success: false, message: 'No se proporcionaron productos válidos' })
        }

        await connectDB()
        
        const results = {
            created: 0,
            updated: 0,
            errors: [],
            categoriesCreated: 0,
            brandsCreated: 0
        }

        // Función para crear o encontrar categoría
        const getOrCreateCategory = async (categoryName) => {
            if (!categoryName || categoryName.trim() === '') return 'Sin categoría'
            
            let category = await Category.findOne({ name: categoryName.trim() })
            if (!category) {
                category = await Category.create({ name: categoryName.trim() })
                results.categoriesCreated++
            }
            return category._id.toString()
        }

        // Función para crear o encontrar marca
        const getOrCreateBrand = async (brandName) => {
            if (!brandName || brandName.trim() === '') return 'Sin marca'
            
            let brand = await Brand.findOne({ name: brandName.trim() })
            if (!brand) {
                brand = await Brand.create({ name: brandName.trim() })
                results.brandsCreated++
            }
            return brand._id.toString()
        }

        for (const productData of products) {
            try {
                // Verificar si el producto ya existe por código o nombre
                const existingProduct = await Product.findOne({
                    $or: [
                        { name: productData.name },
                        { code: productData.code }
                    ]
                })

                // Procesar categoría y marca
                const categoryId = await getOrCreateCategory(productData.category)
                const brandId = await getOrCreateBrand(productData.brand)

                // Procesar minWholesaleQuantity correctamente
                let minWholesaleQuantity = 1
                if (productData.minWholesaleQuantity) {
                    const parsed = parseInt(productData.minWholesaleQuantity)
                    if (!isNaN(parsed) && parsed > 0) {
                        minWholesaleQuantity = parsed
                    }
                }

                const productToSave = {
                    userId: 'admin_abudicell',
                    name: productData.name,
                    description: productData.description || '',
                    category: categoryId,
                    brand: brandId,
                    price: parseFloat(productData.price) || 0,
                    offerPrice: parseFloat(productData.offerPrice) || 0,
                    minWholesaleQuantity: minWholesaleQuantity,
                    image: productData.image && productData.image.trim() !== '' ? [productData.image] : ['/placeholder-product.jpeg'],
                    date: Date.now()
                }

                if (existingProduct) {
                    // Actualizar producto existente - FORZAR ACTUALIZACIÓN COMPLETA
                    await Product.findByIdAndUpdate(existingProduct._id, productToSave, { 
                        new: true, 
                        runValidators: true,
                        overwrite: true 
                    })
                    results.updated++
                } else {
                    // Crear nuevo producto
                    await Product.create(productToSave)
                    results.created++
                }
            } catch (error) {
                results.errors.push({
                    product: productData.name,
                    error: error.message
                })
            }
        }

        return NextResponse.json({ 
            success: true, 
            message: `Importación completada. Creados: ${results.created}, Actualizados: ${results.updated}, Categorías creadas: ${results.categoriesCreated}, Marcas creadas: ${results.brandsCreated}, Errores: ${results.errors.length}`,
            results
        })

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message })
    }
}
