
export interface Product {
  id: string;
  name: string;
  description: string;
  fullDescription?: string;
  price: number;
  category: string;
  subcategory?: string;
  images: string[];
  inStock: boolean;
  featured: boolean;
  rating: number;
  specifications?: {
    name: string;
    value: string;
  }[];
  reviews?: {
    user: string;
    rating: number;
    comment: string;
    date: string;
  }[];
  quantity?: number;
  inventory?: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface CouponCode {
  id: string;
  code: string;
  discountPercentage: number;
  active: boolean;
  description?: string;
}

export interface CartSummaryProps {
  cart: CartItem[];
  subtotal?: number;
  itemCount?: number;
}

export interface ShopContextType {
  products: Product[];
  featuredProducts: Product[];
  cart: CartItem[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  getProduct: (productId: string) => Product | undefined;
  fetchAllProducts: () => Product[];
  fetchProductsByCategory: (category: string) => Product[];
  fetchFeaturedProducts: () => Product[];
  getRelatedProducts: (category: string, excludeProductId: string) => Product[];
  updateFeaturedProducts: (productId: string, isFeatured: boolean) => void;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  isAdmin?: boolean;
  tryAdminLogin: (username: string, password: string) => boolean;
  subcategories: Record<string, string[]>;
  updateSubcategories: (category: string, subcategories: string[]) => void;
  coupons: CouponCode[];
  addCoupon: (coupon: Omit<CouponCode, 'id'>) => void;
  updateCoupon: (coupon: CouponCode) => void;
  deleteCoupon: (couponId: string) => void;
  validateCoupon: (code: string) => CouponCode | undefined;
  reloadAllAdminData: () => void;
}

export interface Category {
  name: string;
  slug: string;
  subcategories: string[];
}
