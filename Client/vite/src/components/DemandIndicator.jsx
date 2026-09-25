import React from 'react';

const DemandIndicator = ({ occupancyPercentage = 0, showLabel = true }) => {
  let status = {
    color: '#00c851', // green
    bg: 'rgba(0, 200, 81, 0.12)',
    border: 'rgba(0, 200, 81, 0.3)',
    text: 'Available',
    dotClass: 'bg-emerald-500',
  };

  if (occupancyPercentage >= 70) {
    status = {
      color: '#ff3b30', // red
      bg: 'rgba(255, 59, 48, 0.12)',
      border: 'rgba(255, 59, 48, 0.3)',
      text: 'Almost Full',
      dotClass: 'bg-rose-500 animate-ping',
    };
  } else if (occupancyPercentage >= 30) {
    status = {
      color: '#ffb703', // gold/amber
      bg: 'rgba(255, 183, 3, 0.12)',
      border: 'rgba(255, 183, 3, 0.3)',
      text: 'Filling Fast',
      dotClass: 'bg-amber-400',
    };
  }

  return (
    <div
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm"
      style={{
        backgroundColor: status.bg,
        border: `1px solid ${status.border}`,
        color: status.color,
      }}
      title={`Live CineBook Occupancy: ${occupancyPercentage}%`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full inline-block"
        style={{ backgroundColor: status.color }}
      />
      {showLabel && <span>{status.text}</span>}
      <span className="text-[10px] opacity-75 font-mono">{occupancyPercentage}%</span>
    </div>
  );
};

export default DemandIndicator;
