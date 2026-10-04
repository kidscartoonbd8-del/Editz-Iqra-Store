import { Order } from '../types/index.ts';

function safeRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  if (typeof (ctx as any).roundRect === 'function') {
    (ctx as any).roundRect(x, y, w, h, r);
  } else {
    // Fallback manual rounded rectangle
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}

/**
 * Generates an official, printable HTML document for the receipt and triggers an immediate download.
 */
export function downloadReceiptHtml(order: Order) {
  const isVerified = order.status === 'Payment Verified' || order.status === 'Completed';
  const isRejected = order.status === 'Payment Rejected';
  const formattedDate = new Date(order.createdAt).toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const htmlContent = `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Receipt-${order.id} - ProjuktiShikha BD</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&family=Plus+Jakarta+Sans:wght@500;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', 'Hind Siliguri', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #020617;
      color: #0f172a;
      padding: 30px 15px;
      display: flex;
      justify-content: center;
      min-height: 100vh;
    }
    .receipt-card {
      max-width: 680px;
      width: 100%;
      background: #ffffff;
      border: 1px solid #1e293b;
      border-radius: 20px;
      padding: 36px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
      position: relative;
      height: fit-content;
    }
    .top-bar {
      height: 8px;
      background: linear-gradient(90deg, #1d4ed8, #3b82f6, #0284c7);
      border-radius: 10px 10px 0 0;
      margin: -36px -36px 28px -36px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }
    .brand-title {
      font-size: 22px;
      font-weight: 800;
      background: linear-gradient(135deg, #1e3a8a, #2563eb);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.5px;
    }
    .brand-subtitle {
      font-size: 12px;
      color: #64748b;
      margin-top: 3px;
    }
    .receipt-id-box {
      text-align: right;
    }
    .receipt-badge {
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.5px;
    }
    .receipt-number {
      font-size: 18px;
      font-weight: 800;
      font-family: monospace;
      color: #0f172a;
    }
    .status-alert {
      padding: 12px 16px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .status-verified {
      background: #eff6ff;
      color: #1e40af;
      border: 1px solid #bfdbfe;
    }
    .status-pending {
      background: #fffbeb;
      color: #92400e;
      border: 1px solid #fde68a;
    }
    .status-rejected {
      background: #fef2f2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 18px;
      margin-bottom: 24px;
    }
    .info-label {
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 700;
      color: #64748b;
      margin-bottom: 3px;
    }
    .info-val {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
    }
    .table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    .table th {
      background: #f1f5f9;
      font-size: 12px;
      font-weight: 700;
      color: #475569;
      padding: 10px 14px;
      text-align: left;
      border-top: 1px solid #e2e8f0;
      border-bottom: 1px solid #e2e8f0;
    }
    .table td {
      padding: 14px;
      border-bottom: 1px solid #f1f5f9;
      font-size: 13px;
    }
    .total-row td {
      border-top: 2px solid #cbd5e1;
      border-bottom: none;
      font-size: 15px;
      font-weight: 800;
      color: #1e3a8a;
      padding-top: 16px;
    }
    .print-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 24px;
    }
    .btn {
      padding: 10px 18px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      border: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
    }
    .btn-print {
      background: linear-gradient(135deg, #1d4ed8, #2563eb);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(37,99,235,0.3);
    }
    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-20deg);
      font-size: 44px;
      font-weight: 900;
      color: rgba(37, 99, 235, 0.08);
      text-transform: uppercase;
      letter-spacing: 4px;
      pointer-events: none;
      border: 5px dashed rgba(37, 99, 235, 0.15);
      padding: 14px 28px;
      border-radius: 16px;
    }
    @media print {
      body { background: white; padding: 0; color: black; }
      .receipt-card { box-shadow: none; border: none; padding: 10px; }
      .print-actions { display: none !important; }
      .top-bar { margin: -10px -10px 20px -10px; }
    }
  </style>
</head>
<body>
  <div class="receipt-card">
    <div class="top-bar"></div>
    ${isVerified ? '<div class="watermark">PAID & VERIFIED</div>' : ''}

    <div class="header">
      <div>
        <div class="brand-title">ProjuktiShikha BD</div>
        <div class="brand-subtitle">অনলাইন লার্নিং ও স্কিল ডেভেলপমেন্ট প্ল্যাটফর্ম</div>
        <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">ঢাকা, বাংলাদেশ • ProjuktiShikha BD Official</div>
      </div>
      <div class="receipt-id-box">
        <div class="receipt-badge">Official E-Receipt</div>
        <div class="receipt-number">#${order.id}</div>
        <div style="font-size: 11px; color: #64748b; margin-top: 2px;">${formattedDate}</div>
      </div>
    </div>

    <div class="status-alert ${isVerified ? 'status-verified' : isRejected ? 'status-rejected' : 'status-pending'}">
      ${
        isVerified
          ? '✓ পেমেন্ট ভেরিফাইড (Payment Verified) — আপনার কোর্স সফলভাবে অ্যাক্টিভ হয়েছে।'
          : isRejected
          ? '✗ পেমেন্ট রিজেক্টেড (Payment Rejected) — অনুগ্রহ করে সাপোর্টে যোগাযোগ করুন।'
          : '⏳ ভেরিফিকেশন অপেক্ষমান (Pending) — অ্যাডমিন শীঘ্রই TrxID যাচাই সম্পন্ন করবে।'
      }
    </div>

    <div class="info-grid">
      <div>
        <div class="info-label">গ্রাহকের নাম</div>
        <div class="info-val">${order.customerName}</div>
        <div style="color: #64748b; font-family: monospace; font-size: 12px; margin-top: 2px;">${order.customerPhone}</div>
      </div>
      <div>
        <div class="info-label">পেমেন্ট মেথড ও TrxID</div>
        <div class="info-val" style="color: ${order.paymentMethod === 'bKash' ? '#e2136e' : '#f7941d'}">${order.paymentMethod} Send Money</div>
        <div style="background: white; border: 1px solid #cbd5e1; display: inline-block; padding: 2px 6px; border-radius: 6px; font-family: monospace; font-size: 12px; margin-top: 3px;">
          ${order.transactionId}
        </div>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>আইটেম / কোর্স বিবরণ</th>
          <th style="text-align: center;">অ্যাক্সেস</th>
          <th style="text-align: right;">মূল্য (টাকা)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>${order.productName}</strong>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">সার্টিফিকেট + লাইফটাইম কোর্স অ্যাক্সেস + সাপোর্ট</div>
          </td>
          <td style="text-align: center; color: #475569; font-weight: 600;">আজীবন</td>
          <td style="text-align: right; font-weight: 700; color: #0f172a;">৳${order.amount.toLocaleString('en-IN')}</td>
        </tr>
        <tr class="total-row">
          <td colspan="2" style="text-align: right;">সর্বমোট পরিশোধিত (Total Paid):</td>
          <td style="text-align: right; font-size: 18px; color: #1d4ed8;">৳${order.amount.toLocaleString('en-IN')}</td>
        </tr>
      </tbody>
    </table>

    ${
      order.adminNote
        ? `<div style="background: #f1f5f9; padding: 12px; border-radius: 8px; font-size: 12px; color: #334155; margin-bottom: 20px;">
            <strong>অ্যাডমিন নোট:</strong> ${order.adminNote}
          </div>`
        : ''
    }

    <div style="font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 16px; display: flex; justify-content: space-between; align-items: center;">
      <div>এই রসিদটি কম্পিউটার দ্বারা স্বয়ংক্রিয়ভাবে তৈরি হয়েছে। কোনো শারীরিক স্বাক্ষরের প্রয়োজন নেই।</div>
      <div style="font-weight: 700; color: #2563eb;">ProjuktiShikha BD</div>
    </div>

    <div class="print-actions">
      <button class="btn btn-print" onclick="window.print()">
        🖨️ প্রিন্ট করুন / Save as PDF
      </button>
    </div>
  </div>
</body>
</html>`;

  // Create blob and trigger direct download
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Receipt-${order.id}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/**
 * Generates an official high-resolution PNG image of the receipt and triggers an immediate download.
 * Saves directly into Gallery / Downloads on phone and desktop.
 */
export function downloadReceiptImage(order: Order) {
  const canvas = document.createElement('canvas');
  const width = 800;
  const height = 1040;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Top Blue Gradient Accent Bar
  const grad = ctx.createLinearGradient(0, 0, width, 0);
  grad.addColorStop(0, '#0f172a');
  grad.addColorStop(0.5, '#2563eb');
  grad.addColorStop(1, '#0284c7');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, 16);

  // Outer Border
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 3;
  ctx.strokeRect(12, 12, width - 24, height - 24);

  // Header Logo Box with Blue & Black Gradient
  const logoGrad = ctx.createLinearGradient(40, 45, 100, 105);
  logoGrad.addColorStop(0, '#020617');
  logoGrad.addColorStop(1, '#2563eb');
  ctx.fillStyle = logoGrad;
  safeRoundRect(ctx, 40, 45, 60, 60, 14);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText('PS', 54, 85);

  // Brand Name
  ctx.fillStyle = '#020617';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText('ProjuktiShikha BD', 115, 75);

  ctx.fillStyle = '#64748b';
  ctx.font = '14px sans-serif';
  ctx.fillText('অনলাইন লার্নিং ও স্কিল ডেভেলপমেন্ট প্ল্যাটফর্ম | Dhaka, Bangladesh', 115, 98);

  // Receipt Number
  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('OFFICIAL RECEIPT', 580, 65);

  ctx.fillStyle = '#1e40af';
  ctx.font = 'bold 24px monospace';
  ctx.fillText(`#${order.id}`, 580, 95);

  // Divider
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, 130);
  ctx.lineTo(760, 130);
  ctx.stroke();

  // Status Banner
  const isVerified = order.status === 'Payment Verified' || order.status === 'Completed';
  const isRejected = order.status === 'Payment Rejected';

  ctx.fillStyle = isVerified ? '#eff6ff' : isRejected ? '#fef2f2' : '#fffbeb';
  safeRoundRect(ctx, 40, 150, 720, 50, 10);
  ctx.fill();

  ctx.strokeStyle = isVerified ? '#bfdbfe' : isRejected ? '#fecaca' : '#fde68a';
  ctx.lineWidth = 1.5;
  safeRoundRect(ctx, 40, 150, 720, 50, 10);
  ctx.stroke();

  ctx.fillStyle = isVerified ? '#1d4ed8' : isRejected ? '#b91c1c' : '#b45309';
  ctx.font = 'bold 16px sans-serif';
  const statusMsg = isVerified
    ? '✓ পেমেন্ট ভেরিফাইড (Payment Verified) — কোর্স সফলভাবে অ্যাক্টিভ হয়েছে।'
    : isRejected
    ? '✗ পেমেন্ট রিজেক্টেড (Payment Rejected) — সাপোর্টে যোগাযোগ করুন।'
    : '⏳ ভেরিফিকেশন অপেক্ষমান (Verification Pending) — TrxID যাচাই চলছে।';
  ctx.fillText(statusMsg, 60, 182);

  // Customer & Payment Info Box
  ctx.fillStyle = '#f8fafc';
  safeRoundRect(ctx, 40, 220, 720, 120, 12);
  ctx.fill();
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  safeRoundRect(ctx, 40, 220, 720, 120, 12);
  ctx.stroke();

  // Column 1: Customer Info
  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('গ্রাহকের নাম (CUSTOMER NAME)', 60, 250);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText(order.customerName, 60, 278);

  ctx.fillStyle = '#64748b';
  ctx.font = '14px monospace';
  ctx.fillText(`মোবাইল: ${order.customerPhone}`, 60, 305);
  if (order.customerEmail) {
    ctx.fillText(`ইমেইল: ${order.customerEmail}`, 60, 325);
  }

  // Column 2: Payment Method & TrxID
  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('পেমেন্ট মেথড ও TRX ID', 420, 250);

  ctx.fillStyle = order.paymentMethod === 'bKash' ? '#e2136e' : '#f7941d';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText(`${order.paymentMethod} Send Money`, 420, 278);

  ctx.fillStyle = '#ffffff';
  safeRoundRect(ctx, 420, 290, 240, 32, 6);
  ctx.fill();
  ctx.strokeStyle = '#cbd5e1';
  safeRoundRect(ctx, 420, 290, 240, 32, 6);
  ctx.stroke();

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 15px monospace';
  ctx.fillText(`TrxID: ${order.transactionId}`, 430, 312);

  // Purchased Item Section
  ctx.fillStyle = '#f1f5f9';
  safeRoundRect(ctx, 40, 365, 720, 40, 8);
  ctx.fill();

  ctx.fillStyle = '#475569';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('আইটেম / কোর্স বিবরণ', 60, 390);
  ctx.fillText('মেয়াদ', 480, 390);
  ctx.fillText('মূল্য (BDT)', 660, 390);

  // Item Row
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 17px sans-serif';
  const truncatedProductName =
    order.productName.length > 38 ? order.productName.substring(0, 36) + '...' : order.productName;
  ctx.fillText(truncatedProductName, 60, 440);

  ctx.fillStyle = '#64748b';
  ctx.font = '13px sans-serif';
  ctx.fillText('সার্টিফিকেট + লাইফটাইম এক্সেস + মেন্টর সাপোর্ট', 60, 465);

  ctx.fillStyle = '#475569';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('আজীবন', 480, 445);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText(`৳${order.amount.toLocaleString('en-IN')}`, 660, 445);

  // Line before Total
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(40, 500);
  ctx.lineTo(760, 500);
  ctx.stroke();

  // Total Paid Row
  ctx.fillStyle = '#f8fafc';
  safeRoundRect(ctx, 40, 515, 720, 60, 8);
  ctx.fill();

  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('সর্বমোট পরিশোধিত (TOTAL PAID):', 360, 552);

  ctx.fillStyle = '#1d4ed8';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText(`৳${order.amount.toLocaleString('en-IN')}`, 650, 552);

  // Order Timestamp & ID
  ctx.fillStyle = '#64748b';
  ctx.font = '13px sans-serif';
  const formattedDate = new Date(order.createdAt).toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  ctx.fillText(`তারিখ ও সময়: ${formattedDate}`, 60, 615);
  ctx.fillText(`অর্ডার ট্র্যাকিং আইডি: ${order.id}`, 60, 640);

  // Stamp if verified
  if (isVerified) {
    ctx.save();
    ctx.translate(400, 720);
    ctx.rotate(-0.15);
    ctx.strokeStyle = 'rgba(29, 78, 216, 0.25)';
    ctx.lineWidth = 6;
    safeRoundRect(ctx, -160, -45, 320, 90, 16);
    ctx.stroke();

    ctx.fillStyle = 'rgba(29, 78, 216, 0.25)';
    ctx.font = 'bold 30px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PAID & VERIFIED', 0, 10);
    ctx.restore();
  }

  // Footer notes
  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px sans-serif';
  ctx.fillText('যেকোনো প্রয়োজনে যোগাযোগ: WhatsApp: 01890-000000 | ProjuktiShikha BD Support', 60, 970);
  ctx.fillText('এই রসিদটি কম্পিউটার দ্বারা স্বয়ংক্রিয়ভাবে তৈরি হয়েছে।', 60, 995);

  // Export to image download
  const image = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = image;
  link.download = `Receipt-${order.id}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
