import { PublicAppData, Product, HeroConfig, PaymentSettings, Offer, Order } from '../types/index.ts';

const ADMIN_TOKEN_KEY = 'projukti_admin_session_token';
const ADMIN_EMAIL_KEY = 'projukti_admin_email';
const LAST_ACTIVITY_KEY = 'projukti_admin_last_activity';
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes auto logout

export class ApiService {
  private static token: string | null = null;
  private static eventSource: EventSource | null = null;
  private static inactivityInterval: any = null;
  private static onLogoutCallback: (() => void) | null = null;

  public static setOnLogout(cb: () => void) {
    this.onLogoutCallback = cb;
  }

  public static getAdminToken(): string | null {
    if (this.token) return this.token;
    const stored = sessionStorage.getItem(ADMIN_TOKEN_KEY);
    const lastActivity = sessionStorage.getItem(LAST_ACTIVITY_KEY);

    if (stored && lastActivity) {
      if (Date.now() - parseInt(lastActivity, 10) > INACTIVITY_TIMEOUT_MS) {
        this.clearAdminSession();
        return null;
      }
      this.token = stored;
      this.startInactivityTracker();
      return this.token;
    }
    return null;
  }

  public static setAdminSession(token: string, email: string) {
    this.token = token;
    sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
    sessionStorage.setItem(ADMIN_EMAIL_KEY, email);
    sessionStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    this.startInactivityTracker();
  }

  public static clearAdminSession() {
    this.token = null;
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    sessionStorage.removeItem(ADMIN_EMAIL_KEY);
    sessionStorage.removeItem(LAST_ACTIVITY_KEY);
    if (this.inactivityInterval) {
      clearInterval(this.inactivityInterval);
      this.inactivityInterval = null;
    }
    if (this.onLogoutCallback) {
      this.onLogoutCallback();
    }
  }

  public static recordActivity() {
    if (this.token) {
      sessionStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    }
  }

  private static startInactivityTracker() {
    if (this.inactivityInterval) clearInterval(this.inactivityInterval);

    // Track user clicks/keypresses
    const updateTime = () => this.recordActivity();
    window.addEventListener('mousemove', updateTime, { passive: true });
    window.addEventListener('keydown', updateTime, { passive: true });
    window.addEventListener('touchstart', updateTime, { passive: true });

    this.inactivityInterval = setInterval(() => {
      const lastActivity = sessionStorage.getItem(LAST_ACTIVITY_KEY);
      if (lastActivity && Date.now() - parseInt(lastActivity, 10) > INACTIVITY_TIMEOUT_MS) {
        this.clearAdminSession();
      }
    }, 30000);
  }

  private static async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    this.recordActivity();
    const headers = new Headers(options.headers || {});
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    const token = this.getAdminToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(path, {
      ...options,
      headers
    });

    if (response.status === 401 && path.includes('/admin/')) {
      this.clearAdminSession();
      throw new Error('আপনার সেশনের মেয়াদ শেষ হয়েছে। দয়া করে পুনরায় লগইন করুন।');
    }

