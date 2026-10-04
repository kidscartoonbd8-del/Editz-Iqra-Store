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
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900">এডমিন সিকিউরিটি ও পাসওয়ার্ড</h2>
        <p className="text-xs text-slate-500">
          আপনার অ্যাডমিন লগইন ইমেইল এবং সিক্রেট পাসওয়ার্ড পরিবর্তন করুন
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

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            অ্যাডমিন লগইন ইমেইল
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            বর্তমান পাসওয়ার্ড (Current Password) *
          </label>
          <div className="relative">
            <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="বর্তমান পাসওয়ার্ড দিন"
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              নতুন পাসওয়ার্ড (ঐচ্ছিক)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="কমপক্ষে ৬ অক্ষর"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              নতুন পাসওয়ার্ড নিশ্চিত করুন
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="আবার লিখুন"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500">
          <p className="font-semibold text-slate-700">সিকিউরিটি গ্যারান্টি:</p>
          <p>
            সার্ভারে পাসওয়ার্ড কখনো প্লেইন টেক্সট হিসেবে সংরক্ষিত থাকে না। এটি ক্রিপ্টোগ্রাফিক PBKDF2 সল্ট সহ হ্যাশ করে রাখা হয় এবং সকল এডমিন এপিআই রুট টোকেন দ্বারা সুরক্ষিত।
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
            <span>সিকিউরিটি আপডেট করুন</span>
          </button>
        </div>
      </form>
    </div>
  );
};
