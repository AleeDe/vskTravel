// ==================== APP INFO ====================
export const APP_NAME = 'VSK Travel'
export const APP_DESCRIPTION = 'Pakistan\'s premier travel marketplace — book services & products from trusted partners.'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

// ==================== ROUTES ====================
export const ROUTES = {
  home: '/',
  // Auth
  login: '/auth/login',
  register: '/auth/register',
  forgotPassword: '/auth/forgot-password',
  // Customer
  services: '/services',
  products: '/products',
  cart: '/cart',
  checkout: '/checkout',
  orders: '/orders',
  dashboard: '/dashboard',
  // Partner
  partnerOnboarding: '/partner/onboarding',
  partnerDashboard: '/partner/dashboard',
  partnerServices: '/partner/services',
  partnerProducts: '/partner/products',
  partnerOrders: '/partner/orders',
  partnerEarnings: '/partner/earnings',
  // Admin
  adminDashboard: '/admin/dashboard',
  adminPartners: '/admin/partners',
  adminListings: '/admin/listings',
  adminCategories: '/admin/categories',
  adminCommissions: '/admin/commissions',
  adminOrders: '/admin/orders',
  adminContent: '/admin/content',
} as const

// ==================== PAGINATION ====================
export const DEFAULT_PAGE_SIZE = 12
export const MAX_PAGE_SIZE = 48

// ==================== CURRENCY ====================
export const DEFAULT_CURRENCY = 'PKR'
export const CURRENCY_SYMBOL = '₨'

// ==================== COMMISSION ====================
export const DEFAULT_COMMISSION_RATE = 10 // percent

// ==================== FILE UPLOADS ====================
export const MAX_IMAGE_SIZE_MB = 5
export const MAX_IMAGES_PER_LISTING = 10
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// ==================== SERVICE CATEGORIES ====================
export const SERVICE_CATEGORIES = [
  { slug: 'flights', label: 'Flights', icon: '✈️' },
  { slug: 'hotels', label: 'Hotels', icon: '🏨' },
  { slug: 'tour-packages', label: 'Tour Packages', icon: '🗺️' },
  { slug: 'visa-assistance', label: 'Visa Assistance', icon: '📋' },
  { slug: 'car-rentals', label: 'Car Rentals', icon: '🚗' },
  { slug: 'travel-insurance', label: 'Travel Insurance', icon: '🛡️' },
] as const

// ==================== PRODUCT CATEGORIES ====================
export const PRODUCT_CATEGORIES = [
  { slug: 'luggage', label: 'Luggage & Bags', icon: '🧳' },
  { slug: 'travel-gear', label: 'Travel Gear', icon: '⛺' },
  { slug: 'accessories', label: 'Accessories', icon: '🎒' },
  { slug: 'clothing', label: 'Travel Clothing', icon: '👕' },
  { slug: 'electronics', label: 'Electronics', icon: '📱' },
] as const

// ==================== ORDER STATUSES ====================
export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  completed: 'Completed',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
}

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: 'warning',
  confirmed: 'primary',
  processing: 'primary',
  shipped: 'primary',
  delivered: 'success',
  completed: 'success',
  cancelled: 'error',
  refunded: 'error',
}

// ==================== PARTNER STATUS ====================
export const PARTNER_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending Review',
  approved: 'Approved',
  rejected: 'Rejected',
  suspended: 'Suspended',
}

// ==================== SORT OPTIONS ====================
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popular', label: 'Most Popular' },
] as const

// ==================== PAYMENT METHODS ====================
export const PAYMENT_METHODS = [
  { value: 'stripe', label: 'Credit / Debit Card', available: true },
  { value: 'jazzcash', label: 'JazzCash', available: false },
  { value: 'easypaisa', label: 'EasyPaisa', available: false },
  { value: 'pay_at_venue', label: 'Pay at Venue', available: true },
] as const

// ==================== CITIES ====================
export const PAKISTAN_CITIES = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
  'Hyderabad', 'Abbottabad', 'Murree', 'Swat', 'Gilgit',
  'Skardu', 'Hunza', 'Naran', 'Kaghan', 'Chitral',
] as const
