import Show from '../models/Show.js';

export const startSeatCleanupJob = (intervalMs = 30000) => {
  console.log('[SeatCleanup] Background job initialized (running every 30s)');

  setInterval(async () => {
    try {
      const now = new Date();
      // Find shows with expired held seats
      const result = await Show.updateMany(
        {
          'seats.status': 'held',
          'seats.heldUntil': { $lt: now },
        },
        {
          $set: {
            'seats.$[s].status': 'available',
            'seats.$[s].heldBy': null,
            'seats.$[s].heldUntil': null,
          },
        },
        {
          arrayFilters: [{ 's.status': 'held', 's.heldUntil': { $lt: now } }],
        }
      );

      if (result.modifiedCount > 0) {
        console.log(`[SeatCleanup] Released expired held seats in ${result.modifiedCount} show(s).`);
      }
    } catch (error) {
      console.error(`[SeatCleanup] Error running cleanup job: ${error.message}`);
    }
  }, intervalMs);
};
