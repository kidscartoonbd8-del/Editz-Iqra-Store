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
  Check
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
      setDownloadSuccess('রসিদের ছবি (PNG Image) সফলভাবে ডাউনলোড হয়েছে!');
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (err) {
      console.error('Download Image failed:', err);
    }
  };

  const handlePrint = () => {
    try {
      // First try window.print
      window.print();
    } catch (err) {
      // If sandboxed in iframe, fallback to downloading HTML receipt with auto-print
      console.warn('window.print failed or was blocked by iframe sandbox, downloading HTML invoice instead:', err);
      handleDownloadFile();
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header (Hidden on print) */}
        <div className="no-print bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base">পেমেন্ট রসিদ ও ইনভয়েস</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadFile}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ডাউনলোড করুন</span>
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
          <div className="no-print bg-emerald-50 border-b border-emerald-200 px-5 py-2.5 text-xs text-emerald-800 font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* Printable Area */}
        <div id="printable-receipt" className="p-6 sm:p-8 bg-white text-slate-900 relative">
          {/* Subtle Watermark Stamp for Verified Status */}
          {isVerified && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-10 rotate-[-18deg] border-8 border-emerald-600 rounded-3xl p-6 text-center">
              <span className="text-5xl font-black tracking-widest text-emerald-700 uppercase">
                PAID & VERIFIED
              </span>
            </div>
          )}

          {/* Receipt Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-linear-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
                PS
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  ProjuktiShikha BD
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  অনলাইন স্কিল ডেভেলপমেন্ট ও লার্নিং প্ল্যাটফর্ম
                </p>
                <p className="text-[11px] text-slate-400">Dhaka, Bangladesh | support@projuktishikha.com</p>
              </div>
            </div>

            <div className="text-left sm:text-right bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">
                অফিসিয়াল পেমেন্ট স্লিপ
              </span>
              <span className="text-base font-mono font-bold text-emerald-700 block">
                #{order.id}
              </span>
              <span className="text-xs text-slate-500 block mt-0.5">{formattedDate}</span>
            </div>
          </div>

          {/* Status Alert Banner */}
          <div className="mt-5 mb-6">
            {isVerified ? (
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wide">
                    পেমেন্ট ভেরিফাইড (Payment Verified)
                  </h4>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    আপনার পেমেন্ট সফলভাবে নিশ্চিত করা হয়েছে। আপনার কোর্স ও রিসোর্সসমূহ আনলক হয়েছে।
                  </p>
                </div>
              </div>
            ) : isRejected ? (
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800">
                <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wide">পেমেন্ট রিজেক্টেড</h4>
                  <p className="text-xs text-red-700 mt-0.5">
                    {order.adminNote || 'প্রদত্ত TrxID যাচাই করা সম্ভব হয়নি। অনুগ্রহ করে সাপোর্টে যোগাযোগ করুন।'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
                <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wide">ভেরিফিকেশন অপেক্ষমান (Pending)</h4>
                  <p className="text-xs text-amber-700 mt-0.5">
                    পেমেন্ট তথ্য সাবমিট করা হয়েছে। অ্যাডমিন প্যানেল থেকে দ্রুত যাচাই করা হবে।
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Customer & Transaction Info */}
          <div className="grid grid-cols-2 gap-4 py-4 px-4 bg-slate-50 rounded-xl text-xs border border-slate-100">
            <div>
              <p className="text-slate-400 font-medium">শিক্ষার্থী / গ্রাহকের নাম</p>
              <p className="font-bold text-slate-800 mt-0.5 text-sm">{order.customerName}</p>
              <p className="text-slate-500 font-mono mt-0.5">{order.customerPhone}</p>
              {order.customerEmail && <p className="text-slate-500">{order.customerEmail}</p>}
            </div>

            <div className="border-l border-slate-200 pl-4">
              <p className="text-slate-400 font-medium">পেমেন্ট মেথড ও আইডি</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold text-white ${
                  order.paymentMethod === 'bKash' ? 'bg-[#e2136e]' : 'bg-[#f7941d]'
                }`}>
                  {order.paymentMethod}
                </span>
                <span className="font-semibold text-slate-700">Send Money</span>
              </div>
              <p className="text-slate-400 font-medium mt-1">Transaction ID (TrxID)</p>
              <p className="font-mono font-bold text-slate-900 bg-white px-2 py-1 rounded border border-slate-200 inline-block mt-0.5">
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
                  <td className="py-2.5 px-4 text-right font-extrabold text-emerald-700 text-base">
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
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Verified E-Receipt • ProjuktiShikha BD</span>
            </div>
          </div>
        </div>

        {/* Action Buttons Footer (No Print) */}
        <div className="no-print bg-slate-50 p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
          <span className="text-xs text-slate-500 hidden sm:inline">
            Order: <strong className="font-mono text-slate-800">{order.id}</strong>
          </span>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Download as HTML / Printable PDF */}
            <button
              onClick={handleDownloadFile}
              className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>রসিদ ডাউনলোড (HTML/PDF)</span>
            </button>

            {/* Download as Image PNG */}
            <button
              onClick={handleDownloadImage}
              className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all"
            >
              <FileImage className="w-4 h-4" />
              <span>ছবি হিসেবে সেভ (PNG)</span>
            </button>

            {/* Print Direct */}
            <button
              onClick={handlePrint}
              className="p-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              title="প্রিন্ট করুন"
            >
              <Printer className="w-4 h-4" />
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
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
