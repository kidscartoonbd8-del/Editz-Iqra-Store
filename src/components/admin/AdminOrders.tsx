import React, { useState } from 'react';
import { Order } from '../../types/index.ts';
import { ApiService } from '../../services/api.ts';
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Loader2,
  AlertCircle,
  Check,
  X,
  Phone,
  Mail,
  User,
  Hash,
  Download,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';

interface AdminOrdersProps {
  orders: Order[];
  onRefresh: () => void;
  onViewReceipt: (order: Order) => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({
  orders,
  onRefresh,
  onViewReceipt
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | Order['status']>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [showRejectPrompt, setShowRejectPrompt] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredOrders = orders.filter(o => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      o.id.toLowerCase().includes(term) ||
      o.customerName.toLowerCase().includes(term) ||
      o.customerPhone.includes(term) ||
      o.transactionId.toLowerCase().includes(term) ||
      o.productName.toLowerCase().includes(term);

    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleUpdateStatus = async (orderId: string, status: Order['status'], note?: string) => {
    setIsUpdating(true);
    try {
      await ApiService.adminUpdateOrderStatus(orderId, status, note);
      onRefresh();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status, adminNote: note } : null);
      }
      setShowRejectPrompt(false);
      showToast(`অর্ডার #${orderId} এর স্ট্যাটাস সফলভাবে আপডেট হয়েছে!`);
    } catch (err: any) {
      showToast(`ত্রুটি: ${err.message || 'স্ট্যাটাস আপডেট ব্যর্থ হয়েছে।'}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-5 text-slate-100 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-blue-950 border border-blue-500/50 text-cyan-300 text-xs font-bold rounded-2xl flex items-center justify-between shadow-xl animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-cyan-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="p-1 hover:opacity-75">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="bg-linear-to-r from-black via-blue-950 to-black p-5 sm:p-6 rounded-3xl border border-blue-900/60 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-600/20 text-cyan-300 border border-blue-500/30">
              <ShoppingBag className="w-5 h-5" />
            </span>
            <span>অর্ডার ও পেমেন্ট ভেরিফিকেশন</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            বিকাশ ও নগদ লেনদেন ট্রানজাকশন আইডি (TrxID) যাচাই করুন ও রসিদ তৈরি করুন
          </p>
        </div>

        <div className="flex gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>পেন্ডিং: {orders.filter(o => o.status === 'Pending').length}</span>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-blue-600/20 text-cyan-300 text-xs font-bold border border-blue-500/30 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>ভেরিফাইড: {orders.filter(o => o.status === 'Payment Verified' || o.status === 'Completed').length}</span>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-linear-to-r from-[#020617] via-[#040e29] to-[#020617] p-4 rounded-2xl border border-blue-900/60 shadow-lg flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Order ID, TrxID, নাম বা ফোন নম্বর দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#02050f] text-white placeholder-slate-500"
          />
        </div>

        {/* Status Pill Filters */}
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {(['All', 'Pending', 'Payment Verified', 'Payment Rejected', 'Completed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 border border-blue-400/30'
                  : 'bg-[#02050f] text-slate-400 hover:text-white border border-blue-950'
              }`}
            >
              {st === 'All' ? 'সকল অর্ডার' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-linear-to-b from-[#020617] via-[#040e29] to-[#020617] rounded-3xl border border-blue-900/60 shadow-xl overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            কোনো অর্ডার খুঁজে পাওয়া যায়নি।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-black/60 text-slate-400 font-bold uppercase border-b border-blue-950">
                <tr>
                  <th className="py-3 px-4">Order ID & তারিখ</th>
                  <th className="py-3 px-4">গ্রাহক বিবরণ</th>
                  <th className="py-3 px-4">কোর্স / আইটেম</th>
                  <th className="py-3 px-4">পেমেন্ট মেথড ও TrxID</th>
                  <th className="py-3 px-4">টাকা</th>
                  <th className="py-3 px-4">স্ট্যাটাস</th>
                  <th className="py-3 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-950/60">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-blue-950/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-cyan-300 block text-xs">
                        #{order.id}
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('bn-BD', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white">{order.customerName}</p>
                      <p className="text-slate-400 font-mono text-[11px] mt-0.5">
                        {order.customerPhone}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 max-w-[200px] truncate text-slate-200">
                      {order.productName}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-bold ${
                            order.paymentMethod === 'bKash' ? 'text-[#e2136e]' : 'text-[#f7941d]'
                          }`}
                        >
                          {order.paymentMethod}
                        </span>
                      </div>
                      <span className="font-mono text-cyan-300 bg-black/60 px-1.5 py-0.5 rounded border border-blue-950 text-[10px] block w-fit mt-1">
                        {order.transactionId}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-white text-sm">
                      ৳{order.amount.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          order.status === 'Payment Verified' || order.status === 'Completed'
                            ? 'bg-blue-600/20 text-cyan-300 border-blue-500/30'
                            : order.status === 'Pending'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-red-500/20 text-red-300 border-red-500/30'
                        }`}
                      >
                        {order.status === 'Payment Verified' || order.status === 'Completed' ? (
                          <CheckCircle className="w-3 h-3 text-cyan-400" />
                        ) : order.status === 'Pending' ? (
                          <Clock className="w-3 h-3 text-amber-400" />
                        ) : (
                          <XCircle className="w-3 h-3 text-red-400" />
                        )}
                        <span>{order.status}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {order.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'Payment Verified', 'পেমেন্ট TrxID নিশ্চিত করা হয়েছে।')}
                              disabled={isUpdating}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-md shadow-blue-600/30"
                              title="পেমেন্ট ভেরিফাই করুন"
                            >
                              ভেরিফাই
                            </button>
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowRejectPrompt(true);
                              }}
                              disabled={isUpdating}
                              className="px-2.5 py-1 bg-red-950/80 hover:bg-red-600 text-red-300 hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer border border-red-800/40"
                              title="পেমেন্ট বাতিল করুন"
                            >
                              বাতিল
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => onViewReceipt(order)}
                          className="p-1.5 bg-blue-950/80 hover:bg-blue-900 text-blue-300 rounded-lg transition-colors cursor-pointer border border-blue-800/40"
                          title="রসিদ দেখুন ও প্রিন্ট করুন"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectPrompt && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-linear-to-b from-[#020617] via-[#091535] to-[#020617] rounded-3xl border border-red-500/40 p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-950/80 text-red-400 border border-red-500/40 flex items-center justify-center mx-auto">
              <XCircle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-white">পেমেন্ট বাতিল করতে চান?</h3>
              <p className="text-xs text-slate-300">
                অর্ডার #{selectedOrder.id} - {selectedOrder.customerName}
              </p>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                বাতিলের কারণ (গ্রাহক দেখতে পাবে):
              </label>
              <textarea
                rows={2}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="যেমন: বিকাশ অ্যাকাউন্টে টাকা জমা পড়েনি বা TrxID ভুল..."
                className="w-full p-2.5 bg-[#02050f] border border-blue-900/60 rounded-xl text-xs text-white placeholder-slate-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowRejectPrompt(false)}
                className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
              >
                বাতিল
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedOrder.id, 'Payment Rejected', adminNote)}
                disabled={isUpdating}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md"
              >
                {isUpdating ? 'বাতিল হচ্ছে...' : 'হ্যাঁ, পেমেন্ট বাতিল করুন'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
