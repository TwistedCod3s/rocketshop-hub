import { createContext, useContext, useEffect } from "react";
import { ShopContextType } from "@/types/shop";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useFeaturedProducts } from "@/hooks/useFeaturedProducts";
import { useAdmin } from "@/hooks/useAdmin";
import { useVercelDeployment } from "@/hooks/admin/useVercelDeployment";

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
  const deploymentHook = useVercelDeployment();
  
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
  
  // Wrap triggerDeployment to return Promise<boolean> instead of Promise<void>
  const wrappedTriggerDeployment = async () => {
    if (deploymentHook.triggerDeployment) {
      await deploymentHook.triggerDeployment();
      return true;
    }
    return false;
  };
  
  // Combine all hooks into a single context value
  const value: ShopContextType = {
    // Manual spread for proper typing
    products: productsHook.products,
    cart: cartHook.cart,
    featuredProducts: featuredHook.featuredProducts,
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
    getProduct: productsHook.getProduct,
    getRelatedProducts: productsHook.getRelatedProducts,
    fetchProductsByCategory: productsHook.fetchProductsByCategory,
    getCartTotal: cartHook.getCartTotal,
    getCartCount: cartHook.getCartCount,
    reloadAllAdminData: adminHook.reloadAllAdminData,
    isDeploying: deploymentHook.isDeploying,
    triggerDeployment: wrappedTriggerDeployment,
    getDeploymentHookUrl: deploymentHook.getDeploymentHookUrl,
    setDeploymentHookUrl: deploymentHook.setDeploymentHookUrl,
    autoDeployEnabled: adminHook.autoDeployEnabled,
    toggleAutoDeploy: adminHook.toggleAutoDeploy,
    fetchFeaturedProducts: featuredHook.fetchFeaturedProducts,
    loadProductsFromSupabase: productsHook.loadProductsFromSupabase,
    reloadProductsFromStorage: productsHook.reloadProductsFromStorage,
    
    // Rest of the properties from hooks
    ...productsHook,
    ...cartHook,
    ...featuredHook,
    ...adminHook,
  };
  
  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};
