import React from 'react';

export const StarRating = ({ rating = 0, max = 5, size = 'md', interactive = false, onRatingChange }) => {
  const stars = [];
  const normalized = Math.min(max, Math.max(0, rating));

  const sizeClasses = {
    sm: 'text-xs gap-0.5',
    md: 'text-sm gap-1',
    lg: 'text-lg gap-1.5',
    xl: 'text-2xl gap-2',
  }[size] || 'text-sm gap-1';

  for (let i = 1; i <= max; i++) {
    const isFilled = i <= Math.round(normalized);
    stars.push(
      <span
        key={i}
        onClick={() => interactive && onRatingChange && onRatingChange(i)}
        className={`${interactive ? 'cursor-pointer hover:scale-125 transition-transform' : ''} ${
          isFilled ? 'text-[#ffb703]' : 'text-gray-600'
        }`}
        style={{ color: isFilled ? '#ffb703' : '#4a4a60' }}
      >
        ★
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center ${sizeClasses}`} title={`${rating} out of ${max} stars`}>
      {stars}
      {rating > 0 && !interactive && (
        <span className="ml-1.5 font-semibold text-white/90 text-xs">{Number(rating).toFixed(1)}</span>
      )}
    </div>
  );
};

export default StarRating;
