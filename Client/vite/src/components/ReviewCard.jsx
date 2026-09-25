import React, { useState } from 'react';
import StarRating from './StarRating';
import { reviewService } from '../services';

const ReviewCard = ({ review }) => {
  const [likes, setLikes] = useState(review.likesCount || 0);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = async () => {
    if (hasLiked) return;
    try {
      const res = await reviewService.likeReview(review._id);
      if (res.success) {
        setLikes(res.likesCount);
        setHasLiked(true);
      }
    } catch {
      setLikes(likes + 1);
      setHasLiked(true);
    }
  };

  const formattedDate = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recent';

  return (
    <div className="glass-panel p-4 rounded-2xl space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-[#e50914] flex items-center justify-center font-bold text-white text-xs">
            {review.userName ? review.userName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white">{review.userName}</span>
              {review.isVerifiedPurchase && (
                <span className="bg-[#ffb703]/20 text-[#ffb703] border border-[#ffb703]/40 text-[9px] font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                  ✓ Verified Guest
                </span>
              )}
            </div>
            <span className="text-[10px] text-zinc-500">
              {formattedDate}
            </span>
          </div>
        </div>

        <StarRating rating={review.rating} size="sm" />
      </div>

      {review.title && <h4 className="text-xs font-bold text-white/90">{review.title}</h4>}
      <p className="text-xs text-zinc-300 leading-relaxed">{review.comment}</p>

      <div className="pt-2 border-t border-white/5 flex items-center justify-end">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-[11px] px-2 py-1 rounded transition-colors cursor-pointer ${
            hasLiked ? 'text-rose-400 bg-rose-500/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <span>{hasLiked ? '❤️' : '🤍'}</span>
          <span>Helpful ({likes})</span>
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;
