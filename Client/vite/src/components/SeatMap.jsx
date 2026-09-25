import React from 'react';

const SeatMap = ({
  seats = [],
  selectedSeatIds = [],
  onToggleSeat,
  recommendedSeatIds = [],
}) => {
  // Group seats by row
  const rowsMap = {};
  seats.forEach((seat) => {
    if (!rowsMap[seat.row]) {
      rowsMap[seat.row] = [];
    }
    rowsMap[seat.row].push(seat);
  });

  // Sort rows alphabetically (A near screen to H at back)
  const sortedRowKeys = Object.keys(rowsMap).sort();

  return (
    <div className="seat-map-container flex flex-col items-center select-none w-full max-w-4xl mx-auto overflow-x-auto py-6">
      {/* Curved Screen Banner */}
      <div className="w-full max-w-2xl flex flex-col items-center mb-10">
        <div className="w-full h-3.5 bg-gradient-to-r from-transparent via-[#00d4aa] to-transparent rounded-full opacity-90 shadow-[0_0_25px_#00d4aa]" />
        <p className="text-[11px] uppercase tracking-[0.35em] text-[#00d4aa] mt-2.5 font-extrabold flex items-center gap-2">
          <span>❖</span> ALL EYES THIS WAY • CINEMA SCREEN <span>❖</span>
        </p>
      </div>

      {/* Seat Rows Grid */}
      <div className="space-y-3.5 min-w-[580px] px-4">
        {sortedRowKeys.map((rowKey) => {
          const rowSeats = rowsMap[rowKey].sort((a, b) => a.number - b.number);

          return (
            <div key={rowKey} className="flex items-center justify-center gap-3">
              {/* Row Label Left */}
              <span className="w-6 text-center text-xs font-bold text-zinc-500 font-mono">{rowKey}</span>

              {/* Row Seats */}
              <div className="flex items-center gap-2">
                {rowSeats.map((seat) => {
                  const isSelected = selectedSeatIds.includes(seat.seatId);
                  const isRecommended = recommendedSeatIds.includes(seat.seatId);
                  const isBooked = seat.status === 'booked';
                  const isHeld = seat.status === 'held';

                  let seatClass = 'bg-[#181928] border-white/10 text-zinc-300 hover:border-[#00d4aa] hover:scale-110 cursor-pointer shadow-sm';

                  if (isBooked) {
                    seatClass = 'bg-rose-950/30 border-rose-900/30 text-rose-500/30 cursor-not-allowed opacity-30';
                  } else if (isHeld) {
                    seatClass = 'bg-amber-950/40 border-amber-500/50 text-amber-400 cursor-not-allowed animate-pulse';
                  } else if (isSelected) {
                    seatClass = 'bg-[#e50914] border-white text-white font-black shadow-[0_0_15px_rgba(229,9,20,0.8)] scale-110';
                  } else if (isRecommended) {
                    seatClass = 'bg-[#ffb703]/20 border-[#ffb703] text-[#ffb703] font-bold shadow-[0_0_10px_rgba(255,183,3,0.5)]';
                  } else if (seat.category === 'VIP Recliner') {
                    seatClass = 'bg-indigo-950/60 border-indigo-500/40 text-indigo-300 hover:border-indigo-400';
                  }

                  return (
                    <React.Fragment key={seat.seatId}>
                      {/* Walkway gap in center */}
                      {seat.number === 6 && <div className="w-6" />}

                      <button
                        type="button"
                        disabled={isBooked || isHeld}
                        onClick={() => onToggleSeat && onToggleSeat(seat)}
                        className={`relative w-8 h-8 rounded-t-lg border text-xs font-mono font-semibold flex items-center justify-center transition-all duration-200 ${seatClass}`}
                        title={`${seat.seatId} (${seat.category} - ₹${seat.price}) - ${seat.status}`}
                      >
                        {isBooked ? '✕' : isHeld ? '🔒' : seat.number}

                        {/* Best Recommendation Star */}
                        {isRecommended && !isSelected && !isBooked && !isHeld && (
                          <span className="absolute -top-2 bg-[#ffb703] text-black font-black text-[7px] px-1 rounded-full">
                            ★
                          </span>
                        )}
                      </button>
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Row Label Right */}
              <span className="w-6 text-center text-xs font-bold text-zinc-500 font-mono">{rowKey}</span>
            </div>
          );
        })}
      </div>

      {/* Seat Status & Tier Legend */}
      <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-300">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-t-md bg-[#181928] border border-white/20" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-t-md bg-[#e50914] border border-white shadow-sm" />
          <span className="text-white font-bold">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-t-md bg-indigo-950/60 border border-indigo-500/50" />
          <span className="text-indigo-300">VIP Recliner</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-t-md bg-amber-950/40 border border-amber-500/50" />
          <span className="text-amber-400">Locked (5 Min)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-t-md bg-rose-950/30 border border-rose-900/30 opacity-40" />
          <span className="text-zinc-500">Sold / Occupied</span>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
