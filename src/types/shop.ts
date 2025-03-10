export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  subcategory?: string;
  featured: boolean;
  inStock: boolean;
  discount?: number;
  rating?: number;
  numReviews?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  expiryDate: string;
}

export interface ShopContextType {
  // Products
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  getProduct?: (productId: string) => Product | undefined;
  fetchAllProducts: () => Product[];
  fetchProductsByCategory?: (category: string) => Product[];
  getRelatedProducts?: (category: string, excludeProductId: string) => Product[];
  reloadProductsFromStorage?: () => void;
  
  // Featured products
  featuredProducts?: Product[];
  updateFeaturedProducts: (productId: string, isFeatured: boolean) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal?: () => number;
  getCartCount?: () => number;
  
  // Admin
  isAdmin?: boolean;
  tryAdminLogin: (password: string) => boolean;
  reloadAllAdminData: (triggerDeploy?: boolean) => Promise<boolean>;
  
  // Category data
  categoryImages?: Record<string, string>;
  updateCategoryImage?: (categorySlug: string, imageUrl: string) => void;
  
  // Subcategories
  subcategories?: Record<string, string[]>;
  updateSubcategories?: (category: string, newSubcategories: string[]) => void;
  
  // Coupons
  coupons?: Coupon[];
  addCoupon?: (coupon: Coupon) => void;
  updateCoupon?: (coupon: Coupon) => void;
  deleteCoupon?: (couponId: string) => void;
  validateCoupon?: (code: string) => Coupon | null;
  
  // Deployment
  isDeploying?: boolean;
  triggerDeployment?: () => Promise<void>;
  getDeploymentHookUrl?: () => string;
  setDeploymentHookUrl?: (url: string) => void;
  autoDeployEnabled?: boolean;
  toggleAutoDeploy?: (enabled: boolean) => void;
}
