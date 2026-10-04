import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { dbService } from './db.ts';

export const apiRouter = express.Router();

const UPLOADS_DIR = path.resolve(process.cwd(), 'data', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// JSON body parsing with large limit for compressed image uploads
apiRouter.use(express.json({ limit: '15mb' }));
apiRouter.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static uploads serving
apiRouter.use('/uploads', express.static(UPLOADS_DIR));

// Admin authentication middleware
export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  if (!dbService.validateSession(token)) {
    return res.status(401).json({ error: 'Session expired or invalid. Please sign in again.' });
  }

  next();
}

// ---------------- Public Endpoints ----------------

// Get all public data
apiRouter.get('/public/data', (_req: Request, res: Response) => {
  try {
    const data = dbService.getPublicData();
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Real-time Server-Sent Events stream
apiRouter.get('/public/events', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  const sendEvent = (msg: string) => {
    res.write(msg);
  };

  dbService.addSSEClient(sendEvent);

  // Send initial ping
  res.write(`event: connected\ndata: ${JSON.stringify({ time: Date.now() })}\n\n`);

  req.on('close', () => {
    dbService.removeSSEClient(sendEvent);
  });
});

// Place customer order
apiRouter.post('/public/orders', (req: Request, res: Response) => {
  try {
    const { productId, customerName, customerPhone, customerEmail, paymentMethod, transactionId } = req.body;

    if (!productId || !customerName || !customerPhone || !paymentMethod || !transactionId) {
      return res.status(400).json({ error: 'সকল প্রয়োজনীয় তথ্য (নাম, ফোন নম্বর, মেথড ও TrxID) সঠিকভাবে প্রদান করুন।' });
    }

    if (paymentMethod !== 'bKash' && paymentMethod !== 'Nagad') {
      return res.status(400).json({ error: 'Invalid payment method selected.' });
    }

    const order = dbService.createOrder({
      productId,
      customerName,
      customerPhone,
      customerEmail,
      paymentMethod,
      transactionId
    });

    res.status(201).json({ success: true, order });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Track / fetch order receipt by ID
apiRouter.get('/public/orders/:orderId', (req: Request, res: Response) => {
  try {
    const order = dbService.getOrderById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: 'অর্ডারটি খুঁজে পাওয়া যায়নি। অনুগ্রহ করে সঠিক Order ID দিন।' });
    }
    res.json({ success: true, order });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Standalone printable receipt endpoint
apiRouter.get('/public/orders/:orderId/receipt.html', (req: Request, res: Response) => {
  try {
    const order = dbService.getOrderById(req.params.orderId);
    if (!order) {
      return res.status(404).send('<h1>অর্ডারটি খুঁজে পাওয়া যায়নি</h1>');
    }
    const isVerified = order.status === 'Payment Verified' || order.status === 'Completed';
    const formattedDate = new Date(order.createdAt).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const html = `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <title>Receipt-${order.id} - ProjuktiShikha BD</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #020617; color: #0f172a; padding: 30px 15px; display: flex; justify-content: center; }
    .card { max-width: 650px; width: 100%; background: #ffffff; border-radius: 16px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.4); }
    .btn { background: #2563eb; color: white; padding: 10px 18px; border-radius: 8px; border: none; font-weight: bold; cursor: pointer; }
    @media print { body { background: white; padding: 0; } .card { box-shadow: none; border: none; padding: 0; } .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="card">
    <div style="border-bottom: 2px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 20px; display: flex; justify-content: space-between;">
      <div>
        <h2 style="color: #1e40af; margin: 0;">ProjuktiShikha BD</h2>
        <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">অফিসিয়াল পেমেন্ট ইনভয়েস</p>
      </div>
      <div style="text-align: right;">
        <span style="font-family: monospace; font-weight: bold; font-size: 18px; color: #0f172a;">#${order.id}</span>
        <div style="font-size: 12px; color: #64748b;">${formattedDate}</div>
      </div>
    </div>
    <div style="background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af; padding: 12px; border-radius: 10px; font-weight: bold; margin-bottom: 20px;">
      ${isVerified ? '✓ পেমেন্ট ভেরিফাইড (Payment Verified)' : '⏳ যাচাই প্রক্রিয়াধীন (Pending Verification)'}
    </div>
    <div style="margin-bottom: 20px; font-size: 13px;">
      <p><strong>গ্রাহকের নাম:</strong> ${order.customerName}</p>
      <p><strong>মোবাইল:</strong> ${order.customerPhone}</p>
      <p><strong>পেমেন্ট মেথড:</strong> ${order.paymentMethod} (TrxID: ${order.transactionId})</p>
      <p><strong>কোর্স:</strong> ${order.productName}</p>
      <p><strong>টাকা:</strong> ৳${order.amount.toLocaleString('en-IN')}</p>
    </div>
    <div class="no-print" style="margin-top: 24px; text-align: right;">
      <button class="btn" onclick="window.print()">🖨️ প্রিন্ট / Save as PDF</button>
    </div>
  </div>
</body>
</html>`;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
});

// ---------------- Admin Endpoints ----------------

// Admin Login
apiRouter.post('/admin/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const isValid = dbService.verifyAdminCredentials(email, password);
    if (!isValid) {
      return res.status(401).json({ error: 'ভুল ইমেইল অথবা পাসওয়ার্ড দিয়েছেন। অনুগ্রহ করে আবার চেষ্টা করুন।' });
    }

    const token = dbService.createSession(email);
    res.json({
      success: true,
      token,
      email
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Logout
apiRouter.post('/admin/logout', requireAdminAuth, (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    dbService.destroySession(token);
  }
  res.json({ success: true });
});

// Verify Admin Session
apiRouter.get('/admin/verify', requireAdminAuth, (_req: Request, res: Response) => {
  res.json({ success: true, authenticated: true });
});

// Admin full dataset
apiRouter.get('/admin/data', requireAdminAuth, (_req: Request, res: Response) => {
  try {
    const data = dbService.getAdminData();
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin change credentials
apiRouter.put('/admin/credentials', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { email, newPassword, currentPassword } = req.body;
    const adminData = dbService.getAdminData();

    if (!dbService.verifyAdminCredentials(adminData.adminEmail, currentPassword)) {
      return res.status(400).json({ error: 'বর্তমান পাসওয়ার্ড সঠিক নয়।' });
    }

    dbService.updateAdminCredentials(email, newPassword);
    res.json({ success: true, message: 'এডমিন তথ্য সফলভাবে আপডেট হয়েছে।' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin update hero
apiRouter.put('/admin/hero', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const updated = dbService.updateHero(req.body);
    res.json({ success: true, hero: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin update payment settings
apiRouter.put('/admin/payment-settings', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const updated = dbService.updatePaymentSettings(req.body);
    res.json({ success: true, paymentSettings: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin add product
apiRouter.post('/admin/products', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { name, shortDescription, fullDescription, currentPrice, previousPrice, category, thumbnail } = req.body;
    if (!name || currentPrice === undefined || !category) {
      return res.status(400).json({ error: 'Product name, current price, and category are required' });
    }

    const calcDiscount = previousPrice && previousPrice > currentPrice
      ? Math.round(((previousPrice - currentPrice) / previousPrice) * 100)
      : (req.body.discountPercentage || 0);

    const product = dbService.addProduct({
      name,
      shortDescription: shortDescription || '',
      fullDescription: fullDescription || '',
      currentPrice: Number(currentPrice),
      previousPrice: Number(previousPrice) || Number(currentPrice),
      discountPercentage: calcDiscount,
      category,
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      images: Array.isArray(req.body.images) && req.body.images.length > 0 ? req.body.images : [thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'],
      status: req.body.status || 'published',
      isFeatured: !!req.body.isFeatured,
      offerBadge: req.body.offerBadge || '',
      courseDuration: req.body.courseDuration || '',
      courseLevel: req.body.courseLevel || 'All Levels',
      whatYouWillLearn: Array.isArray(req.body.whatYouWillLearn) ? req.body.whatYouWillLearn : [],
      features: Array.isArray(req.body.features) ? req.body.features : []
    });

    res.status(201).json({ success: true, product });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin update product
apiRouter.put('/admin/products/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = { ...req.body };
    if (body.previousPrice && body.currentPrice && body.previousPrice > body.currentPrice) {
      body.discountPercentage = Math.round(((body.previousPrice - body.currentPrice) / body.previousPrice) * 100);
    }
    const updated = dbService.updateProduct(id, body);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true, product: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin delete product
apiRouter.delete('/admin/products/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const deleted = dbService.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin duplicate product
apiRouter.post('/admin/products/:id/duplicate', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const duplicated = dbService.duplicateProduct(req.params.id);
    if (!duplicated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(201).json({ success: true, product: duplicated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin reorder products
apiRouter.post('/admin/products/reorder', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: 'Product IDs array required' });
    }
    dbService.reorderProducts(ids);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin add offer
apiRouter.post('/admin/offers', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const offer = dbService.addOffer(req.body);
    res.status(201).json({ success: true, offer });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin update offer
apiRouter.put('/admin/offers/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const updated = dbService.updateOffer(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Offer not found' });
    }
    res.json({ success: true, offer: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin delete offer
apiRouter.delete('/admin/offers/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const deleted = dbService.deleteOffer(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Offer not found' });
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin update order status (Verify / Reject / Complete)
apiRouter.put('/admin/orders/:id/status', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;
    const validStatuses = ['Pending', 'Payment Verified', 'Payment Rejected', 'Completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid order status' });
    }

    const updated = dbService.updateOrderStatus(id, status, adminNote);
    if (!updated) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ success: true, order: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin direct image upload (from Gallery/File Picker)
apiRouter.post('/admin/upload', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { dataUrl, filename } = req.body;
    if (!dataUrl || !dataUrl.includes('base64,')) {
      return res.status(400).json({ error: 'Invalid image data' });
    }

    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid base64 format' });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const ext = mimeType.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg';
    const cleanName = (filename || 'upload').replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueFilename = `${cleanName}-${Date.now()}-${crypto.randomBytes(3).toString('hex')}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, uniqueFilename);

    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

    const publicUrl = `/api/uploads/${uniqueFilename}`;
    res.json({ success: true, url: publicUrl, filename: uniqueFilename });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
