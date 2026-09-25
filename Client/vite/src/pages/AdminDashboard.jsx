import React, { useState, useEffect } from 'react';
import { adminService } from '../services';
import { formatINR } from '../utils/currency';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await adminService.getDashboardStats();
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Admin stats error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Aggregating cinema business metrics & real-time analytics..." />;
  }

  return (
    <div className="min-h-screen py-10 sm:py-14 text-white">
      <div className="container-cinema space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ffb703] animate-pulse" />
              <span className="text-[#ffb703] text-xs font-black uppercase tracking-widest">
                Management Suite
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Admin Command Center
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Real-time cinema telemetry, revenue aggregation, and live auditorium occupancy
            </p>
          </div>

          <div className="flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-4 py-2.5 rounded-2xl font-bold self-start sm:self-auto shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Booking Engine Active</span>
          </div>
        </div>

        {/* KPI Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="glass-card p-6 rounded-3xl space-y-2 border border-white/10 hover:border-white/20 transition-all">
            <span className="text-xs text-zinc-400 font-semibold block">Total Ticket Revenue</span>
            <div className="text-3xl font-black text-[#00d4aa] font-mono tracking-tight">
              {formatINR(stats?.totalRevenue || 0)}
            </div>
            <span className="text-[11px] text-zinc-500 block">From confirmed reservations</span>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-2 border border-white/10 hover:border-white/20 transition-all">
            <span className="text-xs text-zinc-400 font-semibold block">Total Reservations</span>
            <div className="text-3xl font-black text-white font-mono tracking-tight">
              {stats?.totalBookings || 0}
            </div>
            <span className="text-[11px] text-emerald-400 block font-semibold">
              {stats?.confirmedBookings || 0} confirmed passes
            </span>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-2 border border-white/10 hover:border-white/20 transition-all">
            <span className="text-xs text-zinc-400 font-semibold block">Active Multiplexes</span>
            <div className="text-3xl font-black text-[#ffb703] font-mono tracking-tight">
              {stats?.totalTheatres || 4}
            </div>
            <span className="text-[11px] text-zinc-500 block">Hyderabad, Bengaluru, Mumbai</span>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-2 border border-white/10 hover:border-white/20 transition-all">
            <span className="text-xs text-zinc-400 font-semibold block">Scheduled Shows</span>
            <div className="text-3xl font-black text-[#e50914] font-mono tracking-tight">
              {stats?.totalShows || 0}
            </div>
            <span className="text-[11px] text-zinc-500 block">Across all cinema screens</span>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-white/10">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Recent Guest Reservations
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">Live stream of ticket transactions</p>
            </div>
            <span className="text-xs text-zinc-400 font-mono bg-white/5 px-3 py-1 rounded-lg border border-white/10">
              {stats?.recentBookings?.length || 0} Transactions Loaded
            </span>
          </div>

          {!stats?.recentBookings || stats.recentBookings.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <span className="text-3xl block">🎟️</span>
              <p className="text-xs text-zinc-400">No bookings recorded yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-zinc-400 text-[11px] uppercase tracking-wider">
                    <th className="pb-3.5 font-bold">Booking ID</th>
                    <th className="pb-3.5 font-bold">Guest</th>
                    <th className="pb-3.5 font-bold">Movie Title</th>
                    <th className="pb-3.5 font-bold">Multiplex</th>
                    <th className="pb-3.5 font-bold">Seats</th>
                    <th className="pb-3.5 font-bold text-right">Amount</th>
                    <th className="pb-3.5 font-bold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {stats.recentBookings.map((b) => (
                    <tr key={b._id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 font-mono font-bold text-white">{b.bookingId}</td>
                      <td className="py-3.5 text-zinc-300 font-medium">{b.user?.name || 'Guest User'}</td>
                      <td className="py-3.5 font-bold text-white">{b.movieSnapshot?.title}</td>
                      <td className="py-3.5 text-zinc-400">{b.theatreSnapshot?.name}</td>
                      <td className="py-3.5 font-mono text-[#ffb703] font-bold">
                        {b.seats?.map((s) => s.seatId).join(', ')}
                      </td>
                      <td className="py-3.5 font-mono font-black text-[#00d4aa] text-right">
                        {formatINR(b.pricing?.totalAmount || 0)}
                      </td>
                      <td className="py-3.5 text-right">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            b.bookingStatus === 'cancelled'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {b.bookingStatus || 'confirmed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
