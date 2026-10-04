import React, { useState } from 'react';
import { Product } from '../../types/index.ts';
import { ApiService } from '../../services/api.ts';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Sparkles,
  Loader2,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';

interface AdminProductsProps {
  products: Product[];
  onRefresh: () => void;
  onEditProduct: (product: Product) => void;
  onAddNewProduct: () => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
  products,
  onRefresh,
  onEditProduct,
  onAddNewProduct
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // In-app delete confirmation state (No blocked window.confirm)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleTogglePublish = async (product: Product) => {
    setActionLoadingId(product.id);
    try {
      const newStatus = product.status === 'published' ? 'draft' : 'published';
      await ApiService.adminUpdateProduct(product.id, { status: newStatus });
      showToast('success', `"${product.name}" এর স্ট্যাটাস আপডেট হয়েছে।`);
      onRefresh();
    } catch (err: any) {
      showToast('error', err.message || 'স্ট্যাটাস আপডেট ব্যর্থ হয়েছে।');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDuplicate = async (id: string) => {
    setActionLoadingId(id);
    try {
      await ApiService.adminDuplicateProduct(id);
      showToast('success', 'কোর্সটি সফলভাবে কপি / ডুপ্লিকেট করা হয়েছে।');
      onRefresh();
    } catch (err: any) {
      showToast('error', err.message || 'ডুপ্লিকেট ব্যর্থ হয়েছে।');
    } finally {
      setActionLoadingId(null);
    }
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await ApiService.adminDeleteProduct(productToDelete.id);
      showToast('success', `"${productToDelete.name}" সফলভাবে ডিলিট করা হয়েছে!`);
      setProductToDelete(null);
      onRefresh();
    } catch (err: any) {
      showToast('error', err.message || 'মুছে ফেলা সম্ভব হয়নি।');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= products.length) return;

    const newOrder = [...products];
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;

    const ids = newOrder.map(p => p.id);
    try {
      await ApiService.adminReorderProducts(ids);
      onRefresh();
    } catch (err: any) {
      showToast('error', err.message || 'ক্রম পরিবর্তন ব্যর্থ হয়েছে।');
    }
  };

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {toast && (
        <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between shadow-md transition-all ${
          toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
          <button onClick={() => setToast(null)} className="p-1 hover:opacity-70 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">কোর্স ও প্রোডাক্ট ব্যবস্থাপনা</h2>
          <p className="text-xs text-slate-500">
            ওয়েবসাইটে প্রদর্শিত সকল কোর্স যুক্ত, সম্পাদনা, মূল্য পরিবর্তন, সাজান ও ডিলিট করুন
          </p>
        </div>

        <button
          onClick={onAddNewProduct}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন কোর্স যুক্ত করুন</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="কোর্সের নাম বা কি-ওয়ার্ড দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-48 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            {categories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat === 'All' ? 'সকল ক্যাটাগরি' : cat}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full md:w-36 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="all">সকল স্ট্যাটাস</option>
            <option value="published">পাবলিশড</option>
            <option value="draft">ড্রাফট</option>
          </select>
        </div>
      </div>

      {/* Products Table for Desktop & Cards for Mobile */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            কোনো কোর্স খুঁজে পাওয়া যায়নি।
          </div>
        ) : (
          <div className="divide-y divide-slate-100 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">ক্রম</th>
                  <th className="py-3 px-4">কোর্স / থাম্বনেইল</th>
                  <th className="py-3 px-4">ক্যাটাগরি</th>
                  <th className="py-3 px-4">মূল্য (বর্তমান / পূর্বের)</th>
                  <th className="py-3 px-4">স্ট্যাটাস</th>
                  <th className="py-3 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((prod, idx) => {
                  const isLoading = actionLoadingId === prod.id;
                  const discount = prod.discountPercentage ||
                    (prod.previousPrice > prod.currentPrice
                      ? Math.round(((prod.previousPrice - prod.currentPrice) / prod.previousPrice) * 100)
                      : 0);

                  return (
                    <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Reorder Buttons */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <button
                            onClick={() => handleMoveOrder(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer"
                            title="উপরে নিন"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-mono text-[10px] text-slate-400">{idx + 1}</span>
                          <button
                            onClick={() => handleMoveOrder(idx, 'down')}
                            disabled={idx === filtered.length - 1}
                            className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer"
                            title="নিচে নিন"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Thumbnail & Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.thumbnail}
                            alt=""
                            className="w-16 h-12 rounded-lg object-contain bg-slate-100 border border-slate-200 shrink-0"
                          />
                          <div className="max-w-xs sm:max-w-md">
                            <p className="font-bold text-slate-900 line-clamp-1">{prod.name}</p>
                            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{prod.shortDescription}</p>
                            {prod.offerBadge && (
                              <span className="inline-block px-1.5 py-0.2 rounded text-[10px] bg-amber-100 text-amber-800 font-bold mt-1">
                                {prod.offerBadge}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 font-medium text-slate-600">
                        {prod.category}
                      </td>

                      {/* Price & Discount */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-bold text-slate-900">৳{prod.currentPrice.toLocaleString('en-IN')}</span>
                          {prod.previousPrice > prod.currentPrice && (
                            <span className="text-[10px] text-slate-400 line-through">
                              ৳{prod.previousPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                        {discount > 0 && (
                          <span className="text-[10px] font-bold text-emerald-600 block">
                            {discount}% ডিসকাউন্ট
                          </span>
                        )}
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleTogglePublish(prod)}
                          disabled={isLoading}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                            prod.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                        >
                          {prod.status === 'published' ? (
                            <>
                              <Eye className="w-3 h-3 text-emerald-600" />
                              <span>Published</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 text-slate-500" />
                              <span>Draft</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onEditProduct(prod)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                            title="এডিট করুন"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDuplicate(prod.id)}
                            disabled={isLoading}
                            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors cursor-pointer"
                            title="কপি / ডুপ্লিকেট করুন"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setProductToDelete(prod)}
                            disabled={isLoading}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-lg transition-colors cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* In-App Delete Confirmation Modal (Guaranteed to work inside iframe) */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-inner">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-black text-slate-900">কোর্সটি মুছে ফেলতে চান?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                আপনি কি নিশ্চিত যে <strong className="text-slate-900">"{productToDelete.name}"</strong> সম্পূর্ণ ডিলিট করতে চান?
              </p>
              <p className="text-[11px] text-red-500 font-semibold bg-red-50 p-2 rounded-xl border border-red-200">
                ⚠️ এটি মুছে ফেললে ডাটাবেস ও পাবলিক ওয়েবসাইট থেকে সম্পূর্ণ অপসারিত হবে।
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={confirmDeleteProduct}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>মুছে ফেলা হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>হ্যাঁ, ডিলিট করুন</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
