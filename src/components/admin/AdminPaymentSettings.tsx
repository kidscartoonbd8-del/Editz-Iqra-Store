import React, { useState } from 'react';
import { PaymentSettings } from '../../types/index.ts';
import { ApiService } from '../../services/api.ts';
import { Save, Loader2, CheckCircle2, AlertCircle, Phone, FileText } from 'lucide-react';

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
      setSuccessMsg('পেমেন্ট সেটিংস সফলভাবে আপডেট হয়েছে! ওয়েবসাইটে পরিবর্তন লাইভ হয়েছে।');
      onRefresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'সেটিংস আপডেট ব্যর্থ হয়েছে।');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Title */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900">বাংলাদেশি পেমেন্ট গেটওয়ে সেটিংস</h2>
        <p className="text-xs text-slate-500">
          বিকাশ (bKash) ও নগদ (Nagad) এর পার্সোনাল/মার্চেন্ট নম্বর ও নির্দেশনাবলি কনফিগার করুন
        </p>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* bKash Settings Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#e2136e] text-white font-black text-xs flex items-center justify-center">
                bK
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">bKash (বিকাশ) কনফিগারেশন</h3>
                <p className="text-[11px] text-slate-400">গ্রাহকদের জন্য বিকাশ পেমেন্ট তথ্য</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={bkashEnabled}
                onChange={(e) => setBkashEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e2136e]"></div>
              <span className="ml-2 text-xs font-bold text-slate-700">
                {bkashEnabled ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয়'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                বিকাশ নম্বর (Payment / Send Money Number) *
              </label>
              <input
                type="text"
                required
                value={bkashNumber}
                onChange={(e) => setBkashNumber(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full px-3 py-2 text-sm font-mono font-bold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#e2136e] bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                অ্যাকাউন্টের ধরন
              </label>
              <select
                value={bkashType}
                onChange={(e) => setBkashType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#e2136e] bg-white"
              >
                <option value="personal">Personal (সেন্ড মানি করতে হবে)</option>
                <option value="merchant">Merchant (পেমেন্ট করতে হবে)</option>
                <option value="agent">Agent (ক্যাশ ইন)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              পেমেন্ট নির্দেশনাবলি (Payment Instructions for Customer)
            </label>
            <textarea
              rows={3}
              value={bkashInstructions}
              onChange={(e) => setBkashInstructions(e.target.value)}
              placeholder="ধাপ ১: বিকাশ অ্যাপে যান...\nধাপ ২: সেন্ড মানি করুন..."
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#e2136e] bg-white"
            />
          </div>
        </div>

        {/* Nagad Settings Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#f7941d] text-white font-black text-xs flex items-center justify-center">
                NG
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">Nagad (নগদ) কনফিগারেশন</h3>
                <p className="text-[11px] text-slate-400">গ্রাহকদের জন্য নগদ পেমেন্ট তথ্য</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={nagadEnabled}
                onChange={(e) => setNagadEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f7941d]"></div>
              <span className="ml-2 text-xs font-bold text-slate-700">
                {nagadEnabled ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয়'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                নগদ নম্বর (Payment / Send Money Number) *
              </label>
              <input
                type="text"
                required
                value={nagadNumber}
                onChange={(e) => setNagadNumber(e.target.value)}
                placeholder="018XXXXXXXX"
                className="w-full px-3 py-2 text-sm font-mono font-bold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#f7941d] bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                অ্যাকাউন্টের ধরন
              </label>
              <select
                value={nagadType}
                onChange={(e) => setNagadType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#f7941d] bg-white"
              >
                <option value="personal">Personal (সেন্ড মানি করতে হবে)</option>
                <option value="merchant">Merchant (পেমেন্ট করতে হবে)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              পেমেন্ট নির্দেশনাবলি (Payment Instructions for Customer)
            </label>
            <textarea
              rows={3}
              value={nagadInstructions}
              onChange={(e) => setNagadInstructions(e.target.value)}
              placeholder="ধাপ ১: নগদ অ্যাপে যান...\nধাপ ২: সেন্ড মানি করুন..."
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#f7941d] bg-white"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>সংরক্ষণ হচ্ছে...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>পেমেন্ট সেটিংস সেভ করুন</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
