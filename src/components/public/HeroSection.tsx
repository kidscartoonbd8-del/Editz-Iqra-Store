import React from 'react';
import { HeroConfig } from '../../types/index.ts';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface HeroSectionProps {
  hero: HeroConfig;
  onCtaClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ hero, onCtaClick }) => {
  if (!hero.isVisible) return null;

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-[#020617] via-[#051131] to-[#020617] text-white pt-12 pb-16 sm:pt-16 sm:pb-24 border-b border-blue-950/60">
      {/* Background Decorative Radial Blue Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-radial from-blue-600/25 via-indigo-900/10 to-transparent blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Badge */}
            {hero.badgeText && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold shadow-xs">
                <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                <span>{hero.badgeText}</span>
              </div>
            )}

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight sm:leading-tight">
              {hero.heading}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
              {hero.subtitle}
            </p>

            {/* Action CTA & Highlights */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onCtaClick}
                className="w-full sm:w-auto px-8 py-3.5 bg-linear-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base rounded-xl shadow-xl shadow-blue-600/35 transition-all flex items-center justify-center gap-2 group cursor-pointer border border-blue-400/30"
              >
                <span>{hero.buttonText || 'কোর্সগুলো দেখুন'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center gap-2 text-xs text-blue-200/80 font-medium">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>বিকাশ ও নগদে ১০০% নিরাপদ ও ইনস্ট্যান্ট পেমেন্ট</span>
              </div>
            </div>

            {/* Trust Highlights Strip */}
            <div className="pt-6 border-t border-blue-950/80 grid grid-cols-3 gap-3 sm:gap-6 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <p className="text-xl sm:text-2xl font-black text-white">১২,০০০+</p>
                <p className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5">সন্তুষ্ট শিক্ষার্থী</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-xl sm:text-2xl font-black bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">৯৮%</p>
                <p className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5">পজিটিভ রিভিউ</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-xl sm:text-2xl font-black text-blue-400">২৪/৭</p>
                <p className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5">সরাসরি মেন্টর সাপোর্ট</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative Frame */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-blue-900/50 bg-[#060d1f] aspect-4/3 group">
                <img
                  src={hero.heroImage || 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80'}
                  alt="Bangladeshi Learning Platform"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-transparent to-transparent" />

                {/* Floating Payment Badges overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#020617]/90 backdrop-blur-md p-3 rounded-xl border border-blue-900/70 flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">ইনস্ট্যান্ট বিকাশ ও নগদ এক্সেস</p>
                      <p className="text-[10px] text-slate-400">অটোমেটিক রসিদ ও লাইফটাইম কোর্স এক্সেস</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                    <span className="text-[10px] font-bold text-blue-400">LIVE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
