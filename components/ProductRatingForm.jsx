import React, { useState } from 'react';
import StarRating from './StarRating';
import { useAppContext } from '@/context/AppContext';
import toast from 'react-hot-toast';

const ProductRatingForm = ({ productId, onRatingSubmit }) => {
    const { user, updateProductRating } = useAppContext();
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user) {
            toast.error('Debes iniciar sesión para calificar productos');
            return;
        }

        if (rating === 0) {
            toast.error('Por favor selecciona una calificación');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/product/rating', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId,
                    rating,
                    review: review.trim()
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.message);
                setRating(0);
                setReview('');
                
                // Actualizar el producto en el contexto global
                if (data.averageRating !== undefined && data.totalRatings !== undefined) {
                    updateProductRating(productId, data.averageRating, data.totalRatings);
                }
                
                if (onRatingSubmit) {
                    onRatingSubmit(data.rating);
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error submitting rating:', error);
            toast.error('Error al enviar calificación');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) {
        return (
            <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">
                    Inicia sesión para calificar este producto
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tu calificación
                </label>
                <StarRating
                    rating={rating}
                    interactive={true}
                    onRatingChange={setRating}
                    size="lg"
                    showCount={false}
                />
            </div>

            <div>
                <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
                    Reseña (opcional)
                </label>
                <textarea
                    id="review"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Comparte tu experiencia con este producto..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
                    rows={3}
                    maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                    {review.length}/500 caracteres
                </p>
            </div>

            <button
                type="submit"
                disabled={isSubmitting || rating === 0}
                className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Enviando...' : 'Enviar calificación'}
            </button>
        </form>
    );
};

export default ProductRatingForm;