    const json = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(json.error || `Request failed with status ${response.status}`);
    }

    return json;
  }

  // ---------------- Public API Methods ----------------

  public static async fetchPublicData(): Promise<PublicAppData> {
    const res = await this.request<{ success: boolean; data: PublicAppData }>('/api/public/data');
    return res.data;
  }

  public static async submitOrder(orderData: {
    productId: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    paymentMethod: 'bKash' | 'Nagad';
    transactionId: string;
  }): Promise<Order> {
    const res = await this.request<{ success: boolean; order: Order }>('/api/public/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
    return res.order;
  }

  public static async fetchOrderById(orderId: string): Promise<Order> {
    const res = await this.request<{ success: boolean; order: Order }>(`/api/public/orders/${encodeURIComponent(orderId)}`);
    return res.order;
  }

  public static subscribeToEvents(onEvent: (event: string, data: any) => void): () => void {
    if (this.eventSource) {
      this.eventSource.close();
    }

    try {
      this.eventSource = new EventSource('/api/public/events');

      const handle = (e: MessageEvent, name: string) => {
        try {
          const parsed = JSON.parse(e.data);
          onEvent(name, parsed);
        } catch {
          onEvent(name, e.data);
        }
      };

      this.eventSource.addEventListener('connected', (e) => handle(e as MessageEvent, 'connected'));
      this.eventSource.addEventListener('products_updated', (e) => handle(e as MessageEvent, 'products_updated'));
      this.eventSource.addEventListener('hero_updated', (e) => handle(e as MessageEvent, 'hero_updated'));
      this.eventSource.addEventListener('payment_updated', (e) => handle(e as MessageEvent, 'payment_updated'));
      this.eventSource.addEventListener('offers_updated', (e) => handle(e as MessageEvent, 'offers_updated'));
      this.eventSource.addEventListener('new_order', (e) => handle(e as MessageEvent, 'new_order'));
      this.eventSource.addEventListener('order_status_updated', (e) => handle(e as MessageEvent, 'order_status_updated'));

      return () => {
        if (this.eventSource) {
          this.eventSource.close();
          this.eventSource = null;
        }
      };
    } catch (err) {
      console.warn('SSE subscription failed, fallback to polling if needed:', err);
      return () => {};
    }
  }

  // ---------------- Admin API Methods ----------------

  public static async adminLogin(email: string, pass: string): Promise<{ token: string; email: string }> {
    const res = await this.request<{ success: boolean; token: string; email: string }>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: pass })
    });
    this.setAdminSession(res.token, res.email);
    return res;
  }

  public static async adminLogout(): Promise<void> {
    try {
      await this.request('/api/admin/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    }
    this.clearAdminSession();
  }

  public static async adminVerify(): Promise<boolean> {
    try {
      const res = await this.request<{ success: boolean; authenticated: boolean }>('/api/admin/verify');
      return !!res.authenticated;
    } catch {
      return false;
    }
  }

  public static async adminGetData(): Promise<{
    adminEmail: string;
    hero: HeroConfig;
    paymentSettings: PaymentSettings;
    products: Product[];
    offers: Offer[];
    orders: Order[];
  }> {
    const res = await this.request<{ success: boolean; data: any }>('/api/admin/data');
    return res.data;
  }

  public static async adminUpdateHero(hero: Partial<HeroConfig>): Promise<HeroConfig> {
    const res = await this.request<{ success: boolean; hero: HeroConfig }>('/api/admin/hero', {
      method: 'PUT',
      body: JSON.stringify(hero)
    });
    return res.hero;
  }

  public static async adminUpdatePaymentSettings(settings: Partial<PaymentSettings>): Promise<PaymentSettings> {
    const res = await this.request<{ success: boolean; paymentSettings: PaymentSettings }>('/api/admin/payment-settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
    return res.paymentSettings;
  }

  public static async adminCreateProduct(product: Partial<Product>): Promise<Product> {
    const res = await this.request<{ success: boolean; product: Product }>('/api/admin/products', {
      method: 'POST',
      body: JSON.stringify(product)
    });
    return res.product;
  }

  public static async adminUpdateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const res = await this.request<{ success: boolean; product: Product }>(`/api/admin/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    return res.product;
  }

  public static async adminDeleteProduct(id: string): Promise<void> {
    await this.request(`/api/admin/products/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  }

  public static async adminDuplicateProduct(id: string): Promise<Product> {
    const res = await this.request<{ success: boolean; product: Product }>(`/api/admin/products/${encodeURIComponent(id)}/duplicate`, {
      method: 'POST'
    });
    return res.product;
  }

  public static async adminReorderProducts(ids: string[]): Promise<void> {
    await this.request('/api/admin/products/reorder', {
      method: 'POST',
      body: JSON.stringify({ ids })
    });
  }

  public static async adminCreateOffer(offer: Partial<Offer>): Promise<Offer> {
    const res = await this.request<{ success: boolean; offer: Offer }>('/api/admin/offers', {
      method: 'POST',
      body: JSON.stringify(offer)
    });
    return res.offer;
  }

  public static async adminUpdateOffer(id: string, updates: Partial<Offer>): Promise<Offer> {
    const res = await this.request<{ success: boolean; offer: Offer }>(`/api/admin/offers/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    return res.offer;
  }

  public static async adminDeleteOffer(id: string): Promise<void> {
    await this.request(`/api/admin/offers/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  }

  public static async adminUpdateOrderStatus(id: string, status: Order['status'], adminNote?: string): Promise<Order> {
    const res = await this.request<{ success: boolean; order: Order }>(`/api/admin/orders/${encodeURIComponent(id)}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, adminNote })
    });
    return res.order;
  }

  public static async adminUploadImage(dataUrl: string, filename?: string): Promise<string> {
    const res = await this.request<{ success: boolean; url: string }>('/api/admin/upload', {
      method: 'POST',
      body: JSON.stringify({ dataUrl, filename })
    });
    return res.url;
  }
}
