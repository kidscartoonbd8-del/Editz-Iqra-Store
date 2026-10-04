import React, { useState } from 'react';
import { PaymentSettings } from '../../types/index.ts';
import { ApiService } from '../../services/api.ts';
import { Save, Loader2, CheckCircle2, AlertCircle, Phone, FileText, CreditCard } from 'lucide-react';

interface AdminPaymentSettingsProps {
  paymentSettings: PaymentSettings;
  onRefresh: () => void;
}

export const AdminPaymentSettings: React.FC<AdminPaymentSettingsProps> = ({
  paymentSettings,
  onRefresh
}) => {
  // bKash state
  const [bkashEnabled, setBkashEnabled] = useState(paymentSettings.bkash.enabled ?? true);
  const [bkashNumber, setBkashNumber] = useState(paymentSettings.bkash.number || '');
  const [bkashType, setBkashType] = useState<PaymentSettings['bkash']['type']>(paymentSettings.bkash.type || 'personal');
  const [bkashInstructions, setBkashInstructions] = useState(paymentSettings.bkash.instructions || '');

  // Nagad state
  const [nagadEnabled, setNagadEnabled] = useState(paymentSettings.nagad.enabled ?? true);
  const [nagadNumber, setNagadNumber] = useState(paymentSettings.nagad.number || '');
  const [nagadType, setNagadType] = useState<PaymentSettings['nagad']['type']>(paymentSettings.nagad.type || 'personal');
  const [nagadInstructions, setNagadInstructions] = useState(paymentSettings.nagad.instructions || '');

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      await ApiService.adminUpdatePaymentSettings({
        bkash: {
          enabled: bkashEnabled,
          number: bkashNumber.trim(),
          type: bkashType,
          instructions: bkashInstructions.trim()
        },
        nagad: {
          enabled: nagadEnabled,
          number: nagadNumber.trim(),
          type: nagadType,
          instructions: nagadInstructions.trim()
        }
      });
      setSuccessMsg('পেমেন্ট সেটিংস সফলভাবে আপডেট হয়েছে! গ্রাহকরা নতুন তথ্য দেখতে পাবেন।');
      onRefresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'সেটিংস আপডেট ব্যর্থ হয়েছে।');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6 text-slate-100 font-sans">
      {/* Title Header */}
      <div className="bg-linear-to-r from-black via-blue-950 to-black p-5 sm:p-6 rounded-3xl border border-blue-900/60 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-600/20 text-cyan-300 border border-blue-500/30">
              <CreditCard className="w-5 h-5" />
            </span>
            <span>পেমেন্ট গেটওয়ে ও অ্যাকাউন্ট সেটিংস</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            বিকাশ ও নগদ নম্বর, ব্যক্তিগত/মার্চেন্ট ধরন এবং পেমেন্ট নির্দেশিকা পরিচালনা করুন
          </p>
        </div>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* bKash Settings Card */}
        <div className="bg-linear-to-b from-[#020617] via-[#040e29] to-[#020617] p-6 sm:p-7 rounded-3xl border border-blue-900/60 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-blue-950 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#e2136e]/20 border border-[#e2136e]/40 flex items-center justify-center font-bold text-[#e2136e] text-sm">
                bKash
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">বিকাশ পেমেন্ট কনফিগারেশন</h3>
                <p className="text-xs text-slate-400">বিকাশ সেন্ড মানি বা মার্চেন্ট পেমেন্ট সেটিংস</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={bkashEnabled}
                onChange={(e) => setBkashEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e2136e]"></div>
              <span className="ml-2 text-xs font-bold text-slate-300">
                {bkashEnabled ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                বিকাশ অ্যাকাউন্ট নম্বর
              </label>
              <input
                type="text"
                required={bkashEnabled}
                value={bkashNumber}
                onChange={(e) => setBkashNumber(e.target.value)}
                placeholder="যেমন: 01712-345678"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#02050f] text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                অ্যাকাউন্ট টাইপ (Account Type)
              </label>
              <select
                value={bkashType}
                onChange={(e) => setBkashType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#02050f] text-white font-medium"
              >
                <option value="personal">Personal (সেন্ড মানি)</option>
                <option value="merchant">Merchant (পেমেন্ট)</option>
                <option value="agent">Agent (ক্যাশ ইন)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              বিকাশ পেমেন্ট নির্দেশিকা (Instructions for Student)
            </label>
            <textarea
              rows={4}
              value={bkashInstructions}
              onChange={(e) => setBkashInstructions(e.target.value)}
              placeholder="পেমেন্ট করার ধাপগুলো লিখুন..."
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#02050f] text-white"
            />
          </div>
        </div>

        {/* Nagad Settings Card */}
        <div className="bg-linear-to-b from-[#020617] via-[#040e29] to-[#020617] p-6 sm:p-7 rounded-3xl border border-blue-900/60 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-blue-950 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f7941d]/20 border border-[#f7941d]/40 flex items-center justify-center font-bold text-[#f7941d] text-sm">
                Nagad
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">নগদ পেমেন্ট কনফিগারেশন</h3>
                <p className="text-xs text-slate-400">নগদ সেন্ড মানি বা মার্চেন্ট পেমেন্ট সেটিংস</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={nagadEnabled}
                onChange={(e) => setNagadEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f7941d]"></div>
              <span className="ml-2 text-xs font-bold text-slate-300">
                {nagadEnabled ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                নগদ অ্যাকাউন্ট নম্বর
              </label>
              <input
                type="text"
                required={nagadEnabled}
                value={nagadNumber}
                onChange={(e) => setNagadNumber(e.target.value)}
                placeholder="যেমন: 01812-345678"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#02050f] text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                অ্যাকাউন্ট টাইপ (Account Type)
              </label>
              <select
                value={nagadType}
                onChange={(e) => setNagadType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#02050f] text-white font-medium"
              >
                <option value="personal">Personal (সেন্ড মানি)</option>
                <option value="merchant">Merchant (পেমেন্ট)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              নগদ পেমেন্ট নির্দেশিকা (Instructions for Student)
            </label>
            <textarea
              rows={4}
              value={nagadInstructions}
              onChange={(e) => setNagadInstructions(e.target.value)}
              placeholder="নগদ পেমেন্টের ধাপগুলো লিখুন..."
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#02050f] text-white"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
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
                <span>পেমেন্ট সেটিংস সংরক্ষণ করুন</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
