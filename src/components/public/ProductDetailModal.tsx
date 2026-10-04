import React, { useState } from 'react';
import { Product } from '../../types/index.ts';
import {
  X,
  CheckCircle2,
  Clock,
  BarChart,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Award,
  Layers,
  MessageSquare
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onBuyNow: (product: Product) => void;
  supportWhatsApp?: string;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onBuyNow,
  supportWhatsApp = '8801890000000'
}) => {
  const [selectedImage, setSelectedImage] = useState(product.thumbnail);

  const discount = product.discountPercentage ||
    (product.previousPrice > product.currentPrice
      ? Math.round(((product.previousPrice - product.currentPrice) / product.previousPrice) * 100)
      : 0);

  const whatsappInquiryUrl = `https://wa.me/${supportWhatsApp}?text=${encodeURIComponent(
    `হ্যালো, আমি "${product.name}" কোর্সটি সম্পর্কে জানতে চাচ্ছি।`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-3xl bg-[#040816] text-slate-100 rounded-3xl shadow-2xl border border-blue-950 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-blue-950/80 flex items-center justify-between bg-[#02050f]">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-950/90 text-blue-300 border border-blue-800/40">
              {product.category}
            </span>
            {product.offerBadge && (
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-linear-to-r from-blue-600 to-indigo-600 text-white flex items-center gap-1 border border-blue-400/30">
                <Sparkles className="w-3 h-3 text-cyan-300" />
                {product.offerBadge}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-blue-950/60 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Main Hero Visual & Thumbnails */}
          <div className="space-y-3">
            <div className="min-h-[220px] max-h-[420px] w-full rounded-2xl overflow-hidden bg-[#02050f] border border-blue-950 shadow-inner flex items-center justify-center p-2">
              <img
                src={selectedImage || product.thumbnail}
                alt={product.name}
                className="max-h-[400px] w-auto max-w-full object-contain rounded-xl"
              />
            </div>

            {/* Gallery thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      selectedImage === img ? 'border-blue-500 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Metadata */}
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {product.name}
            </h2>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-400 font-medium">
              {product.courseDuration && (
                <div className="flex items-center gap-1.5 bg-blue-950/40 text-slate-300 px-3 py-1.5 rounded-lg border border-blue-900/40">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>{product.courseDuration}</span>
                </div>
              )}
              {product.courseLevel && (
                <div className="flex items-center gap-1.5 bg-blue-950/40 text-slate-300 px-3 py-1.5 rounded-lg border border-blue-900/40">
                  <BarChart className="w-4 h-4 text-cyan-400" />
                  <span>লেভেল: {product.courseLevel}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 bg-blue-900/30 text-blue-200 px-3 py-1.5 rounded-lg font-bold border border-blue-700/40">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>লাইফটাইম এক্সেস + সার্টিফিকেট</span>
              </div>
            </div>
          </div>

          {/* Pricing Box with Blue Gradient */}
          <div className="bg-linear-to-r from-blue-950/60 via-[#06122d] to-blue-950/60 border border-blue-800/40 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-black/40">
            <div>
              <span className="text-xs font-bold text-blue-300 block">কোর্স ফি (এককালীন)</span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-blue-400">
                  ৳{product.currentPrice.toLocaleString('en-IN')}
                </span>
                {product.previousPrice > product.currentPrice && (
                  <span className="text-base text-slate-500 line-through font-medium">
                    ৳{product.previousPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {discount > 0 && (
                  <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-xs font-black">
                    {discount}% OFF
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                বিকাশ বা নগদ দিয়ে সরাসরি সেন্ড মানি করে এখনই এনরোল করতে পারবেন।
              </p>
            </div>

            <button
              onClick={() => onBuyNow(product)}
              className="px-6 py-3.5 bg-linear-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/35 flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0 border border-blue-400/25"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Buy Now (এখনই ভর্তি হন)</span>
            </button>
          </div>

          {/* Full Description */}
          <div>
            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>কোর্স বিবরণ ও সারসংক্ষেপ</span>
            </h4>
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2 whitespace-pre-line bg-[#02050f] p-4 rounded-xl border border-blue-950">
              {product.fullDescription || product.shortDescription}
            </div>
          </div>

          {/* What you will learn */}
          {product.whatYouWillLearn && product.whatYouWillLearn.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>এই কোর্সে যা যা শিখবেন</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.whatYouWillLearn.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-[#02050f] border border-blue-950 text-xs text-slate-300 font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features Checklist */}
          {product.features && product.features.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-blue-400" />
                <span>কোর্সের বিশেষ সুবিধাসমূহ</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.features.map((feat, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-blue-950/50 border border-blue-800/40 text-blue-200 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    {feat}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Bottom Bar */}
        <div className="p-4 sm:p-5 border-t border-blue-950 bg-[#02050f] flex items-center justify-between gap-3">
          <a
            href={whatsappInquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-blue-950/50 hover:bg-blue-900/60 text-blue-300 border border-blue-900/60 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <span>সরাসরি হোয়াটসঅ্যাপে জানুন</span>
          </a>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onBuyNow(product)}
              className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer border border-blue-400/20"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>এনরোল করুন (৳{product.currentPrice.toLocaleString('en-IN')})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
