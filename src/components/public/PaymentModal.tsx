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
  Hash
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base">পেমেন্ট ও অর্ডার কনফার্মেশন</h3>
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
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-2">
                পেমেন্ট তথ্য সফলভাবে গৃহীত হয়েছে
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                অভিনন্দন, {completedOrder.customerName}!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                আপনার অর্ডার আইডি <strong className="font-mono text-emerald-700 font-bold">{completedOrder.id}</strong>।
                অ্যাডমিন ভেরিফাই করলেই আপনার এক্সেস সক্রিয় হবে।
              </p>
            </div>

            {/* Order Brief Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">কোর্সের নাম:</span>
                <span className="font-bold text-slate-800 text-right truncate max-w-[200px]">{completedOrder.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">পরিশোধিত অর্থ:</span>
                <span className="font-bold text-emerald-600 font-mono text-sm">৳{completedOrder.amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">পেমেন্ট মেথড:</span>
                <span className="font-bold text-slate-800">{completedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction ID (TrxID):</span>
                <span className="font-bold font-mono text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {completedOrder.transactionId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">বর্তমান স্ট্যাটাস:</span>
                <span className="font-bold text-amber-600">Pending Verification</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => onSuccess(completedOrder)}
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Download / View Official Receipt</span>
              </button>
              <button
                onClick={onClose}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                সম্পন্ন
              </button>
            </div>
          </div>
        ) : (
          /* Payment Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Selected Product Summary */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={product.thumbnail}
                  alt=""
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">
                    {product.name}
                  </h4>
                  <p className="text-[11px] text-slate-500">{product.category}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">পরিশোধের পরিমাণ</span>
                <span className="text-lg font-black text-emerald-600">
                  ৳{product.currentPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Payment Method Selector (bKash & Nagad) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                পেমেন্ট মেথড নির্বাচন করুন
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* bKash Button */}
                <button
                  type="button"
                  onClick={() => setMethod('bKash')}
                  className={`p-3.5 rounded-2xl border-2 transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                    method === 'bKash'
                      ? 'border-[#e2136e] bg-[#e2136e]/5 text-[#e2136e] shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <div className="w-6 h-6 rounded-md bg-[#e2136e] text-white text-[10px] font-black flex items-center justify-center">
                    bK
                  </div>
                  <div className="text-left">
                    <span className="font-extrabold text-sm block leading-none">bKash</span>
                    <span className="text-[10px] text-slate-500 font-medium">বিকাশ সেন্ড মানি</span>
                  </div>
                </button>

                {/* Nagad Button */}
                <button
                  type="button"
                  onClick={() => setMethod('Nagad')}
                  className={`p-3.5 rounded-2xl border-2 transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                    method === 'Nagad'
                      ? 'border-[#f7941d] bg-[#f7941d]/5 text-[#f7941d] shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <div className="w-6 h-6 rounded-md bg-[#f7941d] text-white text-[10px] font-black flex items-center justify-center">
                    NG
                  </div>
                  <div className="text-left">
                    <span className="font-extrabold text-sm block leading-none">Nagad</span>
                    <span className="text-[10px] text-slate-500 font-medium">নগদ সেন্ড মানি</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Account Number & Step Instructions */}
            <div className={`p-4 rounded-2xl border ${
              method === 'bKash' ? 'bg-[#e2136e]/5 border-[#e2136e]/20' : 'bg-[#f7941d]/5 border-[#f7941d]/20'
            }`}>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {method} {activeConfig?.type === 'merchant' ? 'মার্চেন্ট নম্বর' : 'পার্সোনাল নম্বর'}:
                  </span>
                  <p className="text-lg font-mono font-black text-slate-900 tracking-wide mt-0.5">
                    {activeConfig?.number || '01712-345678'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'কপি হয়েছে!' : 'নম্বর কপি'}</span>
                </button>
              </div>

              {/* Instructions */}
              <div className="mt-3 pt-3 border-t border-slate-200/60 text-xs text-slate-600 whitespace-pre-line leading-relaxed">
                {activeConfig?.instructions ||
                  `১. আপনার ${method} অ্যাপে যান অথবা ডায়াল করুন।\n২. Send Money নির্বাচন করে উপরের নম্বরে ৳${product.currentPrice} পাঠান।\n৩. পেমেন্টের পর পাওয়া Transaction ID নিচে দিন।`}
              </div>
            </div>

            {/* Customer Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  আপনার নাম (Full Name) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="যেমন: তানভীর আহমেদ"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    মোবাইল নম্বর (Phone) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ইমেইল (Email - ঐচ্ছিক)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
                  <span>Transaction ID (TrxID) *</span>
                  <span className="text-[10px] text-slate-400 font-normal">মেসেজে প্রাপ্ত ৮-১০ ডিজিটের কোড</span>
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="যেমন: 9A7X3B21KZ"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm uppercase font-mono font-bold rounded-xl border-2 border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>তথ্য যাচাই ও সাবমিট হচ্ছে...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>পেমেন্ট তথ্য সাবমিট করুন (Confirm Order)</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
