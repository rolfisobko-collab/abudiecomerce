import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const StarRating = ({ 
    rating = 0, 
    totalRatings = 0, 
    interactive = false, 
    onRatingChange = null,
    size = 'sm',
    showCount = true,
    className = ''
}) => {
    const [hoverRating, setHoverRating] = useState(0);

    const handleStarClick = (starRating) => {
        if (interactive && onRatingChange) {
            onRatingChange(starRating);
        }
    };

    const handleStarHover = (starRating) => {
        if (interactive) {
            setHoverRating(starRating);
        }
    };

    const handleMouseLeave = () => {
        if (interactive) {
            setHoverRating(0);
        }
    };

    const getStarSize = () => {
        switch (size) {
            case 'xs': return 'w-3 h-3';
            case 'sm': return 'w-4 h-4';
            case 'md': return 'w-5 h-5';
            case 'lg': return 'w-6 h-6';
            default: return 'w-4 h-4';
        }
    };

    const displayRating = interactive ? hoverRating || rating : rating;

    return (
        <div className={`flex items-center gap-1 ${className}`}>
            <div 
                className="flex items-center gap-0.5"
                onMouseLeave={handleMouseLeave}
            >
                {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= displayRating;
                    const isHalfFilled = star === Math.ceil(displayRating) && displayRating % 1 !== 0;
                    
                    return (
                        <button
                            key={star}
                            type="button"
                            onClick={() => handleStarClick(star)}
                            onMouseEnter={() => handleStarHover(star)}
                            disabled={!interactive}
                            className={`${getStarSize()} transition-colors ${
                                interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
                            }`}
                        >
                            <FaStar
                                className={`${getStarSize()} ${
                                    isFilled || isHalfFilled
                                        ? 'text-yellow-400' // Estrella dorada llena
                                        : 'text-gray-300'  // Estrella gris vacía
                                } transition-colors`}
                                style={{
                                    filter: isFilled || isHalfFilled 
                                        ? 'drop-shadow(0 0 2px rgba(251, 191, 36, 0.5))' 
                                        : 'none'
                                }}
                            />
                        </button>
                    );
                })}
            </div>
            
            {showCount && (
                <span className="text-sm text-gray-600 ml-1">
                    ({totalRatings})
                </span>
            )}
        </div>
    );
};

export default StarRating;
