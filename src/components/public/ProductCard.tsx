import React from 'react';
import { Product } from '../../types/index.ts';
import { Clock, BarChart, CheckCircle2, ShoppingBag, Eye, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onBuyNow
}) => {
  const discount = product.discountPercentage ||
    (product.previousPrice > product.currentPrice
      ? Math.round(((product.previousPrice - product.currentPrice) / product.previousPrice) * 100)
      : 0);

  return (
    <div className="bg-linear-to-b from-[#020617] via-[#050f2b] to-[#020617] rounded-3xl border border-blue-900/60 shadow-xl hover:shadow-2xl hover:shadow-blue-600/20 hover:border-blue-500/80 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Thumbnail Container (Adaptive to ANY user image size, preserving natural proportions) */}
        <div
          onClick={() => onViewDetails(product)}
          className="relative h-52 sm:h-60 w-full overflow-hidden bg-black/60 border-b border-blue-950/80 flex items-center justify-center cursor-pointer p-3"
        >
          <img
            src={product.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'}
            alt={product.name}
            className="max-h-full max-w-full w-auto h-auto object-contain rounded-2xl transition-transform duration-300 group-hover:scale-102 drop-shadow-lg"
            loading="lazy"
          />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-black/80 backdrop-blur-xs text-blue-300 border border-blue-800/50">
              {product.category}
            </span>
            {product.offerBadge && (
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md flex items-center gap-1 border border-blue-400/40">
                <Sparkles className="w-2.5 h-2.5 text-cyan-300" />
                {product.offerBadge}
              </span>
            )}
          </div>

          {/* Discount Tag */}
          {discount > 0 && (
            <div className="absolute top-3 right-3">
              <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-red-600 text-white shadow-lg flex items-center gap-0.5 border border-red-400/30">
                <span>{discount}% OFF</span>
              </span>
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-5 sm:p-6">
          {/* Metadata pills */}
          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-400 mb-3">
            {product.courseDuration && (
              <span className="flex items-center gap-1 text-slate-300 bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-900/40">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>{product.courseDuration}</span>
              </span>
            )}
            {product.courseLevel && (
              <span className="flex items-center gap-1 text-slate-300 bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-900/40">
                <BarChart className="w-3.5 h-3.5 text-cyan-400" />
                <span>{product.courseLevel}</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            onClick={() => onViewDetails(product)}
            className="font-extrabold text-base sm:text-lg text-white group-hover:text-blue-300 transition-colors line-clamp-2 leading-snug cursor-pointer"
          >
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
            {product.shortDescription || 'আধুনিক প্রজেক্টভিত্তিক সিলেবাস এবং অভিজ্ঞ মেন্টরদের সরাসরি সাপোর্ট।'}
          </p>

          {/* Key highlights bullet points */}
          {product.whatYouWillLearn && product.whatYouWillLearn.length > 0 && (
            <ul className="mt-3.5 space-y-1.5 text-[11px] text-slate-300">
              {product.whatYouWillLearn.slice(0, 2).map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Card Footer with Pricing & Actions */}
      <div className="p-5 sm:p-6 pt-0 border-t border-blue-950/60 mt-2">
        <div className="flex items-baseline justify-between pt-4 mb-4">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
              কোর্স ফি (BDT)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white font-mono">
                ৳{product.currentPrice.toLocaleString('en-IN')}
              </span>
              {product.previousPrice > product.currentPrice && (
                <span className="text-xs text-slate-500 line-through font-mono">
                  ৳{product.previousPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => onViewDetails(product)}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>সিলেবাস</span>
          </button>
        </div>

        <button
          onClick={() => onBuyNow(product)}
          className="w-full py-3 bg-linear-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer border border-blue-400/30 group-hover:scale-[1.01]"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>ভর্তি হন (Enroll Now)</span>
        </button>
      </div>
    </div>
  );
};
