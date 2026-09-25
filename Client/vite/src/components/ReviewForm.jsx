import React, { useState } from 'react';
import StarRating from './StarRating';
import { reviewService } from '../services';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const ReviewForm = ({ targetType = 'movie', tmdbMovieId, theatreId, onReviewSubmitted }) => {
  const { isAuthenticated } = useAuth();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="bg-[#111122]/60 border border-white/5 p-6 rounded-xl text-center">
        <p className="text-xs text-zinc-300 mb-3">
          Sign in to share your cinema review with the CineBook community.
        </p>
        <Link
          to="/login"
          className="inline-block bg-[#e50914] text-white text-xs font-bold px-4 py-2 rounded-lg"
        >
          Sign In to Review
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please write a brief review comment');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await reviewService.createReview({
        targetType,
        tmdbMovieId,
        theatreId,
        rating,
        title,
        comment,
      });

      if (res.success) {
        setSuccessMsg('Thank you! Your review has been published.');
        setTitle('');
        setComment('');
        if (onReviewSubmitted) onReviewSubmitted(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#111122]/80 border border-white/5 p-5 rounded-xl space-y-3.5">
      <h4 className="text-sm font-bold text-white">Write a Review</h4>

      {error && <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-lg">{error}</div>}
      {successMsg && <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-lg">{successMsg}</div>}

      <div>
        <label className="block text-xs text-zinc-400 mb-1">Your Rating</label>
        <StarRating rating={rating} size="lg" interactive onRatingChange={(val) => setRating(val)} />
      </div>

      <div>
        <label className="block text-xs text-zinc-400 mb-1">Headline (Optional)</label>
        <input
          type="text"
          placeholder="e.g. Masterpiece visual spectacle!"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e50914]"
        />
      </div>

      <div>
        <label className="block text-xs text-zinc-400 mb-1">Your Thoughts</label>
        <textarea
          rows={3}
          placeholder="Share your cinema experience, acting, visual effects, and sound..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e50914]"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-[#e50914] hover:bg-[#ff0f1f] disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-all cursor-pointer"
      >
        {loading ? 'Submitting...' : 'Post Review'}
      </button>
    </form>
  );
};

export default ReviewForm;
