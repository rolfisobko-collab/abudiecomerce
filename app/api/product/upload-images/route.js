import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function POST(request) {
    try {
        console.log('🔍 [UPLOAD IMAGES DEBUG] Iniciando proceso de subir imágenes...')
        
        const isAdmin = await isAdminAuthenticated()
        console.log('🔍 [UPLOAD IMAGES DEBUG] Admin autenticado:', isAdmin ? 'SÍ' : 'NO')

        if (!isAdmin) {
            console.log('❌ [UPLOAD IMAGES DEBUG] No autorizado')
            return NextResponse.json({ success: false, message: 'not authorized' })
        }

        const formData = await request.formData()
        const files = formData.getAll('images');

        if (!files || files.length === 0) {
            return NextResponse.json({ success: false, message: 'no files uploaded' })
        }

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

        const images = result.map(result => result.secure_url)

        return NextResponse.json({ success: true, message: 'Images uploaded successfully', images })

    } catch (error) {
        console.log('❌ [UPLOAD IMAGES DEBUG] Error:', error.message)
        return NextResponse.json({ success: false, message: error.message })
    }
}





