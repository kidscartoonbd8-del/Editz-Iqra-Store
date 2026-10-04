import React, { useState } from 'react';
import { Product } from '../../types/index.ts';
import { ImageUploader } from '../common/ImageUploader.tsx';
import { ApiService } from '../../services/api.ts';
import { X, Plus, Trash2, Loader2, Save, Sparkles, AlertCircle } from 'lucide-react';

interface AdminProductModalProps {
  product?: Product | null;
  onClose: () => void;
  onSaved: () => void;
}

export const AdminProductModal: React.FC<AdminProductModalProps> = ({
  product,
  onClose,
  onSaved
}) => {
  const isEditing = !!product;

  const [name, setName] = useState(product?.name || '');
  const [shortDescription, setShortDescription] = useState(product?.shortDescription || '');
  const [fullDescription, setFullDescription] = useState(product?.fullDescription || '');
  const [currentPrice, setCurrentPrice] = useState(product?.currentPrice?.toString() || '0');
  const [previousPrice, setPreviousPrice] = useState(product?.previousPrice?.toString() || '0');
  const [category, setCategory] = useState(product?.category || 'Web Development');
  const [thumbnail, setThumbnail] = useState(product?.thumbnail || '');
  const [status, setStatus] = useState<Product['status']>(product?.status || 'published');
  const [isFeatured, setIsFeatured] = useState<boolean>(product?.isFeatured ?? false);
  const [offerBadge, setOfferBadge] = useState(product?.offerBadge || '');
  const [courseDuration, setCourseDuration] = useState(product?.courseDuration || '');
  const [courseLevel, setCourseLevel] = useState<Product['courseLevel']>(product?.courseLevel || 'All Levels');

  const [whatYouWillLearn, setWhatYouWillLearn] = useState<string[]>(product?.whatYouWillLearn || []);
  const [newLearnItem, setNewLearnItem] = useState('');

  const [features, setFeatures] = useState<string[]>(product?.features || []);
  const [newFeatureItem, setNewFeatureItem] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto calculate discount percentage
  const numCurrent = parseFloat(currentPrice) || 0;
  const numPrev = parseFloat(previousPrice) || 0;
  const calculatedDiscount = numPrev > numCurrent && numPrev > 0
    ? Math.round(((numPrev - numCurrent) / numPrev) * 100)
    : 0;

  const handleAddLearnItem = () => {
    if (!newLearnItem.trim()) return;
    setWhatYouWillLearn([...whatYouWillLearn, newLearnItem.trim()]);
    setNewLearnItem('');
  };

  const handleRemoveLearnItem = (index: number) => {
    setWhatYouWillLearn(whatYouWillLearn.filter((_, i) => i !== index));
  };

  const handleAddFeatureItem = () => {
    if (!newFeatureItem.trim()) return;
    setFeatures([...features, newFeatureItem.trim()]);
    setNewFeatureItem('');
  };

  const handleRemoveFeatureItem = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('কোর্সের নাম লিখুন।');
      return;
    }
    if (isNaN(numCurrent) || numCurrent < 0) {
      setError('সঠিক বর্তমান মূল্য লিখুন।');
      return;
    }

    setIsSaving(true);

    try {
      const payload: Partial<Product> = {
        name: name.trim(),
        shortDescription: shortDescription.trim(),
        fullDescription: fullDescription.trim(),
        currentPrice: numCurrent,
        previousPrice: numPrev || numCurrent,
        discountPercentage: calculatedDiscount,
        category,
        thumbnail: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
        images: [thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'],
        status,
        isFeatured,
        offerBadge: offerBadge.trim(),
        courseDuration: courseDuration.trim(),
        courseLevel,
        whatYouWillLearn,
        features
      };

      if (isEditing && product) {
        await ApiService.adminUpdateProduct(product.id, payload);
      } else {
        await ApiService.adminCreateProduct(payload);
      }

      onSaved();
    } catch (err: any) {
      setError(err.message || 'কোর্সটি সংরক্ষণ করতে সমস্যা হয়েছে।');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCurrentProduct = async () => {
    if (!product) return;
    setIsDeleting(true);
    try {
      await ApiService.adminDeleteProduct(product.id);
      onSaved();
    } catch (err: any) {
      setError(err.message || 'মুছে ফেলা সম্ভব হয়নি।');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-linear-to-b from-[#020617] via-[#050f28] to-[#020617] rounded-3xl shadow-2xl border border-blue-900/60 overflow-hidden flex flex-col my-auto max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-linear-to-r from-black via-blue-950 to-black px-6 py-4 flex items-center justify-between border-b border-blue-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                {isEditing ? 'কোর্স এডিট ও আপডেট' : 'নতুন কোর্স যুক্ত করুন'}
              </h3>
              <p className="text-[11px] text-blue-300">
                যেকোনো সাইজের ছবি আপলোড করুন ও সকল তথ্য কাস্টমাইজ করুন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 text-slate-200">
          {error && (
            <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Course Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              কোর্সের পূর্ণ নাম (Course Name) <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="যেমন: ফুল-স্ট্যাক ওয়েব ডেভেলপমেন্ট উইথ MERN"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#02050f] text-white placeholder-slate-500 font-medium"
            />
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                বর্তমান মূল্য (Current Price ৳) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min="0"
                required
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                placeholder="4500"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#02050f] text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                পূর্বের মূল্য (Previous Price ৳)
              </label>
              <input
                type="number"
                min="0"
                value={previousPrice}
                onChange={(e) => setPreviousPrice(e.target.value)}
                placeholder="8000"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#02050f] text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                ডিসকাউন্ট (% OFF)
              </label>
              <div className="px-3 py-2 rounded-xl bg-blue-950/60 border border-blue-900/60 text-xs sm:text-sm text-cyan-300 font-bold font-mono">
                {calculatedDiscount > 0 ? `${calculatedDiscount}% ছাড়` : '০% (কোনো ছাড় নেই)'}
              </div>
            </div>
          </div>

          {/* Category & Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                ক্যাটাগরি (Category)
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="যেমন: Web Development, Design, IELTS..."
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#02050f] text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                অফার ব্যাজ (Offer Badge)
              </label>
              <input
                type="text"
                value={offerBadge}
                onChange={(e) => setOfferBadge(e.target.value)}
                placeholder="যেমন: 🔥 মেগা ছাড়, বেস্ট সেলার..."
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#02050f] text-white"
              />
            </div>
          </div>

          {/* Duration & Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                কোর্সের মেয়াদ (Duration)
              </label>
              <input
                type="text"
                value={courseDuration}
                onChange={(e) => setCourseDuration(e.target.value)}
                placeholder="যেমন: ১২ সপ্তাহ (৩৬টি লাইভ ক্লাস)"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#02050f] text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                কোর্স লেভেল (Level)
              </label>
              <select
                value={courseLevel}
                onChange={(e) => setCourseLevel(e.target.value as any)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#02050f] text-white font-medium"
              >
                <option value="All Levels">All Levels (সকলের জন্য)</option>
                <option value="Beginner">Beginner (বিগিনার)</option>
                <option value="Intermediate">Intermediate (মিড লেভেল)</option>
                <option value="Advanced">Advanced (অ্যাডভান্সড)</option>
              </select>
            </div>
          </div>

          {/* Image Uploader Component */}
          <div className="pt-2 border-t border-blue-950">
            <ImageUploader
              label="কোর্সের ছবি / থাম্বনেইল (যেকোনো সাইজের ছবি গ্রহণযোগ্য)"
              value={thumbnail}
              onChange={(url) => setThumbnail(url)}
              aspectRatio="auto"
              hint="গ্যালারি থেকে আপনার যেকোনো সাইজের বা রেজুলিউশনের ছবি আপলোড করতে পারেন"
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              সংক্ষিপ্ত বিবরণ (Short Description)
            </label>
            <textarea
              rows={2}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="কোর্স কার্ডে প্রদর্শনের জন্য ১-২ লাইনের আকর্ষণীয় সারাংশ..."
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#02050f] text-white"
            />
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              বিস্তারিত বিবরণ (Full Description)
            </label>
            <textarea
              rows={4}
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              placeholder="কোর্সের বিস্তারিত তথ্য, সিলেবাস ও মেন্টর পরিচিতি..."
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#02050f] text-white"
            />
          </div>

          {/* What You Will Learn List */}
          <div className="space-y-2 pt-2 border-t border-blue-950">
            <label className="block text-xs font-bold text-slate-300">
              কী কী শিখবেন? (What You Will Learn)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newLearnItem}
                onChange={(e) => setNewLearnItem(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddLearnItem();
                  }
                }}
                placeholder="নতুন বিষয় লিখুন এবং 'যোগ করুন' চাপুন..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#02050f] text-white"
              />
              <button
                type="button"
                onClick={handleAddLearnItem}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                যোগ করুন
              </button>
            </div>
            {whatYouWillLearn.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {whatYouWillLearn.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 p-2 bg-[#02050f] rounded-lg text-xs border border-blue-950"
                  >
                    <span>✓ {item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveLearnItem(idx)}
                      className="text-red-400 hover:text-red-300 p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status & Featured Toggles */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-blue-950">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                পাবলিকেশন স্ট্যাটাস
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#02050f] text-white font-medium"
              >
                <option value="published">পাবলিশড (Live - ওয়েবসাইটে দেখাবে)</option>
                <option value="draft">ড্রাফট (Draft - লুকায়িত)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                ফিচার্ড কোর্স?
              </label>
              <select
                value={isFeatured ? 'yes' : 'no'}
                onChange={(e) => setIsFeatured(e.target.value === 'yes')}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#02050f] text-white font-medium"
              >
                <option value="yes">হ্যাঁ (হোমপেজে স্পটলাইটে থাকবে)</option>
                <option value="no">সাধারণ তালিকা</option>
              </select>
            </div>
          </div>

          {/* Submit & Delete Actions */}
          <div className="pt-4 border-t border-blue-950 flex flex-wrap items-center justify-between gap-3">
            {isEditing ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isSaving || isDeleting}
                className="px-4 py-2 bg-red-950/60 hover:bg-red-600 text-red-300 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-red-800/50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>কোর্সটি মুছে ফেলুন</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer border border-slate-700"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-linear-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer disabled:opacity-50 border border-blue-400/30"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>সংরক্ষণ হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{isEditing ? 'পরিবর্তন সংরক্ষণ করুন' : 'কোর্স যুক্ত করুন'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Delete Confirmation inside modal */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 z-20 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-linear-to-b from-[#020617] via-[#091535] to-[#020617] rounded-3xl p-6 border border-red-500/50 space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-red-950/80 text-red-400 border border-red-500/40 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-black text-white">কোর্সটি মুছে ফেলতে চান?</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                "{name}" কোর্সটি ডাটাবেস ও ওয়েবসাইট থেকে স্থায়ীভাবে ডিলিট করা হবে।
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={handleDeleteCurrentProduct}
                  disabled={isDeleting}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  <span>হ্যাঁ, ডিলিট করুন</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
