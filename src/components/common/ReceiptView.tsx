import React, { useState } from 'react';
import { Order } from '../../types/index.ts';
import {
  Download,
  CheckCircle,
  Clock,
  XCircle,
  Printer,
  X,
  ShieldCheck,
  Sparkles,
  FileImage,
  FileText,
  Check,
  Share2
} from 'lucide-react';
import { downloadReceiptHtml, downloadReceiptImage } from '../../utils/receiptGenerator.ts';

interface ReceiptViewProps {
  order: Order;
  onClose?: () => void;
}

export const ReceiptView: React.FC<ReceiptViewProps> = ({ order, onClose }) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownloadFile = () => {
    try {
      downloadReceiptHtml(order);
      setDownloadSuccess('রসিদটি HTML/PDF হিসেবে সফলভাবে ডাউনলোড হয়েছে!');
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (err) {
      console.error('Download HTML failed:', err);
    }
  };

  const handleDownloadImage = () => {
    try {
      downloadReceiptImage(order);
      setDownloadSuccess('রসিদের ছবি (PNG Image) আপনার ডিভাইসে সফলভাবে সেভ হয়েছে!');
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (err) {
      console.error('Download Image failed:', err);
    }
  };

  const handlePrint = () => {
    try {
      // Direct window.print
      window.print();
      setDownloadSuccess('প্রিন্ট ডায়ালগ চালু করা হয়েছে (অথবা নিচের ডাউনলোড বাটন ব্যবহার করুন)');
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (err) {
      console.warn('window.print blocked or restricted, triggering direct PNG image download:', err);
      handleDownloadImage();
    }
  };

  const isVerified = order.status === 'Payment Verified' || order.status === 'Completed';
  const isRejected = order.status === 'Payment Rejected';

  const formattedDate = new Date(order.createdAt).toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-xl bg-slate-950 rounded-3xl shadow-2xl border border-blue-900/60 overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header with Blue & Black Gradient (Hidden on print) */}
        <div className="no-print bg-linear-to-r from-black via-blue-950 to-black text-white px-5 py-4 flex items-center justify-between border-b border-blue-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">অফিসিয়াল পেমেন্ট রসিদ</h3>
              <p className="text-[11px] text-blue-300/80">ProjuktiShikha BD Verified Invoice</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadImage}
              className="px-3 py-1.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all cursor-pointer border border-blue-400/30"
              title="ছবি হিসেবে ডাউনলোড করুন"
            >
              <FileImage className="w-3.5 h-3.5" />
              <span>ডাউনলোড (PNG)</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {downloadSuccess && (
          <div className="no-print bg-blue-950/90 border-b border-blue-800 px-5 py-2.5 text-xs text-blue-200 font-bold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-cyan-400" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* Printable White Receipt Area */}
        <div id="printable-receipt" className="p-6 sm:p-8 bg-white text-slate-900 relative">
          {/* Subtle Watermark Stamp for Verified Status */}
          {isVerified && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-10 rotate-[-18deg] border-8 border-blue-600 rounded-3xl p-6 text-center">
              <span className="text-5xl font-black tracking-widest text-blue-800 uppercase">
                PAID & VERIFIED
              </span>
            </div>
          )}

          {/* Receipt Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-linear-to-tr from-blue-900 via-blue-700 to-blue-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
                PS
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Projukti<span className="text-blue-600">Shikha</span> BD
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  অনলাইন স্কিল ডেভেলপমেন্ট ও লার্নিং প্ল্যাটফর্ম
                </p>
                <p className="text-[10px] text-slate-400">ঢাকা, বাংলাদেশ • ভেরিফাইড ই-রসিদ</p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Official E-Receipt
              </span>
              <p className="text-base font-extrabold text-blue-700 font-mono">#{order.id}</p>
              <p className="text-xs text-slate-500 mt-0.5">{formattedDate}</p>
            </div>
          </div>

          {/* Verification Status Banner */}
          <div className="mt-5">
            {isVerified ? (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-2.5 text-xs text-blue-800 font-bold">
                <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  পেমেন্ট সফলভাবে ভেরিফাইড হয়েছে (Payment Verified)। আপনার কোর্সটি একটিভ!
                </span>
              </div>
            ) : isRejected ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2.5 text-xs text-red-800 font-bold">
                <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>
                  পেমেন্ট বাতিল করা হয়েছে (Payment Rejected)। তথ্যে অমিল থাকলে সাপোর্টে যোগাযোগ করুন।
                </span>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2.5 text-xs text-amber-800 font-bold">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  পেমেন্ট যাচাই প্রক্রিয়াধীন (Verification Pending)। শীঘ্রই TrxID কনফার্ম করা হবে।
                </span>
              </div>
            )}
          </div>

          {/* Admin Note if any */}
          {order.adminNote && (
            <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700">
              <strong className="text-slate-900">অ্যাডমিন নোট:</strong> {order.adminNote}
            </div>
          )}

          {/* Customer & Transaction Breakdown */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4 border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                গ্রাহকের নাম ও ফোন
              </span>
              <p className="font-bold text-slate-800 text-sm mt-0.5">{order.customerName}</p>
              <p className="text-slate-600 font-mono mt-0.5">{order.customerPhone}</p>
              {order.customerEmail && (
                <p className="text-slate-500 font-sans mt-0.5">{order.customerEmail}</p>
              )}
            </div>

            <div>
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                পেমেন্ট মেথড ও Transaction ID
              </span>
              <p className="font-bold text-slate-800 text-sm mt-0.5 flex items-center gap-1.5">
                <span
                  className={
                    order.paymentMethod === 'bKash' ? 'text-[#e2136e]' : 'text-[#f7941d]'
                  }
                >
                  {order.paymentMethod}
                </span>
                <span>Send Money</span>
              </p>
              <p className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 inline-block font-bold text-slate-800 mt-1">
                {order.transactionId}
              </p>
            </div>
          </div>

          {/* Purchased Item Table */}
          <div className="mt-6 border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 font-bold">কোর্স / আইটেম বিবরণ</th>
                  <th className="py-2.5 px-4 font-bold text-center">মেয়াদ</th>
                  <th className="py-2.5 px-4 font-bold text-right">মূল্য (টাকা)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-800 text-sm">{order.productName}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      সার্টিফিকেট + লাইফটাইম এক্সেস + মেন্টর সাপোর্ট
                    </p>
                  </td>
                  <td className="py-3 px-4 text-center font-medium text-slate-600">
                    আজীবন
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900 text-sm">
                    ৳{order.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50 border-t border-slate-200">
                <tr>
                  <td colSpan={2} className="py-2.5 px-4 text-right font-bold text-slate-700">
                    সর্বমোট পরিশোধিত (Total Paid):
                  </td>
                  <td className="py-2.5 px-4 text-right font-extrabold text-blue-700 text-base">
                    ৳{order.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Footer Notes */}
          <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-3">
            <div>
              <p className="font-medium text-slate-500">
                যেকোনো প্রয়োজনে যোগাযোগ: WhatsApp: 01890-000000
              </p>
              <p>এই রসিদটি কম্পিউটার জেনারেটেড এবং কোনো শারীরিক স্বাক্ষরের প্রয়োজন নেই।</p>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>Verified E-Receipt • ProjuktiShikha BD</span>
            </div>
          </div>
        </div>

        {/* Action Buttons Footer (No Print) with Blue & Black Gradient */}
        <div className="no-print bg-linear-to-r from-black via-blue-950 to-black p-4 border-t border-blue-900/60 flex flex-wrap items-center justify-between gap-2.5">
          <span className="text-xs text-slate-400 hidden sm:inline">
            Order: <strong className="font-mono text-blue-300">{order.id}</strong>
          </span>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Download as Image PNG (Most reliable for mobile & PC) */}
            <button
              onClick={handleDownloadImage}
              className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/30 cursor-pointer transition-all border border-blue-400/20"
              title="গ্যালারি বা ডাউনলোডে ছবি হিসেবে সেভ করুন"
            >
              <FileImage className="w-4 h-4" />
              <span>ছবি ডাউনলোড (PNG)</span>
            </button>

            {/* Print Direct / Save as PDF */}
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-blue-200 border border-blue-800/60 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all"
              title="প্রিন্ট করুন বা PDF হিসেবে সেভ করুন"
            >
              <Printer className="w-4 h-4 text-blue-400" />
              <span>প্রিন্ট / PDF সেভ</span>
            </button>

            {/* Download as HTML */}
            <button
              onClick={handleDownloadFile}
              className="p-2.5 bg-blue-950/80 hover:bg-blue-900 text-blue-300 border border-blue-800/40 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              title="HTML ফাইল ডাউনলোড"
            >
              <Download className="w-4 h-4" />
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                বন্ধ করুন
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
