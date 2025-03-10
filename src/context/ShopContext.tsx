
import { createContext, useContext, useEffect } from "react";
import { ShopContextType } from "@/types/shop";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useFeaturedProducts } from "@/hooks/useFeaturedProducts";
import { useAdmin } from "@/hooks/useAdmin";

// Create context with default values
const ShopContext = createContext<ShopContextType>({
  products: [],
  featuredProducts: [],
  cart: [],
  addProduct: () => {},
  updateProduct: () => {},
  removeProduct: () => {},
  getProduct: () => undefined,
  fetchAllProducts: () => [],
  fetchProductsByCategory: () => [],
  fetchFeaturedProducts: () => [],
  getRelatedProducts: () => [],
  updateFeaturedProducts: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  updateCartItemQuantity: () => {},
  clearCart: () => {},
  getCartTotal: () => 0,
  getCartCount: () => 0,
  tryAdminLogin: () => false,
  subcategories: {},
  updateSubcategories: () => {},
  coupons: [],
  addCoupon: () => {},
  updateCoupon: () => {},
  deleteCoupon: () => {},
  validateCoupon: () => undefined,
  reloadAllAdminData: () => {},
});

// Hook for using the shop context
export const useShopContext = () => useContext(ShopContext);
export const useShop = useShopContext; // Alias for useShopContext

// Provider component
export const ShopProvider = ({ children }) => {
  // Use our custom hooks
  const productsHook = useProducts();
  const cartHook = useCart();
  const featuredHook = useFeaturedProducts(productsHook.products);
  const adminHook = useAdmin();
  
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
    ...productsHook,
    ...cartHook,
    ...featuredHook,
    ...adminHook,
    // Manual spread for proper typing
    products: productsHook.products,
    featuredProducts: featuredHook.featuredProducts,
    cart: cartHook.cart,
    isAdmin: adminHook.isAdmin,
    subcategories: adminHook.subcategories,
    updateSubcategories: adminHook.updateSubcategories,
    coupons: adminHook.coupons,
    addCoupon: adminHook.addCoupon,
    updateCoupon: adminHook.updateCoupon,
    deleteCoupon: adminHook.deleteCoupon,
    validateCoupon: adminHook.validateCoupon,
    reloadAllAdminData: adminHook.reloadAllAdminData,
  };
  
  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};
