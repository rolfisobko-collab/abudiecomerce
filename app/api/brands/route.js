import connectDB from '@/config/db'
import Brand from '@/models/Brand'
import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/adminAuth'

// GET - Obtener todas las marcas
export async function GET() {
  try {
    await connectDB()
    const brands = await Brand.find({}).sort({ name: 1 })
    return NextResponse.json({ success: true, brands })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message })
  }
}

// POST - Crear nueva marca
export async function POST(request) {
  try {
    const isAdmin = await isAdminAuthenticated()
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: 'No autorizado' })
    }

    const { name, description } = await request.json()
    
    if (!name) {
      return NextResponse.json({ success: false, message: 'El nombre de la marca es requerido' })
    }

    await connectDB()
    
    // Verificar si la marca ya existe
    const existingBrand = await Brand.findOne({ name: name.trim() })
    if (existingBrand) {
      return NextResponse.json({ success: false, message: 'Ya existe una marca con ese nombre' })
    }

    const brand = await Brand.create({
      name: name.trim(),
      description: description?.trim() || ''
    })

    return NextResponse.json({ success: true, message: 'Marca creada exitosamente', brand })
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message })
  }
}




