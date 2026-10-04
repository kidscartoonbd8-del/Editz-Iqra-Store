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
  Download
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

  const handleUpdateStatus = async (orderId: string, status: Order['status'], note?: string) => {
    setIsUpdating(true);
    try {
      await ApiService.adminUpdateOrderStatus(orderId, status, note);
      onRefresh();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status, adminNote: note } : null);
      }
      setShowRejectPrompt(false);
    } catch (err: any) {
      alert(err.message || 'স্ট্যাটাস আপডেট ব্যর্থ হয়েছে।');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">অর্ডার ও পেমেন্ট ভেরিফিকেশন</h2>
          <p className="text-xs text-slate-500">
            বিকাশ ও নগদ লেনদেন ট্রানজাকশন আইডি (TrxID) যাচাই করুন ও রসিদ তৈরি করুন
          </p>
        </div>

        <div className="flex gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>পেন্ডিং: {orders.filter(o => o.status === 'Pending').length}</span>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>ভেরিফাইড: {orders.filter(o => o.status === 'Payment Verified' || o.status === 'Completed').length}</span>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Order ID, TrxID, নাম বা ফোন নম্বর দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
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
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {st === 'All' ? 'সকল অর্ডার' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            কোনো অর্ডার খুঁজে পাওয়া যায়নি।
          </div>
        ) : (
          <div className="divide-y divide-slate-100 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase">
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
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-slate-900 block text-xs">
                        {order.id}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('bn-BD', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{order.customerName}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{order.customerPhone}</p>
                      {order.customerEmail && (
                        <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{order.customerEmail}</p>
                      )}
                    </td>

                    <td className="py-3.5 px-4 max-w-[200px]">
                      <p className="font-semibold text-slate-800 line-clamp-1">{order.productName}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold text-white ${
                          order.paymentMethod === 'bKash' ? 'bg-[#e2136e]' : 'bg-[#f7941d]'
                        }`}>
                          {order.paymentMethod}
                        </span>
                        <div className="font-mono font-bold text-slate-900 text-[11px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200 inline-block">
                          {order.transactionId}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-black text-slate-900">
                      ৳{order.amount.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        order.status === 'Payment Verified' || order.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'Payment Rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {order.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'Payment Verified')}
                              disabled={isUpdating}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                              title="ভেরিফাই করুন"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Verify</span>
                            </button>
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowRejectPrompt(true);
                              }}
                              disabled={isUpdating}
                              className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors cursor-pointer"
                              title="রিজেক্ট করুন"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => onViewReceipt(order)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>রসিদ</span>
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

      {/* Reject Reason Modal */}
      {showRejectPrompt && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-5 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">পেমেন্ট রিজেক্ট করার কারণ</h3>
            <p className="text-xs text-slate-500">
              Order ID <strong className="font-mono text-slate-800">{selectedOrder.id}</strong> এর জন্য কারণ উল্লেখ করুন:
            </p>
            <input
              type="text"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="যেমন: ভুল TrxID অথবা পেমেন্ট জমা হয়নি"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRejectPrompt(false)}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                বাতিল
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedOrder.id, 'Payment Rejected', adminNote)}
                disabled={isUpdating}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                রিজেক্ট নিশ্চিত করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
