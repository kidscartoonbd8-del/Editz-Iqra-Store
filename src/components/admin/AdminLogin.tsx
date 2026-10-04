import React, { useState } from 'react';
import { ApiService } from '../../services/api.ts';
import { Lock, Mail, Key, ShieldCheck, Loader2, AlertCircle, ArrowLeft, Sparkles, Check } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: () => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onBackToSite }) => {
  const [email, setEmail] = useState('iqrasahadath590@gmail.com');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [quickFilled, setQuickFilled] = useState(false);

  const handleQuickFill = () => {
    setEmail('iqrasahadath590@gmail.com');
    setPassword('@qwe৪*h');
    setQuickFilled(true);
    setTimeout(() => setQuickFilled(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('ইমেইল ও পাসওয়ার্ড উভয়ই প্রদান করুন।');
      return;
    }

    setIsLoading(true);
    try {
      await ApiService.adminLogin(email.trim(), password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'লগইন ব্যর্থ হয়েছে। সঠিক তথ্য দিয়ে চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#000000] via-[#040d24] to-[#000000] flex flex-col justify-center items-center p-4 relative font-sans text-slate-100">
      {/* Back button */}
      <button
        onClick={onBackToSite}
        className="absolute top-6 left-6 text-slate-400 hover:text-blue-400 flex items-center gap-2 text-xs font-semibold cursor-pointer transition-colors px-3 py-1.5 rounded-xl bg-blue-950/40 border border-blue-900/40"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>পাবলিক ওয়েবসাইটে ফিরে যান</span>
      </button>

      <div className="w-full max-w-md bg-linear-to-b from-[#020617] via-[#06122d] to-[#020617] border border-blue-900/60 rounded-3xl p-7 sm:p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-linear-to-tr from-blue-700 to-indigo-600 border border-blue-400/30 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-600/30">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            অ্যাডমিন সিকিউর পোর্টাল
          </h2>
          <p className="text-xs text-slate-400">
            ProjuktiShikha BD ম্যানেজমেন্ট ড্যাশবোর্ডে প্রবেশ করতে লগইন করুন
          </p>
        </div>

        {/* Quick Fill Helper Pill */}
        <div className="bg-blue-950/60 border border-blue-800/60 rounded-2xl p-3 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-blue-300 font-bold">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>নির্ধারিত অ্যাডমিন তথ্য:</span>
            </div>
            <button
              type="button"
              onClick={handleQuickFill}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
            >
              {quickFilled ? <Check className="w-3 h-3 text-white" /> : <Sparkles className="w-3 h-3 text-cyan-300" />}
              <span>{quickFilled ? 'পূরণ হয়েছে!' : 'অটো-পূরণ করুন'}</span>
            </button>
          </div>
          <div className="text-[11px] text-slate-300 font-mono space-y-0.5 bg-black/40 p-2 rounded-xl border border-blue-950">
            <div>Email: <strong className="text-cyan-300">iqrasahadath590@gmail.com</strong></div>
            <div>Password: <strong className="text-cyan-300">@qwe৪*h</strong></div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-950/60 border border-red-700/60 rounded-xl text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              অ্যাডমিন ইমেইল (Admin Email)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="iqrasahadath590@gmail.com"
                className="w-full pl-10 pr-3 py-2.5 bg-[#02050f] border border-blue-900/60 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-sans"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                পাসওয়ার্ড (Password)
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-blue-400 hover:text-blue-300"
              >
                {showPassword ? 'লুকান' : 'দেখান'}
              </button>
            </div>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 bg-[#02050f] border border-blue-900/60 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-sans"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-linear-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 border border-blue-400/30"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>যাচাই করা হচ্ছে...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>লগইন করুন</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-blue-950">
          <p className="text-[11px] text-slate-500">
            নিরাপত্তা নিশ্চিত করতে ১৫ মিনিট নিষ্ক্রিয় থাকলে স্বয়ংক্রিয়ভাবে লগআউট হবে।
          </p>
        </div>
      </div>
    </div>
  );
};
