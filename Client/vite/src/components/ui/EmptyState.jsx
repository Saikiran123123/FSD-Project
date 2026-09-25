import React from 'react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  icon = '🎬',
  title = 'No Items Found',
  description = 'There are currently no items matching your selection.',
  actionLabel,
  actionLink,
  onAction,
}) => {
  return (
    <div className="text-center py-16 px-4 bg-[#12131f]/60 backdrop-blur-md rounded-2xl border border-white/5 max-w-lg mx-auto space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl mx-auto shadow-inner">
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="text-base sm:text-lg font-bold text-white">{title}</h3>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
      </div>
      {(actionLabel && (actionLink || onAction)) && (
        <div className="pt-2">
          {actionLink ? (
            <Link
              to={actionLink}
              className="inline-flex items-center gap-2 btn-cinema px-5 py-2.5 rounded-xl text-xs font-bold"
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="inline-flex items-center gap-2 btn-cinema px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
