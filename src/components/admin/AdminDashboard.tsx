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
  FileText
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
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="bg-linear-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            লাইভ ম্যানেজমেন্ট ড্যাশবোর্ড
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-2">
            স্বাগতম, অ্যাডমিনিস্ট্রেটর
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg">
            আপনার অনলাইন লার্নিং প্ল্যাটফর্মের রিয়েল-টাইম কোর্স বিক্রি, বিকাশ/নগদ পেমেন্ট ভেরিফিকেশন এবং ইনভয়েস ম্যানেজ করুন।
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onNavigateTab('products')}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
          >
            + নতুন কোর্স যুক্ত করুন
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">মোট বিক্রয় (Revenue)</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            ৳{totalRevenue.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold block">
            {verifiedOrders.length} টি ভেরিফাইড অর্ডার
          </span>
        </div>

        {/* Pending Payments */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">পেন্ডিং পেমেন্ট</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-600">
            {pendingOrders.length}
          </p>
          <span className="text-[11px] text-slate-400 font-medium block">
            ৳{pendingAmount.toLocaleString('en-IN')} যাচাইয়ের অপেক্ষায়
          </span>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">মোট অর্ডার</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {totalOrders}
          </p>
          <span className="text-[11px] text-blue-600 font-semibold block">
            {((verifiedOrders.length / (totalOrders || 1)) * 100).toFixed(0)}% কনভার্সন রেট
          </span>
        </div>

        {/* Total Products / Courses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">কোর্স ও প্রোডাক্ট</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {totalProducts}
          </p>
          <span className="text-[11px] text-purple-600 font-semibold block">
            {publishedProducts} টি ওয়েবসাইটে লাইভ আছে
          </span>
        </div>
      </div>

      {/* Pending Attention Banner (If any) */}
      {pendingOrders.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-900">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-xs sm:text-sm font-bold">
                {pendingOrders.length} টি পেমেন্ট TrxID যাচাইয়ের অপেক্ষায় আছে!
              </p>
              <p className="text-[11px] text-amber-700">
                দ্রুত ভেরিফাই করে শিক্ষার্থীদের এক্সেস নিশ্চিত করুন।
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            অর্ডারসমূহ দেখুন &rarr;
          </button>
        </div>
      )}

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">সাম্প্রতিক অর্ডারসমূহ</h3>
            <p className="text-xs text-slate-400">সর্বশেষ জমা হওয়া পেমেন্ট ও কোর্সের তালিকা</p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
          >
            সবগুলো দেখুন ({orders.length}) &rarr;
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            এখনও কোনো অর্ডার আসেনি।
          </div>
        ) : (
          <div className="divide-y divide-slate-100 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">শিক্ষার্থী</th>
                  <th className="py-3 px-4">কোর্স</th>
                  <th className="py-3 px-4">পেমেন্ট</th>
                  <th className="py-3 px-4">পরিমাণ</th>
                  <th className="py-3 px-4">স্ট্যাটাস</th>
                  <th className="py-3 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {order.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-800">{order.customerName}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{order.customerPhone}</p>
                    </td>
                    <td className="py-3.5 px-4 max-w-[200px] truncate text-slate-700 font-medium">
                      {order.productName}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${
                          order.paymentMethod === 'bKash' ? 'bg-[#e2136e]' : 'bg-[#f7941d]'
                        }`}>
                          {order.paymentMethod}
                        </span>
                        <span className="font-mono text-slate-700 font-semibold text-[11px]">
                          {order.transactionId}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
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
                              onClick={() => onVerifyOrder(order.id)}
                              className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg transition-colors cursor-pointer"
                              title="পেমেন্ট ভেরিফাই করুন"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onRejectOrder(order.id)}
                              className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors cursor-pointer"
                              title="পেমেন্ট বাতিল করুন"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => onViewReceipt(order)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                          title="রসিদ দেখুন"
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
    </div>
  );
};
