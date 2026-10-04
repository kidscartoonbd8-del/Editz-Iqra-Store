import React from 'react';
import { HeroConfig } from '../../types/index.ts';
import { Lock, Phone, Mail, MapPin, MessageSquare, ShieldCheck, GraduationCap, Heart } from 'lucide-react';

interface FooterProps {
  hero: HeroConfig;
  onOpenAdmin: () => void;
  onNavigateToCourses: () => void;
  onOpenTracker: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  hero,
  onOpenAdmin,
  onNavigateToCourses,
  onOpenTracker
}) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-base font-extrabold text-white tracking-tight">
                Projukti<span className="text-emerald-500">Shikha</span> BD
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              বাংলাদেশের শিক্ষার্থীদের জন্য আধুনিক আইটি ও স্কিল ডেভেলপমেন্ট প্ল্যাটফর্ম। বাস্তব প্রজেক্ট ও লাইফটাইম মেন্টরশিপ।
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>১০০% নিরাপদ পেমেন্ট ও ভেরিফাইড সনদ</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">দ্রুত লিঙ্ক</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onNavigateToCourses} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  সকল কোর্স ও প্রোডাক্ট
                </button>
              </li>
              <li>
                <button onClick={onOpenTracker} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  অর্ডার ও পেমেন্ট রসিদ ট্র্যাকিং
                </button>
              </li>
              <li>
                <a href="#offers-section" className="hover:text-emerald-400 transition-colors">
                  বিশেষ স্কলারশিপ অফার
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Payment Partners in BD */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">পেমেন্ট মেথড</h4>
            <p className="text-[11px] text-slate-400 mb-3">
              আমাদের সকল কোর্সে বিকাশ এবং নগদ এর মাধ্যমে সরাসরি পেমেন্ট সুবিধা রয়েছে।
            </p>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-lg bg-[#e2136e] text-white font-black text-xs">
                bKash
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-[#f7941d] text-white font-black text-xs">
                Nagad
              </div>
            </div>
          </div>

          {/* Col 4: Contact & Help */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">সাপোর্ট ও যোগাযোগ</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>হেল্পলাইন: {hero.supportPhone || '01890-000000'}</span>
              </li>
              <li className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>হোয়াটসঅ্যাপ: {hero.supportWhatsApp || '8801890000000'}</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>ঢাকা, বাংলাদেশ</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Discreet Admin Link */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ProjuktiShikha BD. সর্বস্বত্ব সংরক্ষিত।</p>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" /> for Bangladesh
            </span>

            {/* Discreet Admin Portal Button */}
            <button
              onClick={onOpenAdmin}
              className="text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-1 p-1 rounded-md"
              title="Admin Portal"
            >
              <Lock className="w-3 h-3" />
              <span className="text-[10px]">Admin</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
