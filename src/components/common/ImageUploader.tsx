import React, { useRef, useState } from 'react';
import { Upload, X, RefreshCw, Image as ImageIcon, Loader2 } from 'lucide-react';
import { optimizeImage } from '../../services/imageOptimizer.ts';
import { ApiService } from '../../services/api.ts';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  aspectRatio?: 'square' | 'video' | 'banner';
  hint?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  value,
  onChange,
  aspectRatio = 'video',
  hint = 'গ্যালারি বা ফাইল থেকে ছবি সিলেক্ট করুন (Android ও PC সাপোর্টেড)'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'banner'
      ? 'aspect-21/9'
      : 'aspect-16/9';

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsProcessing(true);

    try {
      // 1. Client-side canvas compression for mobile gallery / camera photos
      const optimizedDataUrl = await optimizeImage(file, 1600, 1600, 0.85);

      // 2. Upload to server persistent storage
      const uploadedUrl = await ApiService.adminUploadImage(optimizedDataUrl, file.name);
      onChange(uploadedUrl);
    } catch (err: any) {
      console.error('Image upload failed:', err);
      setError(err.message || 'ছবি আপলোড করতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-slate-700">{label}</label>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        <div className={`relative group w-full ${aspectClass} rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs`}>
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
          />

          {/* Action Overlay */}
          <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="px-3 py-1.5 bg-white text-slate-800 rounded-lg text-xs font-semibold shadow-md flex items-center gap-1.5 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              ছবি পরিবর্তন
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={isProcessing}
              className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold shadow-md flex items-center gap-1.5 hover:bg-red-700 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              মুছে ফেলুন
            </button>
          </div>

          {/* Mobile visible action buttons badge */}
          <div className="md:hidden absolute top-2 right-2 flex gap-1.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 bg-white/90 text-slate-800 rounded-lg text-xs shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 bg-red-600/90 text-white rounded-lg text-xs shadow-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {isProcessing && (
            <div className="absolute inset-0 bg-slate-900/70 flex flex-col items-center justify-center text-white text-xs gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
              <span>ছবি অপটিমাইজ ও আপলোড হচ্ছে...</span>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => !isProcessing && fileInputRef.current?.click()}
          className={`w-full ${aspectClass} border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl bg-slate-50/70 hover:bg-emerald-50/30 flex flex-col items-center justify-center p-4 cursor-pointer transition-colors text-center group`}
        >
          {isProcessing ? (
            <div className="flex flex-col items-center gap-2 text-slate-600">
              <Loader2 className="w-7 h-7 animate-spin text-emerald-600" />
              <span className="text-xs font-medium">ছবি আপলোড হচ্ছে...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-500 group-hover:text-emerald-700 transition-colors">
              <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center group-hover:border-emerald-300 group-hover:bg-emerald-50">
                <Upload className="w-5 h-5 text-slate-600 group-hover:text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700 group-hover:text-emerald-800">
                  ডিভাইস / গ্যালারি থেকে ছবি আপলোড করুন
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">{hint}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
};
