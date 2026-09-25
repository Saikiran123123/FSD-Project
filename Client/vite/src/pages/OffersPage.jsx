import React, { useState, useEffect } from 'react';
import { offerService } from '../services';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState('');

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      try {
        const res = await offerService.getActiveOffers();
        if (res.success && res.data) {
          setOffers(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2500);
  };

  if (loading) {
    return <LoadingSpinner text="Loading active promotional deals & cinema rewards..." />;
  }

  return (
    <div className="offers-page min-h-screen bg-[#07070b] text-white py-16 sm:py-20">
      <div className="container-cinema max-w-5xl space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[#ffb703] text-xs font-bold uppercase tracking-[0.12em] block">
            ● DISCOUNTS & REWARDS
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Exclusive Movie Offers
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Apply these verified promo coupon codes during checkout to enjoy massive savings on tickets & gourmet snacks.
          </p>
        </div>

        {offers.length === 0 ? (
          <EmptyState
            icon="🏷️"
            title="No Active Offers"
            description="Check back soon for new seasonal discounts and exclusive weekend cinema promotions."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {offers.map((offer) => (
              <div
                key={offer._id}
                className="bg-gradient-to-br from-[#161022] via-[#100d1c] to-[#1a0c14] border border-white/10 hover:border-purple-500/40 rounded-3xl p-7 sm:p-8 shadow-xl space-y-6 relative overflow-hidden flex flex-col justify-between transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-[#ffb703] text-black text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-sm">
                      {offer.discountType === 'flat' ? `₹${offer.discountValue} FLAT OFF` : `${offer.discountValue}% DISCOUNT`}
                    </span>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      Valid till {new Date(offer.validUntil).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white">{offer.title}</h3>
                  <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed">{offer.description}</p>
                </div>

                <div className="pt-5 border-t border-white/10 flex items-center justify-between gap-4">
                  <div className="bg-black/60 border border-dashed border-white/30 rounded-xl px-4 py-2.5 font-mono font-black text-sm text-[#ffb703] tracking-widest shadow-inner">
                    {offer.code}
                  </div>

                  <button
                    onClick={() => handleCopy(offer.code)}
                    className={`text-xs font-bold px-6 py-3 rounded-xl transition-all cursor-pointer shadow-md ${
                      copiedCode === offer.code
                        ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                        : 'btn-cinema'
                    }`}
                  >
                    {copiedCode === offer.code ? '✓ Copied Code' : 'Copy Code'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OffersPage;
