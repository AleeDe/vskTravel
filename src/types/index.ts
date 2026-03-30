// ==================== USER & AUTH ====================
export type UserRole = 'customer' | 'partner' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

// ==================== CATEGORIES ====================
export type CategoryType = 'service' | 'product';

export interface Category {
  id: string;
  name: string;
  slug: string;
  type: CategoryType;
  description?: string;
  icon?: string;
  image_url?: string;
  parent_id?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

// ==================== SERVICES ====================
export type ServiceStatus = 'draft' | 'pending' | 'active' | 'rejected' | 'archived';

export interface Service {
  id: string;
  partner_id: string;
  category_id: string;
  title: string;
  slug: string;
  description: string;
  short_description?: string;
  images: string[];
  base_price: number;
  sale_price?: number;
  currency: string;
  location?: string;
  city?: string;
  duration?: string;
  max_capacity?: number;
  includes?: string[];
  excludes?: string[];
  highlights?: string[];
  itinerary?: ItineraryDay[];
  dynamic_fields?: Record<string, unknown>;
  status: ServiceStatus;
  is_featured: boolean;
  avg_rating: number;
  total_reviews: number;
  total_bookings: number;
  created_at: string;
  updated_at: string;
  // Joined
  category?: Category;
  partner?: PartnerProfile;
  reviews?: Review[];
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  meals?: string[];
  accommodation?: string;
}

// ==================== PRODUCTS ====================
export type ProductStatus = 'draft' | 'pending' | 'active' | 'rejected' | 'archived';

export interface Product {
  id: string;
  partner_id: string;
  category_id: string;
  title: string;
  slug: string;
  description: string;
  short_description?: string;
  images: string[];
  base_price: number;
  sale_price?: number;
  currency: string;
  sku?: string;
  stock_quantity: number;
  track_inventory: boolean;
  weight?: number;
  dimensions?: { length: number; width: number; height: number };
  variants?: ProductVariant[];
  tags?: string[];
  dynamic_fields?: Record<string, unknown>;
  status: ProductStatus;
  is_featured: boolean;
  avg_rating: number;
  total_reviews: number;
  total_sold: number;
  created_at: string;
  updated_at: string;
  // Joined
  category?: Category;
  partner?: PartnerProfile;
  reviews?: Review[];
}

export interface ProductVariant {
  id: string;
  name: string;
  sku?: string;
  price_adjustment: number;
  stock_quantity: number;
  attributes: Record<string, string>;
}

// ==================== PARTNER ====================
export type PartnerStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface PartnerProfile {
  id: string;
  user_id: string;
  business_name: string;
  business_type: string;
  description?: string;
  logo_url?: string;
  banner_url?: string;
  phone: string;
  address?: string;
  city?: string;
  cnic?: string;
  bank_name?: string;
  bank_account?: string;
  commission_rate: number;
  status: PartnerStatus;
  total_earnings: number;
  total_orders: number;
  avg_rating: number;
  created_at: string;
  updated_at: string;
  // Joined
  profile?: Profile;
}

// ==================== ORDERS ====================
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'refunded';

export type OrderItemType = 'service' | 'product';

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  status: OrderStatus;
  subtotal: number;
  discount_amount: number;
  shipping_amount: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  payment_method?: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  stripe_session_id?: string;
  shipping_address?: ShippingAddress;
  traveler_info?: TravelerInfo;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Joined
  items?: OrderItem[];
  customer?: Profile;
}

export interface OrderItem {
  id: string;
  order_id: string;
  item_type: OrderItemType;
  service_id?: string;
  product_id?: string;
  partner_id: string;
  title: string;
  image_url?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  variant_info?: Record<string, string>;
  booking_date?: string;
  booking_time?: string;
  travelers_count?: number;
  commission_rate: number;
  commission_amount: number;
  status: OrderStatus;
  // Joined
  service?: Service;
  product?: Product;
  partner?: PartnerProfile;
}

export interface ShippingAddress {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
}

export interface TravelerInfo {
  lead_traveler: string;
  phone: string;
  email: string;
  travelers: { name: string; age?: number; cnic?: string }[];
  special_requests?: string;
}

// ==================== REVIEWS ====================
export interface Review {
  id: string;
  user_id: string;
  item_type: OrderItemType;
  service_id?: string;
  product_id?: string;
  order_id: string;
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  // Joined
  user?: Profile;
}

// ==================== COMMISSIONS ====================
export interface CommissionTransaction {
  id: string;
  order_item_id: string;
  partner_id: string;
  order_amount: number;
  commission_rate: number;
  commission_amount: number;
  partner_amount: number;
  status: 'pending' | 'settled' | 'refunded';
  settled_at?: string;
  created_at: string;
}

// ==================== CART ====================
export interface CartItem {
  id: string;
  item_type: OrderItemType;
  service?: Service;
  product?: Product;
  quantity: number;
  variant_info?: Record<string, string>;
  booking_date?: string;
  booking_time?: string;
  travelers_count?: number;
  unit_price: number;
}

// ==================== BANNERS / PROMOS ====================
export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image_url: string;
  link_url?: string;
  is_active: boolean;
  sort_order: number;
  starts_at?: string;
  ends_at?: string;
}

// ==================== DASHBOARD STATS ====================
export interface DashboardStats {
  total_revenue: number;
  total_orders: number;
  total_customers: number;
  total_partners: number;
  revenue_trend: { date: string; amount: number }[];
  orders_by_status: { status: string; count: number }[];
  top_services: { id: string; title: string; bookings: number }[];
  top_products: { id: string; title: string; sold: number }[];
}
