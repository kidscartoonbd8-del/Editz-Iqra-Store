import React from 'react';
import { Product } from '../../types/index.ts';
import { Clock, BarChart, CheckCircle2, ShoppingBag, Eye, Percent, Sparkles } from 'lucide-react';

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
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Thumbnail Container */}
        <div
          onClick={() => onViewDetails(product)}
          className="relative h-48 sm:h-54 w-full overflow-hidden bg-slate-900/5 flex items-center justify-center cursor-pointer p-1.5"
        >
          <img
            src={product.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'}
            alt={product.name}
            className="max-h-full max-w-full w-auto h-auto object-contain rounded-xl transition-transform duration-300 group-hover:scale-103"
            loading="lazy"
          />

          {/* Badges Overlay */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 items-center">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-900/80 backdrop-blur-xs text-white">
              {product.category}
            </span>
            {product.offerBadge && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-xs flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                {product.offerBadge}
              </span>
            )}
          </div>

          {/* Discount Tag */}
          {discount > 0 && (
            <div className="absolute top-2.5 right-2.5">
              <span className="px-2 py-1 rounded-md text-xs font-black bg-red-600 text-white shadow-md flex items-center gap-0.5">
                <span>{discount}% OFF</span>
              </span>
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-4 sm:p-5">
          {/* Metadata Meta pills */}
          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500 mb-2.5">
            {product.courseDuration && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{product.courseDuration}</span>
              </span>
            )}
            {product.courseLevel && (
              <span className="flex items-center gap-1">
                <BarChart className="w-3.5 h-3.5 text-slate-400" />
                <span>{product.courseLevel}</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            onClick={() => onViewDetails(product)}
            className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug cursor-pointer"
          >
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Feature Highlights (Up to 2) */}
          {product.features && product.features.length > 0 && (
            <div className="mt-3.5 space-y-1.5 pt-3 border-t border-slate-100">
              {product.features.slice(0, 2).map((feat, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="truncate">{feat}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Pricing & Actions */}
      <div className="p-4 sm:p-5 pt-0 mt-2">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
                ৳{product.currentPrice.toLocaleString('en-IN')}
              </span>
              {product.previousPrice > product.currentPrice && (
                <span className="text-xs text-slate-400 line-through font-medium">
                  ৳{product.previousPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-600 font-medium block">
              বিকাশ / নগদ ইনস্ট্যান্ট পেমেন্ট
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onViewDetails(product)}
            className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>বিস্তারিত</span>
          </button>

          <button
            onClick={() => onBuyNow(product)}
            className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
