import React, { useState } from 'react';
import { HeroConfig } from '../../types/index.ts';
import { ApiService } from '../../services/api.ts';
import { ImageUploader } from '../common/ImageUploader.tsx';
import { Save, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff, Sliders } from 'lucide-react';

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
    <div className="max-w-4xl space-y-6 text-slate-100 font-sans">
      {/* Title */}
      <div className="bg-linear-to-r from-black via-blue-950 to-black p-5 sm:p-6 rounded-3xl border border-blue-900/60 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-600/20 text-cyan-300 border border-blue-500/30">
              <Sliders className="w-5 h-5" />
            </span>
            <span>হিরো সেকশন সেটিংস</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            ওয়েবসাইটের প্রধান ব্যানার, হেডলাইন, বাটন ও বিজ্ঞাপনের লেখা সম্পূর্ণ নিয়ন্ত্রণ করুন
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
            isVisible
              ? 'bg-blue-600/20 text-cyan-300 border-blue-500/30'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
        >
          {isVisible ? <Eye className="w-4 h-4 text-cyan-400" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
          <span>{isVisible ? 'সেকশন দৃশ্যমান (Visible)' : 'সেকশন লুকায়িত (Hidden)'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-blue-950/80 border border-blue-500/50 rounded-2xl text-xs text-cyan-300 flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-cyan-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-950/80 border border-red-800 rounded-2xl text-xs text-red-300 flex items-center gap-2 shadow-lg">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-linear-to-b from-[#020617] via-[#040e29] to-[#020617] p-6 sm:p-8 rounded-3xl border border-blue-900/60 shadow-xl space-y-5">
        {/* Hero Image upload */}
        <div className="bg-[#02050f] p-4 rounded-2xl border border-blue-950">
          <ImageUploader
            label="হিরো ব্যানার ইমেজ (Hero Image Upload)"
            value={heroImage}
            onChange={setHeroImage}
            aspectRatio="banner"
            hint="সরাসরি ফোন বা কম্পিউটার থেকে যেকোনো সাইজের ব্যানার ছবি আপলোড করুন"
          />
        </div>

        {/* Badge & Offer Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              টপ ব্যাজ টেক্সট (Badge Text)
            </label>
            <input
              type="text"
              value={badgeText}
              onChange={(e) => setBadgeText(e.target.value)}
              placeholder="যেমন: 🇧🇩 বাংলাদেশের বিশ্বস্ত অনলাইন লার্নিং প্ল্যাটফর্ম"
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#02050f] text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              অফার ঘোষণা স্ট্রিপ (Top Offer Strip)
            </label>
            <input
              type="text"
              value={offerText}
              onChange={(e) => setOfferText(e.target.value)}
              placeholder="যেমন: 🎁 সীমিত সময়ের অফার: সকল কোর্সে ৫০% পর্যন্ত ছাড়!"
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#02050f] text-white"
            />
          </div>
        </div>

        {/* Heading */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">
            প্রধান শিরোনাম (Hero Heading)
          </label>
          <input
            type="text"
            required
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            placeholder="দক্ষতা অর্জন করুন, ফ্রিল্যান্সিং ও স্মার্ট ক্যারিয়ারে এগিয়ে থাকুন"
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#02050f] text-white font-medium"
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">
            উপ-শিরোনাম / বিবরণ (Subtitle)
          </label>
          <textarea
            rows={3}
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="বাংলাদেশের শীর্ষ মেন্টরদের সাথে সরাসরি প্রজেক্টভিত্তিক লার্নিং..."
            className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#02050f] text-white"
          />
        </div>

        {/* Button Text & Link */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              কল-টু-অ্যাকশন বাটন লেখা (CTA Button Text)
            </label>
            <input
              type="text"
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              placeholder="কোর্সগুলো এক্সপ্লোর করুন"
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#02050f] text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              বাটন লিঙ্ক (Button Link)
            </label>
            <input
              type="text"
              value={buttonLink}
              onChange={(e) => setButtonLink(e.target.value)}
              placeholder="#products-section"
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#02050f] text-white font-mono"
            />
          </div>
        </div>

        {/* Support Phone & WhatsApp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-blue-950">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              হেল্পলাইন ফোন নম্বর (Support Phone)
            </label>
            <input
              type="text"
              value={supportPhone}
              onChange={(e) => setSupportPhone(e.target.value)}
              placeholder="01890-000000"
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#02050f] text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              হোয়াটসঅ্যাপ নম্বর (WhatsApp Number with country code)
            </label>
            <input
              type="text"
              value={supportWhatsApp}
              onChange={(e) => setSupportWhatsApp(e.target.value)}
              placeholder="8801890000000"
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#02050f] text-white font-mono"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-blue-950 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-linear-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer disabled:opacity-50 border border-blue-400/30"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>সংরক্ষণ হচ্ছে...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>পরিবর্তন সংরক্ষণ করুন</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
