import { createContext, useContext, useEffect, ReactNode } from "react";
import { ShopContextType } from "@/types/shop";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useFeaturedProducts } from "@/hooks/useFeaturedProducts";
import { useAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";

// Create context with default values
const ShopContext = createContext<ShopContextType>({
  products: [],
  cart: [],
  addProduct: () => {},
  updateProduct: () => {},
  removeProduct: () => {},
  fetchAllProducts: () => [],
  updateFeaturedProducts: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  updateCartItemQuantity: () => {},
  clearCart: () => {},
  tryAdminLogin: () => false,
  reloadAllAdminData: async () => false,
  loadProductsFromSupabase: async () => false,
  reloadProductsFromStorage: () => {},
  getCartTotal: () => 0,
  getCartCount: () => 0,
  createCheckoutSession: async () => {},
  isCheckoutLoading: false,
});

// Hook for using the shop context
export const useShopContext = () => useContext(ShopContext);
export const useShop = useShopContext; // Alias for useShopContext

// Provider component with proper typing
interface ShopProviderProps {
  children: ReactNode;
}

export const ShopProvider = ({ children }: ShopProviderProps) => {
  const { toast } = useToast();
  
  // Use our custom hooks
  const productsHook = useProducts();
  const cartHook = useCart();
  const featuredHook = useFeaturedProducts(productsHook.products);
  const adminHook = useAdmin();
  const stripeHook = useStripeCheckout();
  
  // Force re-render when localStorage changes in other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith("ROCKETRY_SHOP_")) {
        console.log(`External storage change detected for ${e.key}`);
        // The individual hooks will handle their own updates
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  // Combine all hooks into a single context value
  const value: ShopContextType = {
    // Products
    products: productsHook.products,
    getProduct: productsHook.getProduct,
    getRelatedProducts: productsHook.getRelatedProducts,
    fetchProductsByCategory: productsHook.fetchProductsByCategory,
    fetchAllProducts: productsHook.fetchAllProducts,
    addProduct: productsHook.addProduct,
    updateProduct: productsHook.updateProduct,
    removeProduct: productsHook.removeProduct,
    updateFeaturedProducts: productsHook.updateFeaturedProducts,
    reloadProductsFromStorage: productsHook.reloadProductsFromStorage,
    loadProductsFromSupabase: productsHook.loadProductsFromSupabase,
    
    // Cart
    cart: cartHook.cart,
    addToCart: cartHook.addToCart,
    removeFromCart: cartHook.removeFromCart,
    updateCartItemQuantity: cartHook.updateCartItemQuantity,
    clearCart: cartHook.clearCart,
    getCartTotal: cartHook.getCartTotal,
    getCartCount: cartHook.getCartCount,
    
    // Featured products
    featuredProducts: featuredHook.featuredProducts,
    fetchFeaturedProducts: featuredHook.fetchFeaturedProducts,
    
    // Admin
    isAdmin: adminHook.isAdmin,
    subcategories: adminHook.subcategories,
    updateSubcategories: adminHook.updateSubcategories,
    coupons: adminHook.coupons,
    addCoupon: adminHook.addCoupon,
    updateCoupon: adminHook.updateCoupon,
    deleteCoupon: adminHook.deleteCoupon,
    validateCoupon: adminHook.validateCoupon,
    categoryImages: adminHook.categoryImages,
    updateCategoryImage: adminHook.updateCategoryImage,
    reloadAllAdminData: adminHook.reloadAllAdminData,
    tryAdminLogin: adminHook.tryAdminLogin,
    
    // Stripe Checkout
    createCheckoutSession: stripeHook.createCheckoutSession,
    isCheckoutLoading: stripeHook.isLoading,
  };
  
  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};
