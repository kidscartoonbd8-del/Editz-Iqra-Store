import { Order } from '../types/index.ts';

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
  <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&family=Plus+Jakarta+Sans:wght@500;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', 'Hind Siliguri', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #f8fafc;
      color: #0f172a;
      padding: 30px 15px;
      display: flex;
      justify-content: center;
    }
    .receipt-card {
      max-width: 650px;
      width: 100%;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      padding: 36px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.06);
      position: relative;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #f1f5f9;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }
    .brand-title {
      font-size: 22px;
      font-weight: 800;
      color: #047857;
      letter-spacing: -0.5px;
    }
    .brand-subtitle {
      font-size: 12px;
      color: #64748b;
      margin-top: 2px;
    }
    .receipt-id-box {
      text-align: right;
    }
    .receipt-badge {
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 700;
      color: #94a3b8;
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
      background: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
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
      padding: 18px;
      border-radius: 14px;
      font-size: 13px;
      margin-bottom: 24px;
      border: 1px solid #edf2f7;
    }
    .info-label {
      color: #64748b;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 3px;
    }
    .info-val {
      font-weight: 700;
      color: #1e293b;
    }
    .table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
      font-size: 13px;
    }
    .table th {
      background: #f1f5f9;
      text-align: left;
      padding: 10px 14px;
      font-weight: 700;
      color: #475569;
      border-top: 1px solid #e2e8f0;
      border-bottom: 1px solid #e2e8f0;
    }
    .table td {
      padding: 14px;
      border-bottom: 1px solid #f1f5f9;
    }
    .total-row td {
      border-top: 2px solid #cbd5e1;
      font-size: 16px;
      font-weight: 800;
      color: #047857;
      padding-top: 16px;
    }
    .print-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 20px;
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
    }
    .btn-print {
      background: #047857;
      color: #ffffff;
    }
    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-20deg);
      font-size: 48px;
      font-weight: 900;
      color: rgba(4, 120, 87, 0.07);
      text-transform: uppercase;
      letter-spacing: 4px;
      pointer-events: none;
      border: 6px dashed rgba(4, 120, 87, 0.12);
      padding: 12px 24px;
      border-radius: 16px;
    }
    @media print {
      body { background: white; padding: 0; }
      .receipt-card { box-shadow: none; border: none; padding: 10px; }
      .print-actions { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="receipt-card">
    ${isVerified ? '<div class="watermark">PAID & VERIFIED</div>' : ''}

    <div class="header">
      <div>
        <div class="brand-title">ProjuktiShikha BD</div>
        <div class="brand-subtitle">অনলাইন লার্নিং ও স্কিল ডেভেলপমেন্ট প্ল্যাটফর্ম</div>
        <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">Dhaka, Bangladesh | support@projuktishikha.com</div>
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
          <td style="text-align: center; color: #64748b;">আজীবন</td>
          <td style="text-align: right; font-weight: 700;">৳${order.amount.toLocaleString('en-IN')}</td>
        </tr>
        <tr class="total-row">
          <td colspan="2" style="text-align: right;">সর্বমোট পরিশোধিত (Total Paid):</td>
          <td style="text-align: right;">৳${order.amount.toLocaleString('en-IN')}</td>
        </tr>
      </tbody>
    </table>

    <div style="font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 14px; display: flex; justify-content: space-between;">
      <div>যেকোনো প্রয়োজনে: WhatsApp 01890-000000</div>
      <div>কম্পিউটার জেনারেটেড ডিজিটাল রসিদ</div>
    </div>

    <div class="print-actions">
      <button class="btn btn-print" onclick="window.print()">🖨️ প্রিন্ট করুন / Save as PDF</button>
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
  const height = 1000;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Top Accent Bar
  ctx.fillStyle = '#047857';
  ctx.fillRect(0, 0, width, 14);

  // Outer Border
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, width - 20, height - 20);

  // Header Logo Box
  ctx.fillStyle = '#047857';
  ctx.beginPath();
  ctx.roundRect(40, 45, 60, 60, 14);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText('PS', 55, 84);

  // Brand Name
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText('ProjuktiShikha BD', 115, 75);

  ctx.fillStyle = '#64748b';
  ctx.font = '14px sans-serif';
  ctx.fillText('অনলাইন লার্নিং ও স্কিল ডেভেলপমেন্ট প্ল্যাটফর্ম | Dhaka, Bangladesh', 115, 98);

  // Receipt Number
  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('OFFICIAL RECEIPT', 580, 65);

  ctx.fillStyle = '#047857';
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

  ctx.fillStyle = isVerified ? '#ecfdf5' : isRejected ? '#fef2f2' : '#fffbeb';
  ctx.beginPath();
  ctx.roundRect(40, 145, 720, 50, 12);
  ctx.fill();

  ctx.fillStyle = isVerified ? '#065f46' : isRejected ? '#991b1b' : '#92400e';
  ctx.font = 'bold 16px sans-serif';
  const statusText = isVerified
    ? '✓ পেমেন্ট ভেরিফাইড (Payment Verified) — কোর্স সফলভাবে এনরোল হয়েছে'
    : isRejected
    ? '✗ পেমেন্ট রিজেক্টেড (Payment Rejected) — অনুগ্রহ করে সাপোর্টে যোগাযোগ করুন'
    : '⏳ ভেরিফিকেশন অপেক্ষমান (Pending) — অ্যাডমিন দ্রুত যাচাই সম্পন্ন করবে';
  ctx.fillText(statusText, 60, 176);

  // Info Box
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.roundRect(40, 215, 720, 120, 14);
  ctx.fill();

  // Left Col (Customer)
  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('শিক্ষার্থী / গ্রাহকের নাম:', 60, 245);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText(order.customerName, 60, 272);
  ctx.fillStyle = '#475569';
  ctx.font = '14px monospace';
  ctx.fillText(order.customerPhone, 60, 298);

  // Right Col (Payment)
  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('পেমেন্ট মেথড ও TRANSACTION ID:', 420, 245);

  ctx.fillStyle = order.paymentMethod === 'bKash' ? '#e2136e' : '#f7941d';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText(`${order.paymentMethod} (Send Money)`, 420, 272);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 16px monospace';
  ctx.fillText(`TrxID: ${order.transactionId}`, 420, 298);

  // Table Header
  ctx.fillStyle = '#f1f5f9';
  ctx.beginPath();
  ctx.roundRect(40, 360, 720, 40, 8);
  ctx.fill();

  ctx.fillStyle = '#334155';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('কোর্স / আইটেম বিবরণ', 60, 385);
  ctx.fillText('মেয়াদ', 450, 385);
  ctx.fillText('মূল্য', 680, 385);

  // Table Row
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText(order.productName.slice(0, 36), 60, 435);

  ctx.fillStyle = '#64748b';
  ctx.font = '13px sans-serif';
  ctx.fillText('লাইফটাইম এক্সেস + সার্টিফিকেট + মেন্টর সাপোর্ট', 60, 460);

  ctx.fillStyle = '#334155';
  ctx.font = '15px sans-serif';
  ctx.fillText('আজীবন', 450, 440);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText(`৳${order.amount.toLocaleString('en-IN')}`, 670, 440);

  // Total Box
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.roundRect(40, 500, 720, 60, 10);
  ctx.fill();

  ctx.fillStyle = '#334155';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('সর্বমোট পরিশোধিত (Total Paid):', 60, 536);

  ctx.fillStyle = '#047857';
  ctx.font = 'extrabold 24px sans-serif';
  ctx.fillText(`৳${order.amount.toLocaleString('en-IN')}`, 640, 537);

  // Verified Stamp in Canvas
  if (isVerified) {
    ctx.save();
    ctx.translate(400, 680);
    ctx.rotate(-0.2);
    ctx.strokeStyle = 'rgba(4, 120, 87, 0.25)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.roundRect(-160, -45, 320, 90, 16);
    ctx.stroke();

    ctx.fillStyle = 'rgba(4, 120, 87, 0.25)';
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PAID & VERIFIED', 0, 10);
    ctx.restore();
  }

  // Footer notes
  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px sans-serif';
  ctx.fillText('যেকোনো প্রয়োজনে যোগাযোগ: WhatsApp: 01890-000000 | support@projuktishikha.com', 60, 940);
  ctx.fillText('এই রসিদটি কম্পিউটার দ্বারা স্বয়ংক্রিয়ভাবে তৈরি হয়েছে। ProjuktiShikha BD', 60, 965);

  // Export to image download
  const image = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = image;
  link.download = `Receipt-${order.id}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
