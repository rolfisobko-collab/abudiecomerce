import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";

// PUT - Actualizar producto
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;
    const body = await request.json();
    
    const { name, category, brand, price, offerPrice, minWholesaleQuantity, description, image } = body;
    
    console.log('🔍 [PRODUCT UPDATE DEBUG] Datos recibidos:', {
      name, category, price, offerPrice, minWholesaleQuantity, description
    });

    // Validaciones básicas
    if (!name || !category || !price || !offerPrice) {
      return NextResponse.json({
        success: false,
        message: "Nombre, categoría, precio y precio de oferta son requeridos"
      }, { status: 400 });
    }

    // Validar minWholesaleQuantity
    if (minWholesaleQuantity && (isNaN(parseInt(minWholesaleQuantity)) || parseInt(minWholesaleQuantity) < 1)) {
      return NextResponse.json({
        success: false,
        message: "La cantidad mínima debe ser un número mayor a 0"
      }, { status: 400 });
    }

    // Procesar imágenes si se proporcionan
    let imageArray = [];
    if (image) {
      imageArray = image.split(',').map(url => url.trim()).filter(url => url);
    }

    const updateData = {
      name,
      category,
      brand: brand || 'Sin marca',
      price: parseFloat(price),
      offerPrice: parseFloat(offerPrice),
      minWholesaleQuantity: minWholesaleQuantity ? parseInt(minWholesaleQuantity) : 1,
      description: description || '',
      image: imageArray.length > 0 ? imageArray : undefined
    };

    console.log('🔍 [PRODUCT UPDATE DEBUG] Datos a actualizar:', updateData);

    // Remover campos undefined
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return NextResponse.json({
        success: false,
        message: "Producto no encontrado"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Producto actualizado exitosamente",
      product
    }, { status: 200 });

  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return NextResponse.json({
      success: false,
      message: "Error interno del servidor"
    }, { status: 500 });
  }
}
