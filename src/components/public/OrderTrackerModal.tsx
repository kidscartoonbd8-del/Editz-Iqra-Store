import React, { useState } from 'react';
import { Order } from '../../types/index.ts';
import { ApiService } from '../../services/api.ts';
import { X, Search, FileText, Loader2, AlertCircle, CheckCircle2, Clock, XCircle } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base">অর্ডার ট্র্যাক ও রসিদ যাচাই</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-xs text-slate-500">
            অর্ডার করার পর প্রাপ্ত ৬ সংখ্যার Order ID (যেমন: <strong className="font-mono text-slate-700">BD-849201</strong>) দিয়ে আপনার পেমেন্টের বর্তমান স্ট্যাটাস ও ভেরিফাইড রসিদ চেক করুন।
          </p>

          <form onSubmit={handleTrack} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Order ID লিখুন (BD-XXXXXX)"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm uppercase font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>খুঁজুন</span>}
            </button>
          </form>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {foundOrder && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-slate-700">
                  {foundOrder.id}
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  foundOrder.status === 'Payment Verified' || foundOrder.status === 'Completed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : foundOrder.status === 'Payment Rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {foundOrder.status}
                </span>
              </div>

              <div>
                <p className="font-bold text-slate-800 text-xs">{foundOrder.productName}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  গ্রাহক: {foundOrder.customerName} ({foundOrder.customerPhone})
                </p>
                <p className="text-[11px] text-slate-500">
                  পরিশোধ: ৳{foundOrder.amount.toLocaleString('en-IN')} via {foundOrder.paymentMethod} (TrxID: {foundOrder.transactionId})
                </p>
              </div>

              <button
                onClick={() => onViewReceipt(foundOrder)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>অফিসিয়াল রসিদ দেখুন / ডাউনলোড করুন</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
