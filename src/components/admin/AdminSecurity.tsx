import React, { useState } from 'react';
import { ApiService } from '../../services/api.ts';
import { Shield, Key, Mail, CheckCircle2, AlertCircle, Loader2, Lock } from 'lucide-react';

interface AdminSecurityProps {
  currentEmail: string;
  onRefresh: () => void;
}

export const AdminSecurity: React.FC<AdminSecurityProps> = ({ currentEmail, onRefresh }) => {
  const [email, setEmail] = useState(currentEmail);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (!currentPassword) {
      setErrorMsg('বর্তমান পাসওয়ার্ড প্রদান করা আবশ্যক।');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setErrorMsg('নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setErrorMsg('নতুন পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মিলছে না।');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/credentials', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ApiService.getAdminToken()}`
        },
        body: JSON.stringify({
          email: email.trim(),
          currentPassword,
          newPassword: newPassword || undefined
        })
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'আপডেট করতে ব্যর্থ হয়েছে।');

      setSuccessMsg('এডমিন ক্রেডেনশিয়ালস সফলভাবে আপডেট করা হয়েছে!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onRefresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'ক্রেডেনশিয়ালস আপডেট করতে সমস্যা হয়েছে।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6 text-slate-100 font-sans">
      {/* Title */}
      <div className="bg-linear-to-r from-black via-blue-950 to-black p-5 sm:p-6 rounded-3xl border border-blue-900/60 shadow-xl">
        <h2 className="text-xl font-black text-white flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-blue-600/20 text-cyan-300 border border-blue-500/30">
            <Shield className="w-5 h-5" />
          </span>
          <span>এডমিন সিকিউরিটি ও পাসওয়ার্ড পরিবর্তন</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          অ্যাডমিন প্যানেলে লগইন করার ইমেইল ও পাসওয়ার্ড নিরাপদে পরিবর্তন ও আপডেট করুন
        </p>
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
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">
            অ্যাডমিন ইমেইল (Login Email)
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="iqrasahadath590@gmail.com"
              className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#02050f] text-white"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-blue-950">
          <label className="block text-xs font-bold text-slate-300 mb-1">
            বর্তমান পাসওয়ার্ড (Current Password) <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="বর্তমান পাসওয়ার্ড লিখুন (@qwe৪*h)"
              className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#02050f] text-white"
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            নিরাপত্তা নিশ্চিত করতে বর্তমান পাসওয়ার্ড ভেরিফাই করা হবে।
          </span>
        </div>

        <div className="pt-2 border-t border-blue-950 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              নতুন পাসওয়ার্ড (ঐচ্ছিক - পরিবর্তন করতে চাইলে লিখুন)
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="নতুন পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)"
                className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#02050f] text-white"
              />
            </div>
          </div>

          {newPassword && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                নতুন পাসওয়ার্ড নিশ্চিত করুন (Confirm Password)
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="নতুন পাসওয়ার্ডটি আবার লিখুন"
                  className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#02050f] text-white"
                />
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-blue-950 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-linear-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer disabled:opacity-50 border border-blue-400/30"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>আপডেট হচ্ছে...</span>
              </>
            ) : (
              <span>ক্রেডেনশিয়ালস সংরক্ষণ করুন</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
