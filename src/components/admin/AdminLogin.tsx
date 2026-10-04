import React, { useState } from 'react';
import { ApiService } from '../../services/api.ts';
import { Lock, Mail, Key, ShieldCheck, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: () => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onBackToSite }) => {
  const [email, setEmail] = useState('iqrasahadath590@gmail.com');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative">
      {/* Back button */}
      <button
        onClick={onBackToSite}
        className="absolute top-6 left-6 text-slate-400 hover:text-white flex items-center gap-2 text-xs font-semibold cursor-pointer transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>পাবলিক ওয়েবসাইটে ফিরে যান</span>
      </button>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            অ্যাডমিন সিকিউর পোর্টাল
          </h2>
          <p className="text-xs text-slate-400">
            ProjuktiShikha BD ম্যানেজমেন্ট ড্যাশবোর্ডে প্রবেশ করতে লগইন করুন
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-900/40 border border-red-700/60 rounded-xl text-xs text-red-300 flex items-center gap-2">
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
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@projuktishikha.com"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              সিক্রেট পাসওয়ার্ড (Password)
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-sans"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>নিরাপত্তা নোটিশ:</span>
            </div>
            <p>
              অপ্রয়োজনীয় সেশন অপব্যবহার রোধে ১৫ মিনিট নিষ্ক্রিয় থাকলে স্বয়ংক্রিয়ভাবে লগআউট হবে। পাসওয়ার্ড সার্ভারে ক্রিপ্টোগ্রাফিক সল্ট ও হ্যাশ আকারে সংরক্ষিত।
            </p>
            <p className="text-slate-500 pt-1">
              অ্যাডমিন ইমেইল: <span className="text-emerald-400 font-mono">iqrasahadath590@gmail.com</span> | পাসওয়ার্ড: <span className="text-emerald-400 font-mono">@qwe৪*h</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>যাচাই করা হচ্ছে...</span>
              </>
            ) : (
              <span>অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করুন</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
