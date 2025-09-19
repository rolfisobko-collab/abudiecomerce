import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Rating from "@/models/Rating";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Obtener ratings de un producto
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');

        if (!productId) {
            return NextResponse.json({ 
                success: false, 
                message: 'ID de producto requerido' 
            });
        }

        await connectDB();

        const ratings = await Rating.find({ productId })
            .sort({ createdAt: -1 })
            .limit(10); // Limitar a 10 reviews más recientes

        return NextResponse.json({ 
            success: true, 
            ratings 
        });

    } catch (error) {
        console.error('Error fetching ratings:', error);
        return NextResponse.json({ 
            success: false, 
            message: 'Error al obtener ratings' 
        });
    }
}

// Crear o actualizar rating
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user) {
            return NextResponse.json({ 
                success: false, 
                message: 'Debes iniciar sesión para calificar productos' 
            });
        }

        const { productId, rating, review } = await request.json();

        if (!productId || !rating || rating < 1 || rating > 5) {
            return NextResponse.json({ 
                success: false, 
                message: 'Datos de rating inválidos' 
            });
        }

        await connectDB();

        // Verificar que el producto existe
        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json({ 
                success: false, 
                message: 'Producto no encontrado' 
            });
        }

        const userId = session.user.id;
        const userName = session.user.name || session.user.email;

        // Buscar rating existente
        const existingRating = await Rating.findOne({ userId, productId });

        let savedRating;
        if (existingRating) {
            // Actualizar rating existente
            existingRating.rating = rating;
            existingRating.review = review || '';
            existingRating.userName = userName;
            savedRating = await existingRating.save();
        } else {
            // Crear nuevo rating
            savedRating = await Rating.create({
                userId,
                productId,
                rating,
                review: review || '',
                userName
            });
        }

        // Actualizar estadísticas del producto
        const updatedStats = await updateProductRatingStats(productId);

        return NextResponse.json({ 
            success: true, 
            rating: savedRating,
            averageRating: updatedStats.averageRating,
            totalRatings: updatedStats.totalRatings,
            message: existingRating ? 'Rating actualizado' : 'Rating creado'
        });

    } catch (error) {
        console.error('Error saving rating:', error);
        return NextResponse.json({ 
            success: false, 
            message: 'Error al guardar rating' 
        });
    }
}

// Función para actualizar estadísticas de rating del producto
async function updateProductRatingStats(productId) {
    try {
        const ratings = await Rating.find({ productId });
        
        if (ratings.length === 0) {
            await Product.findByIdAndUpdate(productId, {
                averageRating: 0,
                totalRatings: 0
            });
            return {
                averageRating: 0,
                totalRatings: 0
            };
        }

        const totalRatings = ratings.length;
        const sumRatings = ratings.reduce((sum, rating) => sum + rating.rating, 0);
        const averageRating = Math.round((sumRatings / totalRatings) * 10) / 10; // Redondear a 1 decimal

        await Product.findByIdAndUpdate(productId, {
            averageRating,
            totalRatings
        });

        return {
            averageRating,
            totalRatings
        };

    } catch (error) {
        console.error('Error updating product rating stats:', error);
        return {
            averageRating: 0,
            totalRatings: 0
        };
    }
}
