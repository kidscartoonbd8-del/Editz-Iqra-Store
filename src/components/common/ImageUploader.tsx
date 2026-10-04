import React, { useRef, useState, useEffect } from 'react';
import { Upload, X, RefreshCw, Image as ImageIcon, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { optimizeImage } from '../../services/imageOptimizer.ts';
import { ApiService } from '../../services/api.ts';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  aspectRatio?: 'square' | 'video' | 'banner' | 'auto';
  hint?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  value,
  onChange,
  aspectRatio = 'auto',
  hint = 'যেকোনো সাইজের ছবি (Portrait, Landscape বা Banner) আপলোড করুন — আসল সাইজ বজায় থাকবে'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    if (value) {
      const img = new Image();
      img.onload = () => {
        setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = value;
    } else {
      setDimensions(null);
    }
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsProcessing(true);

    try {
      // Retain natural aspect ratio and resolution
      const optimizedDataUrl = await optimizeImage(file, 2600, 2600, 0.90);

      // Upload to server persistent storage
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
    setDimensions(null);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-200">{label}</label>
        {dimensions && (
          <span className="text-[10px] font-mono font-bold bg-blue-950/80 text-blue-300 border border-blue-800/50 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
            <span>আসল সাইজ: {dimensions.width} × {dimensions.height} px</span>
          </span>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        <div className="relative group w-full min-h-[160px] max-h-[420px] rounded-2xl overflow-hidden border border-blue-900/60 bg-linear-to-b from-[#020617] via-[#040d24] to-[#020617] shadow-lg flex items-center justify-center p-3">
          <img
            src={value}
            alt="Preview"
            className="max-h-[390px] w-auto max-w-full object-contain rounded-xl transition-transform duration-300 group-hover:scale-101"
          />

          {/* Action Overlay */}
          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-xs">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="px-3.5 py-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition-all cursor-pointer border border-blue-400/30"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              ছবি পরিবর্তন
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={isProcessing}
              className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5 transition-colors cursor-pointer border border-red-400/30"
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
              className="p-1.5 bg-blue-600 text-white rounded-lg text-xs shadow-md border border-blue-400/30"
              title="পরিবর্তন করুন"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 bg-red-600 text-white rounded-lg text-xs shadow-md border border-red-400/30"
              title="মুছে ফেলুন"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {isProcessing && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white text-xs gap-2 backdrop-blur-xs">
              <Loader2 className="w-7 h-7 animate-spin text-blue-400" />
              <span className="font-semibold">ছবি অপটিমাইজ ও আপলোড হচ্ছে...</span>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => !isProcessing && fileInputRef.current?.click()}
          className="w-full min-h-[140px] border-2 border-dashed border-blue-900/70 hover:border-blue-500 rounded-2xl bg-linear-to-b from-[#020617] via-[#040e26] to-[#020617] hover:bg-blue-950/30 flex flex-col items-center justify-center p-5 cursor-pointer transition-all text-center group shadow-inner"
        >
          {isProcessing ? (
            <div className="flex flex-col items-center gap-2 text-slate-300">
              <Loader2 className="w-7 h-7 animate-spin text-blue-400" />
              <span className="text-xs font-bold">ছবি আপলোড হচ্ছে...</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-blue-600/20 transition-all shadow-md">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">
                  ক্লিক করে ছবি আপলোড করুন
                </p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-sm">
                  {hint}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-400 font-semibold bg-red-950/40 p-2 rounded-xl border border-red-900/50">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
};
