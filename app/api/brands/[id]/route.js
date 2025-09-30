import connectDB from '@/config/db'
import Brand from '@/models/Brand'
import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/adminAuth'

// PUT - Actualizar marca
export async function PUT(request, { params }) {
  try {
    const isAdmin = await isAdminAuthenticated()
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: 'No autorizado' })
    }

    const { id } = await params
    const { name, description } = await request.json()
    
    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, message: 'El nombre de la marca es requerido' })
    }

    await connectDB()
    
    // Verificar si ya existe otra marca con el mismo nombre
    const existingBrand = await Brand.findOne({ 
      name: name.trim(), 
      _id: { $ne: id } 
    })
    
    if (existingBrand) {
      return NextResponse.json({ success: false, message: 'Ya existe una marca con ese nombre' })
    }

    const brand = await Brand.findByIdAndUpdate(
      id,
      { 
        name: name.trim(),
        description: description?.trim() || ''
      },
      { new: true, runValidators: true }
    )

    if (!brand) {
      return NextResponse.json({ success: false, message: 'Marca no encontrada' })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Marca actualizada exitosamente', 
      brand 
    })

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message })
  }
}

// DELETE - Eliminar marca
export async function DELETE(request, { params }) {
  try {
    const isAdmin = await isAdminAuthenticated()
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: 'No autorizado' })
    }

    const { id } = await params
    await connectDB()
    
    const brand = await Brand.findByIdAndDelete(id)
    
    if (!brand) {
      return NextResponse.json({ success: false, message: 'Marca no encontrada' })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Marca eliminada exitosamente' 
    })

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message })
  }
}





