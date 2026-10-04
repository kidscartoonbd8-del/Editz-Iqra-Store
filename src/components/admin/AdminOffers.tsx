import React, { useState } from 'react';
import { Offer, Product } from '../../types/index.ts';
import { ApiService } from '../../services/api.ts';
import { Plus, Edit, Trash2, Tag, Calendar, Percent, Sparkles, X, Loader2, Save, CheckCircle, AlertCircle } from 'lucide-react';

interface AdminOffersProps {
  offers: Offer[];
  products: Product[];
  onRefresh: () => void;
}

export const AdminOffers: React.FC<AdminOffersProps> = ({
  offers,
  products,
  onRefresh
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [productId, setProductId] = useState('');
  const [previousPrice, setPreviousPrice] = useState('0');
  const [offerPrice, setOfferPrice] = useState('0');
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('🔥 মেগা ছাড়');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState<Offer | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingOffer(null);
    setErrorMessage(null);
    setName('');
    setProductId(products[0]?.id || '');
    setPreviousPrice(products[0]?.previousPrice?.toString() || '0');
    setOfferPrice(products[0]?.currentPrice?.toString() || '0');
    setDescription('');
    setBadge('🔥 মেগা অফার');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (offer: Offer) => {
    setEditingOffer(offer);
    setErrorMessage(null);
    setName(offer.name);
    setProductId(offer.productId || '');
    setPreviousPrice(offer.previousPrice?.toString() || '0');
    setOfferPrice(offer.offerPrice?.toString() || '0');
    setDescription(offer.description);
    setBadge(offer.badge || '');
    setStartDate(offer.startDate || '');
    setEndDate(offer.endDate || '');
    setIsActive(offer.isActive);
    setIsModalOpen(true);
  };

  const handleProductSelect = (pId: string) => {
    setProductId(pId);
    const prod = products.find(p => p.id === pId);
    if (prod) {
      setPreviousPrice(prod.previousPrice.toString());
      setOfferPrice(prod.currentPrice.toString());
      if (!name) setName(`${prod.name} স্পেশাল অফার`);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);

    const prevNum = parseFloat(previousPrice) || 0;
    const offNum = parseFloat(offerPrice) || 0;
    const discount = prevNum > offNum && prevNum > 0
      ? Math.round(((prevNum - offNum) / prevNum) * 100)
      : 0;

    const payload: Partial<Offer> = {
      name: name.trim(),
      productId: productId || undefined,
      previousPrice: prevNum,
      offerPrice: offNum,
      discountPercentage: discount,
      description: description.trim(),
      badge: badge.trim(),
      startDate,
      endDate,
      isActive
    };

    try {
      if (editingOffer) {
        await ApiService.adminUpdateOffer(editingOffer.id, payload);
        showToast('অফারটি সফলভাবে আপডেট হয়েছে!');
      } else {
        await ApiService.adminCreateOffer(payload);
        showToast('নতুন অফার সফলভাবে যুক্ত হয়েছে!');
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'অফার সেভ করতে সমস্যা হয়েছে।');
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDeleteOffer = async () => {
    if (!offerToDelete) return;
    setIsDeleting(true);
    try {
      await ApiService.adminDeleteOffer(offerToDelete.id);
      showToast('অফারটি সফলভাবে ডিলিট করা হয়েছে!');
      setOfferToDelete(null);
      onRefresh();
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
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
              <Tag className="w-5 h-5" />
            </span>
            <span>বিশেষ অফার ও ডিসকাউন্ট ক্যাম্পেইন</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            কোর্সের জন্য আনলিমিটেড বিশেষ অফার, ডিসকাউন্ট ও ব্যানার তৈরি ও পরিচালনা করুন
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-linear-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer border border-blue-400/30"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন অফার তৈরি করুন</span>
        </button>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {offers.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-linear-to-b from-[#020617] to-[#040e29] rounded-3xl border border-blue-900/40 text-slate-400 text-xs space-y-2">
            <Tag className="w-8 h-8 text-blue-400 mx-auto" />
            <p className="font-bold text-slate-200">এখনও কোনো অফার তৈরি করা হয়নি</p>
            <p>উপরের "নতুন অফার তৈরি করুন" বাটনে ক্লিক করে প্রথম অফার তৈরি করুন।</p>
          </div>
        ) : (
          offers.map((offer) => {
            const linkedProduct = products.find(p => p.id === offer.productId);
            const discount = offer.discountPercentage ||
              (offer.previousPrice > offer.offerPrice
                ? Math.round(((offer.previousPrice - offer.offerPrice) / offer.previousPrice) * 100)
                : 0);

            return (
              <div
                key={offer.id}
                className="bg-linear-to-br from-[#020617] via-[#040e29] to-[#020617] rounded-3xl border border-blue-900/60 p-5 shadow-xl flex flex-col justify-between space-y-4 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-600/20 text-cyan-300 border border-blue-500/30 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                      {offer.badge || 'বিশেষ ছাড়'}
                    </span>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        offer.isActive
                          ? 'bg-blue-950 text-cyan-300 border-blue-700/50'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {offer.isActive ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয় (Inactive)'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-white line-clamp-1">{offer.name}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                      {offer.description || linkedProduct?.shortDescription || 'কোনো বিবরণ নেই'}
                    </p>
                  </div>

                  {linkedProduct && (
                    <div className="p-2.5 rounded-xl bg-[#02050f] border border-blue-950 flex items-center gap-2.5">
                      {linkedProduct.thumbnail && (
                        <img
                          src={linkedProduct.thumbnail}
                          alt=""
                          className="w-10 h-10 rounded-lg object-contain bg-black shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <span className="text-[10px] text-slate-400 block">কোর্স:</span>
                        <p className="text-xs font-bold text-slate-200 truncate">{linkedProduct.name}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-xl font-extrabold text-white font-mono">
                      ৳{offer.offerPrice.toLocaleString('en-IN')}
                    </span>
                    {offer.previousPrice > offer.offerPrice && (
                      <span className="text-xs text-slate-500 line-through font-mono">
                        ৳{offer.previousPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                    {discount > 0 && (
                      <span className="text-xs font-bold text-cyan-400 bg-blue-950 px-2 py-0.5 rounded-md border border-blue-800/40">
                        {discount}% ছাড়
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-blue-950 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEditModal(offer)}
                    className="p-2 bg-blue-950/80 hover:bg-blue-900 text-blue-300 rounded-xl transition-colors cursor-pointer border border-blue-800/50"
                    title="এডিট করুন"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setOfferToDelete(offer)}
                    className="p-2 bg-red-950/60 hover:bg-red-600 text-red-400 hover:text-white rounded-xl transition-all cursor-pointer border border-red-800/50"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Offer Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-lg bg-linear-to-b from-[#020617] via-[#050f28] to-[#020617] rounded-3xl shadow-2xl border border-blue-900/60 p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-blue-950 pb-3">
              <h3 className="font-extrabold text-base text-white">
                {editingOffer ? 'অফার সম্পাদনা' : 'নতুন অফার যুক্ত করুন'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">অফারের নাম</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: পবিত্র ঈদ স্পেশাল স্কলারশিপ অফার"
                  className="w-full p-2.5 bg-[#02050f] border border-blue-900/60 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">কোর্স নির্বাচন করুন</label>
                <select
                  value={productId}
                  onChange={(e) => handleProductSelect(e.target.value)}
                  className="w-full p-2.5 bg-[#02050f] border border-blue-900/60 rounded-xl text-white font-medium"
                >
                  <option value="">-- কোনো নির্দিষ্ট কোর্স নয় (সাধারণ অফার) --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (মূল্য: ৳{p.currentPrice})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">অফার মূল্য (৳)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    className="w-full p-2.5 bg-[#02050f] border border-blue-900/60 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">পূর্বের মূল্য (৳)</label>
                  <input
                    type="number"
                    min="0"
                    value={previousPrice}
                    onChange={(e) => setPreviousPrice(e.target.value)}
                    className="w-full p-2.5 bg-[#02050f] border border-blue-900/60 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">অফার ব্যাজ</label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="যেমন: 🔥 মেগা অফার, সীমিত আসন..."
                  className="w-full p-2.5 bg-[#02050f] border border-blue-900/60 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">অফার বিবরণ</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="অফারের সুযোগ ও সুবিধার বিবরণ লিখুন..."
                  className="w-full p-2.5 bg-[#02050f] border border-blue-900/60 rounded-xl text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="offerActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700"
                />
                <label htmlFor="offerActive" className="font-bold text-slate-300 cursor-pointer">
                  অফারটি এখন সক্রিয় রাখুন (পাবলিক ওয়েবসাইটে দৃশ্যমান হবে)
                </label>
              </div>

              <div className="pt-3 border-t border-blue-950 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-md shadow-blue-600/30 flex items-center gap-1.5"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {offerToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-linear-to-b from-[#020617] via-[#091535] to-[#020617] rounded-3xl border border-red-500/50 p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-950/80 text-red-400 border border-red-500/40 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-black text-white">অফারটি মুছে ফেলতে চান?</h4>
            <p className="text-xs text-slate-300">
              "{offerToDelete.name}" অফারটি স্থায়ীভাবে ডিলিট করা হবে।
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setOfferToDelete(null)}
                className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
              >
                বাতিল
              </button>
              <button
                onClick={confirmDeleteOffer}
                disabled={isDeleting}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold"
              >
                {isDeleting ? 'ডিলিট হচ্ছে...' : 'হ্যাঁ, ডিলিট করুন'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
