import React, { useState } from 'react';
import { Offer, Product } from '../../types/index.ts';
import { ApiService } from '../../services/api.ts';
import { Plus, Edit, Trash2, Tag, Calendar, Percent, Sparkles, X, Loader2, Save } from 'lucide-react';

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

  const openAddModal = () => {
    setEditingOffer(null);
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

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
      } else {
        await ApiService.adminCreateOffer(payload);
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'অফার সেভ করতে সমস্যা হয়েছে।');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, offerName: string) => {
    if (!window.confirm(`আপনি কি "${offerName}" মুছে ফেলতে চান?`)) return;
    try {
      await ApiService.adminDeleteOffer(id);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'মুছে ফেলতে সমস্যা হয়েছে।');
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">বিশেষ অফার ব্যবস্থাপনা</h2>
          <p className="text-xs text-slate-500">
            ওয়েবসাইটে প্রদর্শিত সকল স্পেশাল ক্যাম্পেইন ও মেগা ডিসকাউন্ট অফার তৈরি ও পরিচালনা করুন
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন অফার যুক্ত করুন</span>
        </button>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {offers.map((offer) => {
          const discount = offer.discountPercentage ||
            (offer.previousPrice > offer.offerPrice
              ? Math.round(((offer.previousPrice - offer.offerPrice) / offer.previousPrice) * 100)
              : 0);

          return (
            <div
              key={offer.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {offer.badge || 'অফার'}
                  </span>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    offer.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {offer.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900">{offer.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{offer.description}</p>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-xl font-black text-emerald-600">
                    ৳{offer.offerPrice.toLocaleString('en-IN')}
                  </span>
                  {offer.previousPrice > offer.offerPrice && (
                    <span className="text-xs text-slate-400 line-through">
                      ৳{offer.previousPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-100 text-red-700">
                      {discount}% OFF
                    </span>
                  )}
                </div>

                {offer.endDate && (
                  <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>মেয়াদ: {offer.endDate}</span>
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => openEditModal(offer)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs cursor-pointer"
                  title="এডিট"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(offer.id, offer.name)}
                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs cursor-pointer"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Offer Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in duration-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingOffer ? 'অফার সম্পাদনা করুন' : 'নতুন অফার যুক্ত করুন'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  অফারের নাম *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: গ্র্যান্ড স্কলারশিপ অফার ২০২৬"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  সম্পর্কিত কোর্স (Linked Course)
                </label>
                <select
                  value={productId}
                  onChange={(e) => handleProductSelect(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="">কোনো কোর্স লিঙ্ক ছাড়া</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (৳{p.currentPrice})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    পূর্বের মূল্য (৳)
                  </label>
                  <input
                    type="number"
                    value={previousPrice}
                    onChange={(e) => setPreviousPrice(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    অফার মূল্য (৳) *
                  </label>
                  <input
                    type="number"
                    required
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm font-bold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  অফার ব্যাজ (Offer Badge)
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="যেমন: 🔥 মেগা অফার"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  অফারের বিবরণ (Description)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="অফারের সুযোগ ও শর্তাবলী লিখুন..."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    শুরুর তারিখ
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    শেষ তারিখ
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <label htmlFor="isActiveToggle" className="text-xs font-bold text-slate-700 cursor-pointer">
                  অফারটি সক্রিয় রাখুন (Active on Website)
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>সেভ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
