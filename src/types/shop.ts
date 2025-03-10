
import { CATEGORY_MAP } from "@/constants/categories";

// Define the Category type based on the values in CATEGORY_MAP
export type Category = typeof CATEGORY_MAP[keyof typeof CATEGORY_MAP];

export interface Product {
  id: string;
  name: string;
  description: string;
  fullDescription?: string;
  price: number;
  imageUrl?: string; // For backward compatibility
  images: string[];
  category: Category;
  subcategory?: string;
  isFeatured: boolean;
  featured?: boolean; // For backward compatibility with existing code
  inStock: boolean;
  quantity?: number;
  rating?: number;
  specifications?: Array<{ name: string; value: string }>;
  reviews?: Array<{ user: string; rating: number; comment: string; date: string }>;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  orders: Order[];
}

export interface Order {
  id: string;
  customer: Customer;
  items: CartItem[];
  total: number;
  date: Date;
}

export interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export interface PaymentInfo {
  cardName: string;
  cardNumber: string;
  expMonth: string;
  expYear: string;
  cvv: string;
}

export interface CouponCode {
  id: string;
  code: string;
  discountPercentage: number;
  active: boolean;
  description: string;
}

export interface CartSummaryProps {
  cart: CartItem[];
  subtotal: number;
  itemCount: number;
  couponCode?: CouponCode;
  showCheckoutButton?: boolean;
}

// Define the type for the shop context
export interface ShopContextType {
  products: Product[];
  featuredProducts?: Product[];
  cart: CartItem[];
  shippingAddress?: ShippingAddress | null;
  paymentInfo?: PaymentInfo | null;
  coupon?: CouponCode | null;
  coupons?: CouponCode[];
  subcategories?: Record<string, string[]>;
  
  // Product management
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  getProduct?: (id: string) => Product | undefined;
  fetchAllProducts: () => Product[];
  fetchProductsByCategory?: (category: string) => Product[];
  fetchFeaturedProducts?: () => Product[];
  getRelatedProducts?: (category: string, excludeProductId: string) => Product[];
  updateFeaturedProducts: (productId: string, isFeatured: boolean) => void;
  
  // Cart management
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateCartItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal?: () => number;
  getCartCount?: () => number;
  
  // Coupon management
  addCoupon?: (coupon: Omit<CouponCode, 'id'>) => void;
  updateCoupon?: (coupon: CouponCode) => void;
  deleteCoupon?: (id: string) => void;
  validateCoupon?: (code: string) => CouponCode | undefined;
  applyCoupon?: (code: string) => void;
  removeCoupon?: () => void;
  
  // Subcategory management
  updateSubcategories?: (subcategories: Record<string, string[]>) => void;
  
  // Admin-related properties
  isAdmin?: boolean;
  tryAdminLogin: (username: string, password: string) => boolean;
  reloadAllAdminData: (triggerDeploy?: boolean) => Promise<boolean>;
  
  // Vercel deployment properties
  isDeploying?: boolean;
  triggerDeployment?: () => Promise<boolean>;
  getDeploymentHookUrl?: () => string;
  setDeploymentHookUrl?: (url: string) => void;
  autoDeployEnabled?: boolean;
  toggleAutoDeploy?: (enabled: boolean) => void;
}
