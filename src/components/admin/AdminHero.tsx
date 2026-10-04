import React, { useState } from 'react';
import { HeroConfig } from '../../types/index.ts';
import { ApiService } from '../../services/api.ts';
import { ImageUploader } from '../common/ImageUploader.tsx';
import { Save, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface AdminHeroProps {
  hero: HeroConfig;
  onRefresh: () => void;
}

export const AdminHero: React.FC<AdminHeroProps> = ({ hero, onRefresh }) => {
  const [heading, setHeading] = useState(hero.heading);
  const [subtitle, setSubtitle] = useState(hero.subtitle);
  const [buttonText, setButtonText] = useState(hero.buttonText);
  const [buttonLink, setButtonLink] = useState(hero.buttonLink || '#products-section');
  const [heroImage, setHeroImage] = useState(hero.heroImage);
  const [offerText, setOfferText] = useState(hero.offerText);
  const [badgeText, setBadgeText] = useState(hero.badgeText);
  const [isVisible, setIsVisible] = useState(hero.isVisible ?? true);
  const [supportPhone, setSupportPhone] = useState(hero.supportPhone || '');
  const [supportWhatsApp, setSupportWhatsApp] = useState(hero.supportWhatsApp || '');

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      await ApiService.adminUpdateHero({
        heading: heading.trim(),
        subtitle: subtitle.trim(),
        buttonText: buttonText.trim(),
        buttonLink: buttonLink.trim(),
        heroImage,
        offerText: offerText.trim(),
        badgeText: badgeText.trim(),
        isVisible,
        supportPhone: supportPhone.trim(),
        supportWhatsApp: supportWhatsApp.trim()
      });
      setSuccessMsg('হিরো সেকশন সফলভাবে আপডেট হয়েছে! ওয়েবসাইটে পরিবর্তন লাইভ হয়েছে।');
      onRefresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'আপডেট করতে ব্যর্থ হয়েছে।');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Title */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">হিরো সেকশন সেটিংস</h2>
          <p className="text-xs text-slate-500">
            ওয়েবসাইটের প্রধান ব্যানার, হেডলাইন, বাটন ও বিজ্ঞাপনের লেখা সম্পূর্ণ নিয়ন্ত্রণ করুন
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
            isVisible ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
          }`}
        >
          {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>{isVisible ? 'সেকশন দৃশ্যমান (Visible)' : 'সেকশন লুকায়িত (Hidden)'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        {/* Hero Image upload */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <ImageUploader
            label="হিরো ব্যানার ইমেজ (Hero Image Upload)"
            value={heroImage}
            onChange={setHeroImage}
            aspectRatio="banner"
            hint="সরাসরি ফোন বা কম্পিউটার থেকে আধুনিক ব্যানার ছবি আপলোড করুন"
          />
        </div>

        {/* Badge & Offer Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              টপ ব্যাজ টেক্সট (Badge Text)
            </label>
            <input
              type="text"
              value={badgeText}
              onChange={(e) => setBadgeText(e.target.value)}
              placeholder="যেমন: 🇧🇩 বাংলাদেশের বিশ্বস্ত অনলাইন লার্নিং প্ল্যাটফর্ম"
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              টপ অফার স্ট্রিপ লেখা (Top Notification Offer Text)
            </label>
            <input
              type="text"
              value={offerText}
              onChange={(e) => setOfferText(e.target.value)}
              placeholder="যেমন: 🎁 সীমিত সময়ের অফার: সকল কোর্সে ৫০% পর্যন্ত ছাড়!"
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>
        </div>

        {/* Main Heading */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            মূল শিরোনাম (Hero Main Heading) *
          </label>
          <textarea
            rows={2}
            required
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            className="w-full px-3 py-2 text-sm sm:text-base font-bold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            উপ-শিরোনাম / বিবরণ (Subtitle / Description)
          </label>
          <textarea
            rows={3}
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          />
        </div>

        {/* CTA Button Text & Action */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              বাটন টেক্সট (Button Text)
            </label>
            <input
              type="text"
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              placeholder="যেমন: কোর্সগুলো এক্সপ্লোর করুন"
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              বাটন লিঙ্ক / অ্যাকশন (Button Link/Anchor)
            </label>
            <input
              type="text"
              value={buttonLink}
              onChange={(e) => setButtonLink(e.target.value)}
              placeholder="#products-section"
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>
        </div>

        {/* Support Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              হেল্পলাইন মোবাইল নম্বর
            </label>
            <input
              type="text"
              value={supportPhone}
              onChange={(e) => setSupportPhone(e.target.value)}
              placeholder="01890-000000"
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              হোয়াটসঅ্যাপ নম্বর (কান্ট্রি কোড সহ)
            </label>
            <input
              type="text"
              value={supportWhatsApp}
              onChange={(e) => setSupportWhatsApp(e.target.value)}
              placeholder="8801890000000"
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-mono"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>সংরক্ষণ হচ্ছে...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>হিরো সেটিংস সেভ করুন</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
