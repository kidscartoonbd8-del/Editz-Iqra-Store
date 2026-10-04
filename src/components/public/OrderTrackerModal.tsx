import React, { useState } from 'react';
import { Order } from '../../types/index.ts';
import { ApiService } from '../../services/api.ts';
import { X, Search, FileText, Loader2, AlertCircle, CheckCircle2, Clock, XCircle, Printer } from 'lucide-react';

interface OrderTrackerModalProps {
  onClose: () => void;
  onViewReceipt: (order: Order) => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  onClose,
  onViewReceipt
}) => {
  const [orderId, setOrderId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setError(null);
    setIsLoading(true);
    setFoundOrder(null);

    try {
      const order = await ApiService.fetchOrderById(orderId.trim());
      setFoundOrder(order);
    } catch (err: any) {
      setError(err.message || 'অর্ডারটি পাওয়া যায়নি। সঠিক Order ID প্রদান করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-md bg-linear-to-b from-[#020617] via-[#050f28] to-[#020617] text-white rounded-3xl shadow-2xl border border-blue-900/60 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-linear-to-r from-black via-blue-950 to-black text-white px-6 py-4 flex items-center justify-between border-b border-blue-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">অর্ডার ট্র্যাক ও রসিদ যাচাই</h3>
              <p className="text-[10px] text-blue-300">ইনস্ট্যান্ট স্ট্যাটাস ও প্রিন্ট</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          <p className="text-slate-300">
            অর্ডার করার পর প্রাপ্ত Order ID (যেমন: <strong className="font-mono text-cyan-300">BD-849201</strong>) দিয়ে আপনার পেমেন্টের বর্তমান স্ট্যাটাস ও ভেরিফাইড রসিদ চেক করুন।
          </p>

          <form onSubmit={handleTrack} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                placeholder="যেমন: BD-849201"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#02050f] text-white font-mono uppercase tracking-wider placeholder-slate-500 text-xs sm:text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-md shadow-blue-600/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-blue-400/30"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>খুঁজুন</span>}
            </button>
          </form>

          {error && (
            <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {foundOrder && (
            <div className="bg-[#02050f] border border-blue-900/60 rounded-2xl p-4 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-blue-950 pb-2.5">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">অর্ডার আইডি</span>
                  <p className="font-mono font-bold text-cyan-300 text-sm">#{foundOrder.id}</p>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                    foundOrder.status === 'Payment Verified' || foundOrder.status === 'Completed'
                      ? 'bg-blue-600/20 text-cyan-300 border-blue-500/30'
                      : foundOrder.status === 'Pending'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-red-500/20 text-red-300 border-red-500/30'
                  }`}
                >
                  {foundOrder.status}
                </span>
              </div>

              <div className="space-y-1 text-slate-300 text-xs">
                <div>
                  <span className="text-slate-400">কোর্স: </span>
                  <strong className="text-white">{foundOrder.productName}</strong>
                </div>
                <div>
                  <span className="text-slate-400">টাকার পরিমাণ: </span>
                  <strong className="text-cyan-300 font-mono">৳{foundOrder.amount.toLocaleString('en-IN')}</strong>
                </div>
                <div>
                  <span className="text-slate-400">পেমেন্ট মেথড: </span>
                  <strong className="text-white">{foundOrder.paymentMethod}</strong> (Trx: {foundOrder.transactionId})
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onViewReceipt(foundOrder);
                  }}
                  className="w-full py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 transition-all cursor-pointer border border-blue-400/30"
                >
                  <Printer className="w-4 h-4" />
                  <span>অফিসিয়াল রসিদ দেখুন ও প্রিন্ট করুন</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
