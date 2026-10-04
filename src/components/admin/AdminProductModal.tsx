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

  const handleAddFeature = () => {
    if (!newFeatureItem.trim()) return;
    setFeatures([...features, newFeatureItem.trim()]);
    setNewFeatureItem('');
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('কোর্স বা প্রোডাক্টের নাম প্রদান করুন।');
      return;
    }
    if (numCurrent <= 0) {
      setError('বর্তমান মূল্য শূন্যের বেশি হতে হবে।');
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
        images: thumbnail ? [thumbnail] : [],
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
      setError(err.message || 'সংরক্ষণ ব্যর্থ হয়েছে।');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <h3 className="font-bold text-base">
            {isEditing ? 'কোর্স / প্রোডাক্ট এডিট করুন' : 'নতুন কোর্স / প্রোডাক্ট যুক্ত করুন'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Product Thumbnail with Gallery Picker */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <ImageUploader
              label="কোর্স থাম্বনেইল / পোস্টার (Thumbnail Upload)"
              value={thumbnail}
              onChange={setThumbnail}
              aspectRatio="video"
              hint="আপনার ফোন গ্যালারি বা কম্পিউটার থেকে সরাসরি সিলেক্ট করুন"
            />
          </div>

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                কোর্স বা প্রোডাক্টের নাম *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: কমপ্লিট ফুল-স্ট্যাক ওয়েব ডেভেলপমেন্ট"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ক্যাটাগরি *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="Web Development">Web Development</option>
                <option value="Language & IELTS">Language & IELTS</option>
                <option value="Design & Creative">Design & Creative</option>
                <option value="Freelancing">Freelancing</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Software & Tools">Software & Tools</option>
              </select>
            </div>
          </div>

          {/* Pricing Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                বর্তমান মূল্য (৳ BDT) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                className="w-full px-3 py-2 text-sm font-bold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                পূর্ববর্তী / আসল মূল্য (৳ BDT)
              </label>
              <input
                type="number"
                min="0"
                value={previousPrice}
                onChange={(e) => setPreviousPrice(e.target.value)}
                placeholder="রেগুলার প্রাইস"
                className="w-full px-3 py-2 text-sm font-bold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ডিসকাউন্ট শতকরা (%)
              </label>
              <div className="px-3 py-2 bg-emerald-100/60 rounded-xl border border-emerald-200 text-sm font-extrabold text-emerald-800 flex items-center justify-between">
                <span>{calculatedDiscount}% OFF</span>
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Short & Full Description */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                সংক্ষিপ্ত বিবরণ (Short Description)
              </label>
              <textarea
                rows={2}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="১-২ লাইনে কোর্সের মূল আকর্ষণ লিখুন..."
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                পূর্ণাঙ্গ বিবরণ ও সিলেবাস (Full Description)
              </label>
              <textarea
                rows={4}
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
                placeholder="কোর্সের বিস্তারিত তথ্য, ক্লাস সংখ্যা এবং সুযোগ-সুবিধা লিখুন..."
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
          </div>

          {/* Duration, Level & Offer Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                কোর্স ব্যাপ্তি (Duration)
              </label>
              <input
                type="text"
                value={courseDuration}
                onChange={(e) => setCourseDuration(e.target.value)}
                placeholder="যেমন: ৮ সপ্তাহ (২৪টি ক্লাস)"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                লেভেল (Level)
              </label>
              <select
                value={courseLevel}
                onChange={(e) => setCourseLevel(e.target.value as any)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="All Levels">All Levels</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                অফার ব্যাজ (Offer Badge)
              </label>
              <input
                type="text"
                value={offerBadge}
                onChange={(e) => setOfferBadge(e.target.value)}
                placeholder="যেমন: 🔥 বেস্ট সেলার"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
          </div>

          {/* What Students Will Learn */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              শিক্ষার্থীরা যা যা শিখবে (What You Will Learn)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newLearnItem}
                onChange={(e) => setNewLearnItem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLearnItem())}
                placeholder="একটি বিষয় লিখে '+' চাপুন"
                className="flex-1 px-3 py-1.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
              <button
                type="button"
                onClick={handleAddLearnItem}
                className="px-3 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {whatYouWillLearn.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-xs text-slate-700 border border-slate-200">
                  <span className="truncate">{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveLearnItem(idx)}
                    className="text-slate-400 hover:text-red-600 p-0.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Course Features */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              কোর্সের সুবিধাসমূহ (Features: যেমন লাইফটাইম এক্সেস, সার্টিফিকেট)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newFeatureItem}
                onChange={(e) => setNewFeatureItem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                placeholder="যেমন: লাইফটাইম কোর্স এক্সেস"
                className="flex-1 px-3 py-1.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-3 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {features.map((feat, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-700 flex items-center gap-1.5 border border-slate-200"
                >
                  <span>{feat}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-slate-400 hover:text-red-600 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Status & Featured Toggles */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                পাবলিকেশন স্ট্যাটাস
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
              >
                <option value="published">পাবলিশড (Published - ওয়েবসাইটে দৃশ্যমান)</option>
                <option value="draft">ড্রাফট (Draft - লুকায়িত)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ফিচার্ড কোর্স?
              </label>
              <select
                value={isFeatured ? 'yes' : 'no'}
                onChange={(e) => setIsFeatured(e.target.value === 'yes')}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
              >
                <option value="yes">হ্যাঁ (হোমপেজে স্পটলাইটে থাকবে)</option>
                <option value="no">সাধারণ তালিকা</option>
              </select>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
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
        </form>
      </div>
    </div>
  );
};
