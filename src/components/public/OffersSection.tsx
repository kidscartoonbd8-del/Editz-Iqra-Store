import React from 'react';
import { Offer, Product } from '../../types/index.ts';
import { Sparkles, Tag, ArrowRight, Clock, Percent } from 'lucide-react';

interface OffersSectionProps {
  offers: Offer[];
  products: Product[];
  onSelectOffer: (offer: Offer) => void;
}

export const OffersSection: React.FC<OffersSectionProps> = ({
  offers,
  products,
  onSelectOffer
}) => {
  const activeOffers = offers.filter(o => {
    if (!o.isActive) return false;
    if (o.endDate) {
      const today = new Date().toISOString().split('T')[0];
      if (o.endDate < today) return false;
    }
    return true;
  });

  if (activeOffers.length === 0) return null;

  return (
    <section id="offers-section" className="py-12 bg-linear-to-r from-emerald-950 via-slate-900 to-teal-950 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ধামাকা ডিসকাউন্ট অফার</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              বিশেষ ছাড় ও স্কলারশিপ অফার
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              সীমিত সময়ের জন্য বাছাইকৃত জনপ্রিয় কোর্সসমূহে বিশাল ছাড়ের সুযোগ উপভোগ করুন।
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeOffers.map((offer) => {
            const linkedProduct = products.find(p => p.id === offer.productId);
            const discount = offer.discountPercentage ||
              (offer.previousPrice > offer.offerPrice
                ? Math.round(((offer.previousPrice - offer.offerPrice) / offer.previousPrice) * 100)
                : 0);

            return (
              <div
                key={offer.id}
                className="bg-slate-900/80 backdrop-blur-md border border-slate-700/80 hover:border-emerald-500/50 rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between group shadow-xl relative overflow-hidden"
              >
                {/* Decorative glow corner */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {offer.badge || 'বিশেষ ছাড়'}
                    </span>

                    {discount > 0 && (
                      <span className="px-2.5 py-1 rounded-lg bg-red-500 text-white text-xs font-black tracking-wide shadow-xs flex items-center gap-1">
                        <Percent className="w-3 h-3" />
                        <span>{discount}% OFF</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {offer.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {offer.description}
                  </p>

                  {offer.endDate && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-300 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>মেয়াদ শেষ: {offer.endDate}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl sm:text-2xl font-black text-emerald-400">
                        ৳{offer.offerPrice.toLocaleString('en-IN')}
                      </span>
                      {offer.previousPrice > offer.offerPrice && (
                        <span className="text-xs sm:text-sm text-slate-400 line-through">
                          ৳{offer.previousPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 block">বিকাশ / নগদ ইনস্ট্যান্ট পেমেন্ট</span>
                  </div>

                  <button
                    onClick={() => onSelectOffer(offer)}
                    className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
                  >
                    <span>অফারটি নিন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
