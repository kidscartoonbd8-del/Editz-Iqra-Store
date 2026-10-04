export type ProductStatus = 'published' | 'draft';

export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  currentPrice: number;
  previousPrice: number;
  discountPercentage: number;
  category: string;
  thumbnail: string;
  images: string[];
  status: ProductStatus;
  isFeatured: boolean;
  offerBadge?: string;
  courseDuration?: string;
  courseLevel?: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  whatYouWillLearn: string[];
  features: string[];
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface HeroConfig {
  heading: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  heroImage: string;
  offerText: string;
  badgeText: string;
  isVisible: boolean;
  supportPhone: string;
  supportWhatsApp: string;
}

export interface PaymentProviderConfig {
  enabled: boolean;
  number: string;
  type: 'personal' | 'merchant' | 'agent';
  instructions: string;
}

export interface PaymentSettings {
  bkash: PaymentProviderConfig;
  nagad: PaymentProviderConfig;
}

export interface Offer {
  id: string;
  name: string;
  productId?: string;
  previousPrice: number;
  offerPrice: number;
  discountPercentage: number;
  description: string;
  image?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  badge: string;
}

export type OrderStatus = 'Pending' | 'Payment Verified' | 'Payment Rejected' | 'Completed';

export interface Order {
  id: string;
  productId: string;
  productName: string;
  amount: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  paymentMethod: 'bKash' | 'Nagad';
  transactionId: string;
  status: OrderStatus;
  adminNote?: string;
  createdAt: string;
  verifiedAt?: string;
}

export interface PublicAppData {
  hero: HeroConfig;
  products: Product[];
  offers: Offer[];
  paymentSettings: {
    bkash: {
      enabled: boolean;
      number: string;
      type: 'personal' | 'merchant' | 'agent';
      instructions: string;
    };
    nagad: {
      enabled: boolean;
      number: string;
      type: 'personal' | 'merchant';
      instructions: string;
    };
  };
}

export interface AdminDashboardStats {
  totalProducts: number;
  totalCourses: number;
  totalOrders: number;
  pendingPayments: number;
  pendingAmount: number;
  verifiedPayments: number;
  verifiedAmount: number;
  totalRevenue: number;
}
