import React, { useState, useEffect } from 'react';
import {
  Product,
  HeroConfig,
  PaymentSettings,
  Offer,
  Order,
  PublicAppData
} from './types/index.ts';
import { ApiService } from './services/api.ts';

// Public Components
import { Navbar } from './components/public/Navbar.tsx';
import { HeroSection } from './components/public/HeroSection.tsx';
import { OffersSection } from './components/public/OffersSection.tsx';
import { ProductCard } from './components/public/ProductCard.tsx';
import { ProductDetailModal } from './components/public/ProductDetailModal.tsx';
import { PaymentModal } from './components/public/PaymentModal.tsx';
import { OrderTrackerModal } from './components/public/OrderTrackerModal.tsx';
import { Footer } from './components/public/Footer.tsx';
import { ReceiptView } from './components/common/ReceiptView.tsx';

// Admin Components
import { AdminLogin } from './components/admin/AdminLogin.tsx';
import { AdminLayout } from './components/admin/AdminLayout.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import { AdminProducts } from './components/admin/AdminProducts.tsx';
import { AdminProductModal } from './components/admin/AdminProductModal.tsx';
import { AdminOrders } from './components/admin/AdminOrders.tsx';
import { AdminHero } from './components/admin/AdminHero.tsx';
import { AdminPaymentSettings } from './components/admin/AdminPaymentSettings.tsx';
import { AdminOffers } from './components/admin/AdminOffers.tsx';
import { AdminSecurity } from './components/admin/AdminSecurity.tsx';

