
export interface Product {
  id: string;
  name: string;
  description: string;
  fullDescription?: string;
  price: number;
  category: string;
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

export interface ShopContextType {
  products: Product[];
  featuredProducts: Product[];
  cart: CartItem[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  getProduct: (productId: string) => Product | undefined;
  fetchAllProducts: () => void;
  fetchProductsByCategory: (category: string) => void;
  fetchFeaturedProducts: () => void;
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
}

export interface CartSummaryProps {
  cart: CartItem[];
}
