import React from 'react';

export const Skeleton = ({ className = '', variant = 'rectangular' }) => {
  const variantClasses = {
    rectangular: 'rounded-xl',
    circular: 'rounded-full',
    text: 'rounded-md h-4',
  }[variant] || 'rounded-xl';

  return <div className={`skeleton-shimmer bg-white/5 border border-white/5 ${variantClasses} ${className}`} />;
};

export const MovieCardSkeleton = () => (
  <div className="space-y-3">
    <Skeleton className="w-full aspect-[2/3]" />
    <Skeleton variant="text" className="w-4/5 h-4" />
    <Skeleton variant="text" className="w-1/2 h-3" />
  </div>
);

export const TheatreCardSkeleton = () => (
  <div className="bg-[#12131f]/80 border border-white/5 rounded-2xl p-6 space-y-4">
    <div className="flex justify-between items-start">
      <div className="space-y-2 w-3/4">
        <Skeleton variant="text" className="w-2/3 h-5" />
        <Skeleton variant="text" className="w-1/2 h-3" />
      </div>
      <Skeleton className="w-12 h-6" />
    </div>
    <div className="flex gap-2 pt-2">
      <Skeleton className="w-16 h-6" />
      <Skeleton className="w-20 h-6" />
      <Skeleton className="w-16 h-6" />
    </div>
  </div>
);

export default Skeleton;
