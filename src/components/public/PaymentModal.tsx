import React, { useState } from 'react';
import { Product, PaymentSettings, Order } from '../../types/index.ts';
import { ApiService } from '../../services/api.ts';
import {
  X,
  Copy,
  Check,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileText,
  ShieldCheck,
  Phone,
  User,
  Mail,
  Hash,
  Sparkles
} from 'lucide-react';

interface PaymentModalProps {
  product: Product;
  paymentSettings: PaymentSettings;
  onClose: () => void;
  onSuccess: (order: Order) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  product,
  paymentSettings,
  onClose,
  onSuccess
}) => {
  const [method, setMethod] = useState<'bKash' | 'Nagad'>('bKash');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const activeConfig = method === 'bKash' ? paymentSettings.bkash : paymentSettings.nagad;

  const handleCopyNumber = () => {
    if (!activeConfig?.number) return;
    navigator.clipboard.writeText(activeConfig.number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!customerName.trim()) {
      setError('অনুগ্রহ করে আপনার পুরো নাম লিখুন।');
      return;
    }
    const cleanPhone = customerPhone.trim().replace(/[- ]/g, '');
    if (!cleanPhone || cleanPhone.length < 11) {
      setError('অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)।');
      return;
    }
    if (!transactionId.trim()) {
      setError('পেমেন্ট সফল হওয়ার পর প্রাপ্ত Transaction ID (TrxID) টি লিখুন।');
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await ApiService.submitOrder({
        productId: product.id,
        customerName: customerName.trim(),
        customerPhone: cleanPhone,
        customerEmail: customerEmail.trim() || undefined,
        paymentMethod: method,
        transactionId: transactionId.trim().toUpperCase()
      });

      setCompletedOrder(order);
      onSuccess(order);
    } catch (err: any) {
      console.error('Failed to submit order:', err);
      setError(err.message || 'পেমেন্ট তথ্য সাবমিট করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-linear-to-b from-[#020617] via-[#050f28] to-[#020617] text-white rounded-3xl shadow-2xl border border-blue-900/60 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Header */}
        <div className="bg-linear-to-r from-black via-blue-950 to-black text-white px-6 py-4 flex items-center justify-between border-b border-blue-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">পেমেন্ট ও কোর্স এনরোলমেন্ট</h3>
              <p className="text-[10px] text-blue-300">১০০% ভেরিফাইড ও নিরাপদ গেটওয়ে</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {completedOrder ? (
          /* Success Screen */
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/20 text-cyan-300 border border-blue-500/30 flex items-center justify-center mx-auto shadow-lg shadow-blue-600/30 animate-bounce">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-blue-950/80 text-cyan-300 text-xs font-bold border border-blue-800/50 mb-2">
                পেমেন্ট তথ্য সফলভাবে গৃহীত হয়েছে
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                অভিনন্দন, {completedOrder.customerName}!
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
                আপনার অর্ডার আইডি <strong className="font-mono text-cyan-300 font-bold">{completedOrder.id}</strong>।
                অ্যাডমিন ভেরিফাই করলেই আপনার এক্সেস সক্রিয় হবে এবং রসিদ ডাউনলোড করতে পারবেন।
              </p>
            </div>

            {/* Order Brief Box */}
            <div className="bg-[#02050f] border border-blue-950 rounded-2xl p-4 text-xs text-left space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-400">কোর্সের নাম:</span>
                <span className="font-bold text-slate-200 text-right truncate max-w-[200px]">{completedOrder.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">পরিশোধিত অর্থ:</span>
                <span className="font-bold text-cyan-300 font-mono text-sm">৳{completedOrder.amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">পেমেন্ট মেথড:</span>
                <span className="font-bold text-white">{completedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Transaction ID:</span>
                <span className="font-mono bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/50 text-cyan-300 font-bold">{completedOrder.transactionId}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  onClose();
                  onSuccess(completedOrder);
                }}
                className="flex-1 py-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-blue-400/20"
              >
                <FileText className="w-4 h-4" />
                <span>ভেরিফাইড রসিদ দেখুন ও প্রিন্ট করুন</span>
              </button>
            </div>
          </div>
        ) : (
          /* Payment Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">
            {/* Product Summary Header */}
            <div className="bg-[#02050f] border border-blue-900/60 rounded-2xl p-4 flex items-center justify-between">
              <div className="min-w-0 pr-3">
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block">
                  নির্বাচিত কোর্স
                </span>
                <h4 className="font-bold text-sm text-white truncate">{product.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">লাইফটাইম এক্সেস + সার্টিফিকেট</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs text-slate-400 block">কোর্স ফি</span>
                <span className="text-xl font-black text-cyan-300 font-mono">
                  ৳{product.currentPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Payment Method Switcher */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                পেমেন্ট মেথড সিলেক্ট করুন (Payment Method)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMethod('bKash')}
                  className={`p-3 rounded-2xl border-2 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    method === 'bKash'
                      ? 'border-[#e2136e] bg-[#e2136e]/15 text-white shadow-md'
                      : 'border-blue-950 bg-[#02050f] text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-[#e2136e]" />
                  <span className="font-extrabold text-sm">bKash (বিকাশ)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('Nagad')}
                  className={`p-3 rounded-2xl border-2 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    method === 'Nagad'
                      ? 'border-[#f7941d] bg-[#f7941d]/15 text-white shadow-md'
                      : 'border-blue-950 bg-[#02050f] text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-[#f7941d]" />
                  <span className="font-extrabold text-sm">Nagad (নগদ)</span>
                </button>
              </div>
            </div>

            {/* Account Details Box */}
            <div className="bg-linear-to-r from-[#020617] via-[#051131] to-[#020617] border border-blue-900/60 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    {method} নম্বর ({activeConfig?.type === 'personal' ? 'Personal / সেন্ড মানি' : 'Merchant / পেমেন্ট'})
                  </span>
                  <p className="text-xl font-black font-mono tracking-wider text-white mt-0.5">
                    {activeConfig?.number || '01712-345678'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-blue-600/30 border border-blue-400/30"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-cyan-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'কপি হয়েছে!' : 'নম্বর কপি'}</span>
                </button>
              </div>

              {/* Instructions */}
              <div className="pt-2 border-t border-blue-950 text-xs text-slate-300 leading-relaxed space-y-1">
                <p className="font-bold text-cyan-300">কীভাবে পেমেন্ট করবেন:</p>
                <p className="whitespace-pre-line text-[11px] text-slate-300">
                  {activeConfig?.instructions ||
                    `১. আপনার ${method} অ্যাপে গিয়ে "Send Money" নির্বাচন করুন।\n২. উপরের নম্বরে ৳${product.currentPrice} সেন্ড মানি করুন।\n৩. সফল পেমেন্টের পর প্রাপ্ত Transaction ID (TrxID) নিচে লিখে সাবমিট করুন।`}
                </p>
              </div>
            </div>

            {/* Input Form Fields */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  আপনার পুরো নাম (Student Full Name) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="যেমন: তানভীর আহমেদ"
                    className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#02050f] text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  মোবাইল নম্বর (বিকাশ/নগদ নম্বর) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#02050f] text-white placeholder-slate-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  ইমেইল ঠিকানা (ঐচ্ছিক - রসিদ ও এক্সেস পাওয়ার জন্য)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#02050f] text-white placeholder-slate-500 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Transaction ID (TrxID) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                    placeholder="যেমন: 9A7X3B21KZ"
                    className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#02050f] text-white font-mono tracking-wider placeholder-slate-500 uppercase"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  পেমেন্ট মেসেজ থেকে ৮-১০ অক্ষরের TrxID কপি করে এখানে পেস্ট করুন।
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-linear-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 border border-blue-400/30"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>অর্ডার ভেরিফিকেশনে পাঠানো হচ্ছে...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-cyan-300" />
                  <span>পেমেন্ট কনফার্ম করুন (৳{product.currentPrice.toLocaleString('en-IN')})</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
