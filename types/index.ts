export type CurrencyType = 'VND' | 'USD' | 'LTC';
export type PaymentMethod = 'SEPAY' | 'LITECOIN';
export type OrderStatus =
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'UNDERPAID'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'MANUAL_REVIEW';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  products?: Product[];
}

export interface StockItem {
  id: string;
  productId: string;
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD';
  reservedUntil?: string | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceVND: number;
  price: number; // alias for priceVND for cart compatibility
  originalPrice?: number | null;
  images: string[];
  warrantyPolicy: string;
  isFeatured?: boolean;
  specs?: Record<string, string> | null;
  digitalKey?: string | null;
  categoryId: string;
  category?: Category;
  stocks?: StockItem[];
  availableCount?: number;
  createdAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
