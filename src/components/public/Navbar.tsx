import React, { useState } from 'react';
import { Menu, X, FileText, MessageSquare, Shield, GraduationCap } from 'lucide-react';
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
    <header className="sticky top-0 z-40 bg-[#020617]/90 backdrop-blur-md border-b border-blue-950/70 shadow-lg shadow-black/40">
      {/* Top Notification Strip with Blue & Black Gradient */}
      {hero.offerText && (
        <div className="bg-linear-to-r from-black via-blue-950 to-black text-slate-200 text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 border-b border-blue-900/30">
          <span>{hero.offerText}</span>
          <button
            onClick={onNavigateToOffers}
            className="underline text-blue-400 hover:text-blue-300 ml-1 font-semibold cursor-pointer transition-colors"
          >
            অফার দেখুন &rarr;
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo with Blue Gradient */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform border border-blue-400/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-extrabold text-white tracking-tight block leading-tight">
                Projukti<span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Shikha</span>{' '}
                <span className="text-[10px] bg-blue-950/90 text-blue-300 font-bold px-1.5 py-0.5 rounded border border-blue-800/40 ml-0.5">
                  BD
                </span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium tracking-wide">
                প্রযুক্তিশিক্ষা লার্নিং প্ল্যাটফর্ম
              </span>
            </div>
          </a>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-300">
          <button
            onClick={onNavigateToCourses}
            className="hover:text-blue-400 transition-colors cursor-pointer"
          >
            কোর্সসমূহ (Courses)
          </button>
          <button
            onClick={onNavigateToOffers}
            className="hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            বিশেষ অফার (Offers)
          </button>
          <button
            onClick={onOpenOrderTracker}
            className="hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer text-slate-300"
          >
            <FileText className="w-4 h-4 text-blue-400" />
            <span>অর্ডার ও রসিদ যাচাই</span>
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-blue-950/40 hover:bg-blue-900/50 text-blue-300 rounded-xl text-xs font-bold flex items-center gap-2 border border-blue-800/50 transition-all cursor-pointer shadow-xs"
          >
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <span>WhatsApp সাপোর্ট</span>
          </a>

          <button
            onClick={onNavigateToCourses}
            className="px-4 py-2 bg-linear-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer border border-blue-400/20"
          >
            কোর্স এনরোল করুন
          </button>

          <button
            onClick={onOpenAdmin}
            title="এডমিন প্যানেল"
            className="p-2 text-slate-400 hover:text-blue-300 hover:bg-blue-950/40 rounded-xl transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold border border-transparent hover:border-blue-900/50"
          >
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="hidden xl:inline">এডমিন</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenAdmin}
            className="p-2 text-slate-300 hover:text-blue-400 rounded-lg"
            title="এডমিন লগইন"
          >
            <Shield className="w-5 h-5 text-blue-400" />
          </button>
          <button
            onClick={onOpenOrderTracker}
            className="p-2 text-slate-300 hover:text-blue-400 rounded-lg"
            title="অর্ডার ট্র্যাকিং"
          >
            <FileText className="w-5 h-5 text-blue-400" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white rounded-lg cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#030712] border-b border-blue-950/80 px-4 pt-3 pb-5 space-y-3 shadow-xl">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigateToCourses();
            }}
            className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-blue-950/40 text-sm font-semibold text-slate-200"
          >
            📚 সকল কোর্স ও প্রোডাক্টসমূহ
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigateToOffers();
            }}
            className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-blue-950/40 text-sm font-semibold text-blue-400 flex items-center gap-2"
          >
            🔥 স্পেশাল ডিসকাউন্ট অফার
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenOrderTracker();
            }}
            className="w-full text-left py-2.5 px-3 rounded-lg bg-blue-950/60 border border-blue-900/50 text-sm font-semibold text-blue-200 flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-blue-400" />
            <span>অর্ডার ট্র্যাকিং ও রসিদ ডাউনলোড</span>
          </button>

          <div className="pt-2 border-t border-blue-950 flex flex-col gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 text-center shadow-md shadow-blue-600/30"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp এ সরাসরি মেসেজ দিন</span>
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="text-center py-2 text-xs text-slate-400 hover:text-blue-300 flex items-center justify-center gap-1"
            >
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>এডমিন পোর্টাল অ্যাক্সেস</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
