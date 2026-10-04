import React from 'react';
import { Product, Order } from '../../types/index.ts';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Clock,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  Eye,
  Check,
  XCircle,
  FileText,
  Sparkles
} from 'lucide-react';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  onNavigateTab: (tab: string) => void;
  onVerifyOrder: (orderId: string) => void;
  onRejectOrder: (orderId: string) => void;
  onViewReceipt: (order: Order) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  orders,
  onNavigateTab,
  onVerifyOrder,
  onRejectOrder,
  onViewReceipt
}) => {
  // Calculations
  const totalProducts = products.length;
  const publishedProducts = products.filter(p => p.status === 'published').length;

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Pending');
  const verifiedOrders = orders.filter(o => o.status === 'Payment Verified' || o.status === 'Completed');

  const pendingAmount = pendingOrders.reduce((sum, o) => sum + o.amount, 0);
  const totalRevenue = verifiedOrders.reduce((sum, o) => sum + o.amount, 0);

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Banner / Welcome with Blue & Black Gradient */}
      <div className="bg-linear-to-r from-black via-blue-950 to-black rounded-3xl p-6 sm:p-8 border border-blue-900/60 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-blue-600/20 text-cyan-300 text-xs font-bold border border-blue-500/30 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>লাইভ ম্যানেজমেন্ট ড্যাশবোর্ড</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-2 text-white">
            স্বাগতম, অ্যাডমিনিস্ট্রেটর
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg">
            আপনার অনলাইন লার্নিং প্ল্যাটফর্মের রিয়েল-টাইম কোর্স বিক্রি, বিকাশ/নগদ পেমেন্ট ভেরিফিকেশন এবং ইনভয়েস ম্যানেজ করুন।
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onNavigateTab('products')}
            className="px-5 py-2.5 bg-linear-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer border border-blue-400/30"
          >
            + নতুন কোর্স যুক্ত করুন
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-linear-to-br from-[#020617] via-[#040e29] to-[#020617] p-5 rounded-2xl border border-blue-900/60 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">মোট বিক্রয় (Revenue)</span>
            <div className="p-2 rounded-xl bg-blue-600/20 text-cyan-400 border border-blue-500/30">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">
            ৳{totalRevenue.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-cyan-400 font-semibold block">
            {verifiedOrders.length} টি ভেরিফাইড অর্ডার
          </span>
        </div>

        {/* Pending Payments */}
        <div className="bg-linear-to-br from-[#020617] via-[#040e29] to-[#020617] p-5 rounded-2xl border border-blue-900/60 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">পেন্ডিং পেমেন্ট</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-400">
            {pendingOrders.length}
          </p>
          <span className="text-[11px] text-slate-400 font-medium block">
            ৳{pendingAmount.toLocaleString('en-IN')} যাচাইয়ের অপেক্ষায়
          </span>
        </div>

        {/* Total Orders */}
        <div className="bg-linear-to-br from-[#020617] via-[#040e29] to-[#020617] p-5 rounded-2xl border border-blue-900/60 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">মোট অর্ডার</span>
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">
            {totalOrders}
          </p>
          <span className="text-[11px] text-blue-400 font-semibold block">
            {((verifiedOrders.length / (totalOrders || 1)) * 100).toFixed(0)}% কনভার্সন রেট
          </span>
        </div>

        {/* Total Products / Courses */}
        <div className="bg-linear-to-br from-[#020617] via-[#040e29] to-[#020617] p-5 rounded-2xl border border-blue-900/60 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">কোর্স ও প্রোডাক্ট</span>
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">
            {totalProducts}
          </p>
          <span className="text-[11px] text-cyan-300 font-semibold block">
            {publishedProducts} টি ওয়েবসাইটে লাইভ আছে
          </span>
        </div>
      </div>

      {/* Pending Attention Banner (If any) */}
      {pendingOrders.length > 0 && (
        <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-xs sm:text-sm font-bold text-amber-200">
                {pendingOrders.length} টি পেমেন্ট TrxID যাচাইয়ের অপেক্ষায় আছে!
              </p>
              <p className="text-[11px] text-amber-300/80">
                দ্রুত ভেরিফাই করে শিক্ষার্থীদের এক্সেস নিশ্চিত করুন।
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-md"
          >
            অর্ডারসমূহ দেখুন &rarr;
          </button>
        </div>
      )}

      {/* Recent Orders Section */}
      <div className="bg-linear-to-b from-[#020617] via-[#040e29] to-[#020617] rounded-3xl border border-blue-900/60 shadow-xl overflow-hidden">
        <div className="p-5 border-b border-blue-900/40 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-white">সাম্প্রতিক অর্ডারসমূহ</h3>
            <p className="text-xs text-slate-400">সর্বশেষ জমা হওয়া পেমেন্ট ও কোর্সের তালিকা</p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer"
          >
            সবগুলো দেখুন ({orders.length}) &rarr;
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            এখনও কোনো অর্ডার আসেনি।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-black/50 text-slate-400 font-bold uppercase border-b border-blue-950">
                <tr>
                  <th className="py-3 px-4">অর্ডার আইডি</th>
                  <th className="py-3 px-4">গ্রাহক</th>
                  <th className="py-3 px-4">কোর্স</th>
                  <th className="py-3 px-4">পেমেন্ট মেথড</th>
                  <th className="py-3 px-4">মূল্য</th>
                  <th className="py-3 px-4">স্ট্যাটাস</th>
                  <th className="py-3 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-950/60">
                {recentOrders.map((order) => {
                  const isVerified = order.status === 'Payment Verified' || order.status === 'Completed';
                  const isPending = order.status === 'Pending';
                  const isRejected = order.status === 'Payment Rejected';

                  return (
                    <tr key={order.id} className="hover:bg-blue-950/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-cyan-300">
                        {order.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{order.customerName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{order.customerPhone}</div>
                      </td>
                      <td className="py-3.5 px-4 max-w-[200px] truncate text-slate-200">
                        {order.productName}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-bold">
                          <span className={order.paymentMethod === 'bKash' ? 'text-[#e2136e]' : 'text-[#f7941d]'}>
                            {order.paymentMethod}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          Trx: {order.transactionId}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        ৳{order.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            isVerified
                              ? 'bg-blue-600/20 text-cyan-300 border-blue-500/30'
                              : isPending
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : 'bg-red-500/20 text-red-300 border-red-500/30'
                          }`}
                        >
                          {isVerified ? (
                            <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                          ) : isPending ? (
                            <Clock className="w-3 h-3 text-amber-400" />
                          ) : (
                            <XCircle className="w-3 h-3 text-red-400" />
                          )}
                          <span>{order.status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isPending && (
                            <>
                              <button
                                onClick={() => onVerifyOrder(order.id)}
                                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
                                title="পেমেন্ট ভেরিফাই করুন"
                              >
                                ভেরিফাই
                              </button>
                              <button
                                onClick={() => onRejectOrder(order.id)}
                                className="px-2.5 py-1 bg-red-950/80 hover:bg-red-600 text-red-300 hover:text-white rounded-lg text-xs font-bold transition-colors cursor-pointer border border-red-800/40"
                                title="পেমেন্ট বাতিল করুন"
                              >
                                বাতিল
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => onViewReceipt(order)}
                            className="p-1.5 bg-blue-950/80 hover:bg-blue-900 text-blue-300 rounded-lg transition-colors cursor-pointer border border-blue-800/40"
                            title="রসিদ দেখুন"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
