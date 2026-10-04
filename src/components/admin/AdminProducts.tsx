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
  X,
  Layers,
  Image as ImageIcon
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

  // In-app delete confirmation state
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Local optimistic list to ensure immediate UI feedback upon deletion
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const visibleProducts = products.filter(p => !deletedIds.has(p.id));

  const filtered = visibleProducts.filter(p => {
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
    const targetId = productToDelete.id;
    const targetName = productToDelete.name;
    setIsDeleting(true);

    try {
      // Optimistically hide immediately from UI
      setDeletedIds(prev => new Set([...prev, targetId]));
      
      // Perform server deletion
      await ApiService.adminDeleteProduct(targetId);
      
      showToast('success', `"${targetName}" সফলভাবে ডিলিট করা হয়েছে!`);
      setProductToDelete(null);
      onRefresh();
    } catch (err: any) {
      // Revert optimistic deletion if failed
      setDeletedIds(prev => {
        const next = new Set(prev);
        next.delete(targetId);
        return next;
      });
      showToast('error', err.message || 'মুছে ফেলা সম্ভব হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।');
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
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xl animate-in slide-in-from-top duration-200 border ${
            toast.type === 'success'
              ? 'bg-blue-950 border-blue-500/50 text-blue-200'
              : 'bg-red-950 border-red-500/50 text-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-cyan-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400" />
            )}
            <span>{toast.message}</span>
          </div>
          <button onClick={() => setToast(null)} className="p-1 hover:opacity-75">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Header & Add Button */}
      <div className="bg-linear-to-r from-black via-blue-950 to-black p-5 sm:p-6 rounded-3xl border border-blue-900/60 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Layers className="w-5 h-5" />
            </span>
            <span>কোর্স ও প্রোডাক্ট ম্যানেজমেন্ট</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            মোট কোর্স: <strong className="text-blue-300 font-mono">{visibleProducts.length}টি</strong> | যেকোনো সাইজের ছবি আপলোড ও সম্পূর্ণ কন্ট্রোল
          </p>
        </div>

        <button
          onClick={onAddNewProduct}
          className="px-5 py-2.5 bg-linear-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer border border-blue-400/30"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন কোর্স যুক্ত করুন</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-linear-to-r from-[#020617] via-[#040e29] to-[#020617] p-4 rounded-2xl border border-blue-900/40 shadow-lg flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="কোর্সের নাম বা বিষয় লিখে খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#02050f] text-slate-100 placeholder-slate-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl border border-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#02050f] text-slate-200"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? 'সকল ক্যাটাগরি' : c}
              </option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl border border-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#02050f] text-slate-200"
          >
            <option value="all">সকল স্ট্যাটাস</option>
            <option value="published">পাবলিশড (Live)</option>
            <option value="draft">ড্রাফট (Hidden)</option>
          </select>
        </div>
      </div>

      {/* Mobile Card List (Guaranteed to show delete button clearly without horizontal scroll) */}
      <div className="block lg:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 text-center bg-[#030919] rounded-2xl border border-blue-900/40 text-slate-400 text-xs">
            কোনো কোর্স খুঁজে পাওয়া যায়নি।
          </div>
        ) : (
          filtered.map((prod, idx) => {
            const isLoading = actionLoadingId === prod.id;
            return (
              <div
                key={prod.id}
                className="bg-linear-to-br from-[#020617] via-[#040e29] to-[#020617] rounded-2xl border border-blue-900/60 p-4 shadow-lg space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-xl bg-black border border-blue-900/60 overflow-hidden shrink-0 flex items-center justify-center p-1">
                    {prod.thumbnail ? (
                      <img src={prod.thumbnail} alt="" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-blue-300 bg-blue-950 px-2 py-0.5 rounded border border-blue-800/40">
                        {prod.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          prod.status === 'published'
                            ? 'bg-blue-600/20 text-cyan-300 border border-blue-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {prod.status === 'published' ? 'Live' : 'Draft'}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white mt-1 line-clamp-1">{prod.name}</h4>
                    <p className="text-xs text-blue-400 font-extrabold mt-0.5">
                      ৳{prod.currentPrice.toLocaleString('en-IN')}
                      {prod.previousPrice > prod.currentPrice && (
                        <span className="text-slate-500 line-through text-[11px] ml-1.5">
                          ৳{prod.previousPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Mobile Action Buttons Bar */}
                <div className="pt-2 border-t border-blue-950 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveOrder(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 bg-[#02050f] text-slate-400 hover:text-white rounded border border-blue-950 disabled:opacity-20"
                      title="উপরে নিন"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveOrder(idx, 'down')}
                      disabled={idx === filtered.length - 1}
                      className="p-1.5 bg-[#02050f] text-slate-400 hover:text-white rounded border border-blue-950 disabled:opacity-20"
                      title="নিচে নিন"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleTogglePublish(prod)}
                      disabled={isLoading}
                      className="px-2.5 py-1.5 bg-blue-950/80 hover:bg-blue-900 text-blue-300 border border-blue-800/40 rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      {prod.status === 'published' ? 'ড্রাফট করুন' : 'পাবলিশ করুন'}
                    </button>
                    <button
                      onClick={() => onEditProduct(prod)}
                      className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-semibold cursor-pointer"
                      title="এডিট করুন"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(prod.id)}
                      disabled={isLoading}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                      title="কপি করুন"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setProductToDelete(prod)}
                      disabled={isLoading}
                      className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                      title="কোর্সটি মুছে ফেলুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>ডিলিট</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Products Table */}
      <div className="hidden lg:block bg-linear-to-b from-[#020617] via-[#040e29] to-[#020617] rounded-3xl border border-blue-900/50 shadow-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            কোনো কোর্স খুঁজে পাওয়া যায়নি।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-black/60 text-slate-400 font-bold uppercase border-b border-blue-900/50">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">ক্রম</th>
                  <th className="py-3 px-4">কোর্স / থাম্বনেইল</th>
                  <th className="py-3 px-4">ক্যাটাগরি</th>
                  <th className="py-3 px-4">মূল্য (টাকা)</th>
                  <th className="py-3 px-4">স্ট্যাটাস</th>
                  <th className="py-3 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-950/60">
                {filtered.map((prod, idx) => {
                  const isLoading = actionLoadingId === prod.id;
                  const discount = prod.discountPercentage ||
                    (prod.previousPrice > prod.currentPrice
                      ? Math.round(((prod.previousPrice - prod.currentPrice) / prod.previousPrice) * 100)
                      : 0);

                  return (
                    <tr key={prod.id} className="hover:bg-blue-950/30 transition-colors">
                      {/* Reorder Buttons */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <button
                            onClick={() => handleMoveOrder(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 text-slate-500 hover:text-white disabled:opacity-20 cursor-pointer"
                            title="উপরে নিন"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-mono text-[10px] text-slate-500">{idx + 1}</span>
                          <button
                            onClick={() => handleMoveOrder(idx, 'down')}
                            disabled={idx === filtered.length - 1}
                            className="p-1 text-slate-500 hover:text-white disabled:opacity-20 cursor-pointer"
                            title="নিচে নিন"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Course Image & Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-xl bg-black border border-blue-900/60 overflow-hidden shrink-0 flex items-center justify-center p-1">
                            {prod.thumbnail ? (
                              <img
                                src={prod.thumbnail}
                                alt=""
                                className="max-h-full max-w-full object-contain"
                              />
                            ) : (
                              <ImageIcon className="w-6 h-6 text-slate-600" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm line-clamp-1">
                              {prod.name}
                            </div>
                            <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                              {prod.shortDescription || 'কোনো বিবরণ নেই'}
                            </div>
                            {prod.offerBadge && (
                              <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-cyan-300 border border-blue-800/40">
                                {prod.offerBadge}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 bg-blue-950/80 text-blue-300 font-semibold rounded-lg text-[11px] border border-blue-800/40">
                          {prod.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-white text-sm">
                          ৳{prod.currentPrice.toLocaleString('en-IN')}
                        </div>
                        {prod.previousPrice > prod.currentPrice && (
                          <div className="text-slate-500 line-through text-[11px]">
                            ৳{prod.previousPrice.toLocaleString('en-IN')}
                            <span className="text-cyan-400 ml-1">({discount}% ছাড়)</span>
                          </div>
                        )}
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleTogglePublish(prod)}
                          disabled={isLoading}
                          className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1.5 border ${
                            prod.status === 'published'
                              ? 'bg-blue-600/20 text-cyan-300 border-blue-500/30 hover:bg-blue-600/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                          }`}
                        >
                          {prod.status === 'published' ? (
                            <>
                              <Eye className="w-3 h-3 text-cyan-400" />
                              <span>Published</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 text-slate-400" />
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
                            className="p-2 bg-blue-950/80 hover:bg-blue-900 text-blue-300 rounded-xl transition-colors cursor-pointer border border-blue-800/50"
                            title="এডিট করুন"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDuplicate(prod.id)}
                            disabled={isLoading}
                            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl transition-colors cursor-pointer border border-slate-700"
                            title="কপি / ডুপ্লিকেট করুন"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setProductToDelete(prod)}
                            disabled={isLoading}
                            className="p-2 bg-red-950/60 hover:bg-red-600 text-red-400 hover:text-white rounded-xl transition-all cursor-pointer border border-red-800/50"
                            title="কোর্সটি সম্পূর্ণ মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-linear-to-b from-[#020617] via-[#08122c] to-[#020617] rounded-3xl shadow-2xl border border-red-500/40 p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-red-950/80 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto shadow-inner">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-black text-white">কোর্সটি মুছে ফেলতে চান?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                আপনি কি নিশ্চিত যে <strong className="text-cyan-300">"{productToDelete.name}"</strong> সম্পূর্ণ ডিলিট করতে চান?
              </p>
              <p className="text-[11px] text-red-300 font-semibold bg-red-950/60 p-2.5 rounded-xl border border-red-800/60">
                ⚠️ এটি মুছে ফেললে ডাটাবেস ও পাবলিক ওয়েবসাইট থেকে সম্পূর্ণ অপসারিত হবে।
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer border border-slate-700"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={confirmDeleteProduct}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 border border-red-400/30"
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