// Icons
import {
  Search,
  Filter,
  GraduationCap,
  Sparkles,
  BookOpen,
  ArrowUpDown,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function App() {
  // Navigation / View state
  const [view, setView] = useState<'public' | 'admin-login' | 'admin-panel'>('public');
  const [adminTab, setAdminTab] = useState<string>('dashboard');

  // Public Data state
  const [hero, setHero] = useState<HeroConfig | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
  const [isLoadingPublic, setIsLoadingPublic] = useState(true);

  // Admin Data state
  const [adminEmail, setAdminEmail] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [allOffers, setAllOffers] = useState<Offer[]>([]);
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);

  // Public interaction modals
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [activeReceiptOrder, setActiveReceiptOrder] = useState<Order | null>(null);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);

  // Admin modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Public filtering & search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high'>('default');

  // Load public data on mount
  const loadPublicData = async () => {
    try {
      const data = await ApiService.fetchPublicData();
      setHero(data.hero);
      setProducts(data.products);
      setOffers(data.offers);
      setPaymentSettings(data.paymentSettings);
    } catch (err) {
      console.error('Failed to load public data:', err);
    } finally {
      setIsLoadingPublic(false);
    }
  };

  // Load admin data
  const loadAdminData = async () => {
    setIsLoadingAdmin(true);
    try {
      const data = await ApiService.adminGetData();
      setAdminEmail(data.adminEmail);
      setHero(data.hero);
      setPaymentSettings(data.paymentSettings);
      setAllProducts(data.products);
      setAllOffers(data.offers);
      setAllOrders(data.orders);
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
      if (err.message.includes('সেশনের মেয়াদ')) {
        setView('admin-login');
      }
    } finally {
      setIsLoadingAdmin(false);
    }
  };

  useEffect(() => {
    loadPublicData();

    // Check URL hash for direct admin routing (e.g. /#admin)
    if (window.location.hash === '#admin') {
      const token = ApiService.getAdminToken();
      if (token) {
        setView('admin-panel');
        loadAdminData();
      } else {
        setView('admin-login');
      }
    }

    // Set auto logout callback
    ApiService.setOnLogout(() => {
      setView('admin-login');
    });

    // Real-time updates subscription via SSE
    const unsubscribeSSE = ApiService.subscribeToEvents((event, data) => {
      if (event === 'products_updated') {
        setProducts(data.filter((p: Product) => p.status === 'published'));
        setAllProducts(data);
      } else if (event === 'hero_updated') {
        setHero(data);
      } else if (event === 'payment_updated') {
        setPaymentSettings(data);
      } else if (event === 'offers_updated') {
        setOffers(data);
        setAllOffers(data);
      } else if (event === 'new_order' || event === 'order_status_updated') {
        if (ApiService.getAdminToken()) {
          loadAdminData();
        }
      }
    });

    return () => {
      unsubscribeSSE();
    };
  }, []);

  // Category list
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  // Filtered & sorted products for public view
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.currentPrice - b.currentPrice;
    if (sortBy === 'price-high') return b.currentPrice - a.currentPrice;
    return a.orderIndex - b.orderIndex;
  });

  // Check admin verification
  const handleOpenAdmin = async () => {
    const token = ApiService.getAdminToken();
    if (token) {
      const isValid = await ApiService.adminVerify();
      if (isValid) {
        setView('admin-panel');
        loadAdminData();
        return;
      }
    }
    setView('admin-login');
  };

  const handleAdminLoginSuccess = () => {
    setView('admin-panel');
    loadAdminData();
  };

  const handleAdminLogout = async () => {
    await ApiService.adminLogout();
    setView('public');
    loadPublicData();
  };

  // Order verification shortcuts in Admin
  const handleVerifyOrder = async (orderId: string) => {
    try {
      await ApiService.adminUpdateOrderStatus(orderId, 'Payment Verified');
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'ভেরিফাই করতে ব্যর্থ হয়েছে।');
    }
  };

  const handleRejectOrder = async (orderId: string) => {
    const note = prompt('রিজেক্ট করার কারণ লিখুন (যেমন: ভুল TrxID):');
    if (note === null) return;
    try {
      await ApiService.adminUpdateOrderStatus(orderId, 'Payment Rejected', note);
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'বাতিল করতে ব্যর্থ হয়েছে।');
    }
  };

  // ---------------- Render Views ----------------

  if (view === 'admin-login') {
    return (
      <AdminLogin
        onSuccess={handleAdminLoginSuccess}
        onBackToSite={() => setView('public')}
      />
    );
  }

  if (view === 'admin-panel') {
    const pendingCount = allOrders.filter(o => o.status === 'Pending').length;

    return (
      <AdminLayout
        activeTab={adminTab}
        onSelectTab={setAdminTab}
        adminEmail={adminEmail}
        onLogout={handleAdminLogout}
        onViewPublicSite={() => setView('public')}
        pendingOrdersCount={pendingCount}
      >
        {isLoadingAdmin ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-500 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <span className="text-xs font-semibold">এডমিন ডেটা লোড হচ্ছে...</span>
          </div>
        ) : (
          <>
            {adminTab === 'dashboard' && (
              <AdminDashboard
                products={allProducts}
                orders={allOrders}
                onNavigateTab={setAdminTab}
                onVerifyOrder={handleVerifyOrder}
                onRejectOrder={handleRejectOrder}
                onViewReceipt={(order) => setActiveReceiptOrder(order)}
              />
            )}

            {adminTab === 'products' && (
              <AdminProducts
                products={allProducts}
                onRefresh={loadAdminData}
                onAddNewProduct={() => {
                  setEditingProduct(null);
                  setIsProductModalOpen(true);
                }}
                onEditProduct={(p) => {
                  setEditingProduct(p);
                  setIsProductModalOpen(true);
                }}
              />
            )}

            {adminTab === 'orders' && (
              <AdminOrders
                orders={allOrders}
                onRefresh={loadAdminData}
                onViewReceipt={(order) => setActiveReceiptOrder(order)}
              />
            )}

            {adminTab === 'hero' && hero && (
              <AdminHero
                hero={hero}
                onRefresh={loadAdminData}
              />
            )}

            {adminTab === 'payments' && paymentSettings && (
              <AdminPaymentSettings
                paymentSettings={paymentSettings}
                onRefresh={loadAdminData}
              />
            )}

            {adminTab === 'offers' && (
              <AdminOffers
                offers={allOffers}
                products={allProducts}
                onRefresh={loadAdminData}
              />
            )}

            {adminTab === 'security' && (
              <AdminSecurity
                currentEmail={adminEmail}
                onRefresh={loadAdminData}
              />
            )}
          </>
        )}

        {/* Product Modal */}
        {isProductModalOpen && (
          <AdminProductModal
            product={editingProduct}
            onClose={() => setIsProductModalOpen(false)}
            onSaved={() => {
              setIsProductModalOpen(false);
              loadAdminData();
            }}
          />
        )}

        {/* Receipt Modal in Admin */}
        {activeReceiptOrder && (
          <ReceiptView
            order={activeReceiptOrder}
            onClose={() => setActiveReceiptOrder(null)}
          />
        )}
      </AdminLayout>
    );
  }

  // ---------------- Public Website View ----------------
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* Navbar */}
      {hero && (
        <Navbar
          hero={hero}
          onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
          onNavigateToCourses={() => {
            document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onNavigateToOffers={() => {
            document.getElementById('offers-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenAdmin={handleOpenAdmin}
        />
      )}

      {/* Hero Section */}
      {hero && (
        <HeroSection
          hero={hero}
          onCtaClick={() => {
            document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}

      {/* Featured Offers Section */}
      {offers.length > 0 && (
        <OffersSection
          offers={offers}
          products={products}
          onSelectOffer={(offer) => {
            const linked = products.find(p => p.id === offer.productId);
            if (linked) {
              setCheckoutProduct({
                ...linked,
                currentPrice: offer.offerPrice,
                previousPrice: offer.previousPrice,
                offerBadge: offer.badge
              });
            } else if (products.length > 0) {
              setCheckoutProduct({
                ...products[0],
                name: offer.name,
                currentPrice: offer.offerPrice,
                previousPrice: offer.previousPrice,
                offerBadge: offer.badge
              });
            }
          }}
        />
      )}

      {/* Main Courses / Products Section */}
      <section id="products-section" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>প্রফেশনাল কোর্স ও ডিজিটাল রিসোর্স</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            আপনার পছন্দের কোর্সটি বেছে নিন
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            লাইভ প্রজেক্ট, আন্তর্জাতিক মানের সিলেবাস এবং ২৪/৭ ডেডিকেটেড মেন্টর সাপোর্ট সহ ক্যারিয়ার শুরু করুন আজই।
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-8 space-y-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat === 'All' ? 'সকল কোর্স' : cat}
              </button>
            ))}
          </div>

          {/* Search & Sort Row */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-100">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="কোর্সের নাম বা বিষয় লিখে সার্চ করুন..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full sm:w-44 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-medium"
              >
                <option value="default">ডিফল্ট ক্রম</option>
                <option value="price-low">মূল্য: কম থেকে বেশি</option>
                <option value="price-high">মূল্য: বেশি থেকে কম</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {isLoadingPublic ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-500 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <span className="text-xs font-semibold">কোর্সসমূহ লোড হচ্ছে...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-800">কোনো কোর্স পাওয়া যায়নি</h3>
            <p className="text-xs text-slate-500">
              অনুগ্রহ করে অন্য কোনো কি-ওয়ার্ড দিয়ে সার্চ করুন অথবা ক্যাটাগরি পরিবর্তন করুন।
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              সকল কোর্স দেখুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={(p) => setSelectedProductDetails(p)}
                onBuyNow={(p) => setCheckoutProduct(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Product Details Modal */}
      {selectedProductDetails && (
        <ProductDetailModal
          product={selectedProductDetails}
          onClose={() => setSelectedProductDetails(null)}
          onBuyNow={(p) => {
            setSelectedProductDetails(null);
            setCheckoutProduct(p);
          }}
          supportWhatsApp={hero?.supportWhatsApp}
        />
      )}

      {/* Payment / Checkout Modal */}
      {checkoutProduct && paymentSettings && (
        <PaymentModal
          product={checkoutProduct}
          paymentSettings={paymentSettings}
          onClose={() => setCheckoutProduct(null)}
          onSuccess={(order) => {
            setCheckoutProduct(null);
            setActiveReceiptOrder(order);
          }}
        />
      )}

      {/* Downloadable / Printable Receipt Modal */}
      {activeReceiptOrder && (
        <ReceiptView
          order={activeReceiptOrder}
          onClose={() => setActiveReceiptOrder(null)}
        />
      )}

      {/* Order Tracker & Receipt Lookup Modal */}
      {isOrderTrackerOpen && (
        <OrderTrackerModal
          onClose={() => setIsOrderTrackerOpen(false)}
          onViewReceipt={(order) => {
            setIsOrderTrackerOpen(false);
            setActiveReceiptOrder(order);
          }}
        />
      )}

      {/* Footer */}
      {hero && (
        <Footer
          hero={hero}
          onOpenAdmin={handleOpenAdmin}
          onNavigateToCourses={() => {
            document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenTracker={() => setIsOrderTrackerOpen(true)}
        />
      )}
    </div>
  );
}
