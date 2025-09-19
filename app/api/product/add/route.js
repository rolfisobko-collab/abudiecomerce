import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";
import { isAdminAuthenticated } from "@/lib/adminAuth";


// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


export async function POST(request) {
    try {
        console.log('🔍 [PRODUCT ADD DEBUG] Iniciando proceso de agregar producto...')
        
        const isAdmin = await isAdminAuthenticated()
        console.log('🔍 [PRODUCT ADD DEBUG] Admin autenticado:', isAdmin ? 'SÍ' : 'NO')

        if (!isAdmin) {
            console.log('❌ [PRODUCT ADD DEBUG] No autorizado')
            return NextResponse.json({ success: false, message: 'not authorized' })
        }

        const formData = await request.formData()

        const name = formData.get('name');
        const description = formData.get('description');
        const category = formData.get('category');
        const brand = formData.get('brand');
        const price = formData.get('price');
        const offerPrice = formData.get('offerPrice');
        const minWholesaleQuantity = formData.get('minWholesaleQuantity');


        const files = formData.getAll('images');
        let image = [];

        if (files && files.length > 0) {
            const result = await Promise.all(
                files.map(async (file) => {
                    const arrayBuffer = await file.arrayBuffer()
                    const buffer = Buffer.from(arrayBuffer)

                    return new Promise((resolve,reject)=>{
                        const stream = cloudinary.uploader.upload_stream(
                            {resource_type: 'auto'},
                            (error,result) => {
                                if (error) {
                                    reject(error)
                                } else {
                                    resolve(result)
                                }
                            }
                        )
                        stream.end(buffer)
                    })
                })
            )

            image = result.map(result => result.secure_url)
        }

        await connectDB()
        const productData = {
            userId: 'admin_abudicell', // Usar ID fijo del admin
            name,
            description,
            category,
            brand: brand || 'Sin marca',
            price:Number(price),
            offerPrice:Number(offerPrice),
            minWholesaleQuantity:Number(minWholesaleQuantity) || 1,
            image,
            date: Date.now()
        };


        const newProduct = await Product.create(productData)

        return NextResponse.json({ success: true, message: 'Upload successful', newProduct })


    } catch (error) {
        NextResponse.json({ success: false, message: error.message })
    }
}