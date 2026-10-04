import React, { useState } from 'react';
import { Menu, X, Search, FileText, Phone, MessageSquare, Shield, GraduationCap } from 'lucide-react';
import { HeroConfig } from '../../types/index.ts';

interface NavbarProps {
  hero: HeroConfig;
  onOpenOrderTracker: () => void;
  onNavigateToCourses: () => void;
  onNavigateToOffers: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  hero,
  onOpenOrderTracker,
  onNavigateToCourses,
  onNavigateToOffers,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const whatsappUrl = `https://wa.me/${hero.supportWhatsApp || '8801890000000'}?text=${encodeURIComponent(
    'হ্যালো! আমি ProjuktiShikha BD এর কোর্স সম্পর্কে জানতে আগ্রহী।'
  )}`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Notification Strip */}
      {hero.offerText && (
        <div className="bg-slate-900 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
          <span>{hero.offerText}</span>
          <button
            onClick={onNavigateToCourses}
            className="underline text-emerald-400 hover:text-emerald-300 ml-1 font-semibold cursor-pointer"
          >
            অফার দেখুন &rarr;
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-extrabold text-slate-900 tracking-tight block leading-tight">
                Projukti<span className="text-emerald-600">Shikha</span> <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded ml-0.5">BD</span>
              </span>
              <span className="text-[11px] text-slate-500 font-semibold tracking-wide">
                প্রযুক্তিশিক্ষা লার্নিং প্ল্যাটফর্ম
              </span>
            </div>
          </a>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
          <button
            onClick={onNavigateToCourses}
            className="hover:text-emerald-600 transition-colors cursor-pointer"
          >
            কোর্সসমূহ (Courses)
          </button>
          <button
            onClick={onNavigateToOffers}
            className="hover:text-emerald-600 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            বিশেষ অফার (Offers)
          </button>
          <button
            onClick={onOpenOrderTracker}
            className="hover:text-emerald-600 transition-colors flex items-center gap-1.5 cursor-pointer text-slate-700"
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>অর্ডার ও রসিদ যাচাই (Track Receipt)</span>
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-2 border border-emerald-200 transition-all cursor-pointer shadow-2xs"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp সাপোর্ট</span>
          </a>

          <button
            onClick={onNavigateToCourses}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            কোর্স এনরোল করুন
          </button>

          <button
            onClick={onOpenAdmin}
            title="এডমিন প্যানেল"
            className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
          >
            <Shield className="w-4 h-4 text-emerald-600" />
            <span className="hidden xl:inline">এডমিন</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenAdmin}
            className="p-2 text-slate-600 hover:text-emerald-600 rounded-lg"
            title="এডমিন লগইন"
          >
            <Shield className="w-5 h-5 text-emerald-600" />
          </button>
          <button
            onClick={onOpenOrderTracker}
            className="p-2 text-slate-600 hover:text-emerald-600 rounded-lg"
            title="অর্ডার ট্র্যাকিং"
          >
            <FileText className="w-5 h-5 text-emerald-600" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-slate-900 rounded-lg cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-3 shadow-lg">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigateToCourses();
            }}
            className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-50 text-sm font-semibold text-slate-700"
          >
            📚 সকল কোর্স ও প্রোডাক্টসমূহ
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigateToOffers();
            }}
            className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-50 text-sm font-semibold text-emerald-600 flex items-center gap-2"
          >
            🔥 স্পেশাল ডিসকাউন্ট অফার
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenOrderTracker();
            }}
            className="w-full text-left py-2.5 px-3 rounded-lg bg-emerald-50 text-sm font-semibold text-emerald-800 flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>অর্ডার ট্র্যাকিং ও রসিদ ডাউনলোড</span>
          </button>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 text-center"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp এ সরাসরি মেসেজ দিন</span>
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="text-center py-2 text-xs text-slate-400 hover:text-slate-600 flex items-center justify-center gap-1"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>এডমিন পোর্টাল অ্যাক্সেস</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
