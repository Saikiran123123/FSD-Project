import React from 'react';
import { Link } from 'react-router-dom';

export const SectionHeader = ({
  tag,
  tagColor = 'text-[#e50914]',
  title,
  subtitle,
  actionLabel,
  actionLink,
  className = 'mb-8 sm:mb-10',
}) => {
  return (
    <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 ${className}`}>
      <div className="max-w-2xl">
        {tag && (
          <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] mb-2 ${tagColor}`}>
            <span className="w-2 h-2 rounded-full bg-current shadow-sm shadow-current/50"></span>
            <span>{tag}</span>
          </div>
        )}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {actionLabel && actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#ffb703] hover:text-white transition-colors self-start md:self-auto group py-1"
        >
          <span>{actionLabel}</span>
          <span className="transition-transform duration-200 group-hover:translate-x-1.5">→</span>
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;
