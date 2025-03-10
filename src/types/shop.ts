import { Category } from "@/constants/categories";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: Category;
  subcategory: string;
  isFeatured: boolean;
  quantity?: number;
}

export interface CartItem extends Product {
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

// Define the type for the shop context
export interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  shippingAddress: ShippingAddress | null;
  paymentInfo: PaymentInfo | null;
  coupon: CouponCode | null;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateCartItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  calculateTotal: () => number;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
  setShippingAddress: (address: ShippingAddress) => void;
  setPaymentInfo: (paymentInfo: PaymentInfo) => void;
  fetchAllProducts: () => Product[];
  fetchProductById: (id: string) => Product | undefined;
  updateFeaturedProducts: (productId: string, isFeatured: boolean) => void;
  
  // Admin-related properties
  isAdmin: boolean;
  tryAdminLogin: (username: string, password: string) => boolean;
  reloadAllAdminData: (triggerDeploy?: boolean) => Promise<boolean>;
  
  // Vercel deployment properties
  isDeploying: boolean;
  triggerDeployment: () => Promise<boolean>;
  getDeploymentHookUrl: () => string;
  setDeploymentHookUrl: (url: string) => void;
  autoDeployEnabled: boolean;
  toggleAutoDeploy: (enabled: boolean) => void;
}
