
// Define all the types needed for the shop

export interface CartItem {
  id: string;
  name?: string;
  price?: number;
  quantity: number;
  image?: string;
  product: Product; // Add the product reference to CartItem
}

export interface Product {
  id: string;
  name: string;
  description: string;
  fullDescription?: string; // Add fullDescription property
  features?: string[];
  specification?: { [key: string]: string };
  specifications?: { name: string; value: string }[]; // Add specifications array
  price: number;
  compareAtPrice?: number;
  discount?: number;
  image?: string;
  images?: string[];
  inStock?: boolean;
  category?: string;
  subcategory?: string;
  featured?: boolean;
  tags?: string[];
  new?: boolean;
  relatedProducts?: string[];
  rating?: number;
  reviews?: {
    user: string;
    rating: number;
    comment: string;
    date: string;
  }[]; // Add reviews array
}

// Rename CouponCode to Coupon for consistency
export interface Coupon {
  id: string;
  code: string;
  discount: number;
  discountPercentage: number;
  expiryDate: string;
  active: boolean;
  description: string;
}

// Add CartSummaryProps interface
export interface CartSummaryProps {
  cart: CartItem[];
  subtotal?: number;
  itemCount?: number;
}

export interface ShopContextType {
  // Products
  products: Product[];
  getProduct?: (productId: string) => Product | undefined;
  getRelatedProducts?: (category: string, excludeProductId: string) => Product[];
  fetchProductsByCategory?: (category: string) => Product[];
  fetchAllProducts: () => Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  updateFeaturedProducts: (productId: string, isFeatured: boolean) => void;
  reloadProductsFromStorage: () => void;
  loadProductsFromSupabase: () => Promise<boolean>;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void; // Make quantity optional
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal?: () => number;
  getCartCount: () => number;
  
  // Featured products
  featuredProducts?: Product[];
  fetchFeaturedProducts?: () => Product[];
  
  // Admin
  isAdmin?: boolean;
  subcategories?: { [category: string]: string[] };
  updateSubcategories?: (category: string, subcategories: string[]) => void;
  coupons?: Coupon[];
  addCoupon?: (coupon: Omit<Coupon, 'id'>) => void; // No ID required when adding
  updateCoupon?: (coupon: Coupon) => void;
  deleteCoupon?: (couponId: string) => void;
  validateCoupon?: (code: string) => Coupon | null;
  categoryImages?: { [category: string]: string };
  updateCategoryImage?: (category: string, imageUrl: string) => void;
  reloadAllAdminData: (autoDeployAfterSync?: boolean) => Promise<boolean>;
  tryAdminLogin: (password: string) => boolean;
  
  // Deployment
  isDeploying?: boolean;
  triggerDeployment?: () => Promise<boolean>;
  getDeploymentHookUrl?: () => string;
  setDeploymentHookUrl?: (url: string) => void;
  autoDeployEnabled?: boolean;
  toggleAutoDeploy?: (enabled: boolean) => void;
}
