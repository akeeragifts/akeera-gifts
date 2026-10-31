import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number; // 0 to 5
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showLabel?: boolean;
  className?: string;
}

const RATING_LABELS: Record<number, string> = {
  1: '1 Star — Poor',
  2: '2 Stars — Fair',
  3: '3 Stars — Good',
  4: '4 Stars — Very Good',
  5: '5 Stars — Exceptional',
};

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 'md',
  interactive = false,
  onChange,
  showLabel = false,
  className = '',
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  const currentVal = hoverRating !== null ? hoverRating : rating;

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div
        className="inline-flex items-center gap-0.5"
        onMouseLeave={() => interactive && setHoverRating(null)}
      >
        {Array.from({ length: maxStars }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = currentVal >= starValue;
          const isPartial = !isFilled && currentVal > index && currentVal < starValue;

          if (interactive) {
            return (
              <button
                key={index}
                type="button"
                aria-label={RATING_LABELS[starValue] || `${starValue} stars`}
                onClick={() => onChange && onChange(starValue)}
                onMouseEnter={() => setHoverRating(starValue)}
                onFocus={() => setHoverRating(starValue)}
                onBlur={() => setHoverRating(null)}
                className="p-1 rounded-md text-stone-300 hover:text-amber-400 focus:outline-none focus:ring-2 focus:ring-[#B85C75] transition-all cursor-pointer transform hover:scale-115 active:scale-95"
              >
                <Star
                  className={`${starSizes[size]} transition-colors duration-150 ${
                    isFilled
                      ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                      : 'text-stone-300 fill-stone-100'
                  }`}
                />
              </button>
            );
          }

          return (
            <span key={index} className="inline-block">
              <Star
                className={`${starSizes[size]} ${
                  isFilled
                    ? 'fill-amber-400 text-amber-400'
                    : isPartial
                    ? 'fill-amber-300/70 text-amber-400'
                    : 'fill-stone-100 text-stone-300'
                }`}
              />
            </span>
          );
        })}
      </div>

      {showLabel && interactive && currentVal > 0 && (
        <span className="text-xs font-semibold text-[#B85C75] ml-1.5 animate-in fade-in">
          {RATING_LABELS[currentVal]}
        </span>
      )}
    </div>
  );
};
