
import { useAdminAuth } from "./admin/useAdminAuth";
import { useCategoryImages } from "./admin/useCategoryImages";
import { useSubcategories } from "./admin/useSubcategories";
import { useCoupons } from "./admin/useCoupons";
import { useEffect } from "react";
import { useProducts } from "./useProducts";
import { useDatabaseSync } from "./admin/useDatabaseSync";
import { useDataChangeMonitoring } from "./admin/useDataChangeMonitoring";

export function useAdmin() {
  const auth = useAdminAuth();
  const categoryImagesHook = useCategoryImages();
  const subcategoriesHook = useSubcategories();
  const couponsHook = useCoupons();
  const productsHook = useProducts();
  
  // Debug logging
  useEffect(() => {
    console.log("useAdmin hook initialized or re-rendered");
    
    return () => {
      console.log("useAdmin hook unmounted");
    };
  }, []);

  // Use the database sync hook
  const dbSync = useDatabaseSync(
    categoryImagesHook.reloadFromStorage,
    subcategoriesHook.reloadFromStorage,
    couponsHook.reloadFromStorage,
    productsHook.reloadProductsFromStorage
  );

  // Monitor data changes
  useDataChangeMonitoring(
    categoryImagesHook.categoryImages,
    subcategoriesHook.subcategories,
    couponsHook.coupons,
    false, // No auto-deployment, since we're using a database
    dbSync.reloadAllAdminData
  );
  
  return {
    // Admin authentication
    isAdmin: auth.isAdmin,
    tryAdminLogin: auth.tryAdminLogin,
    
    // Category images management
    categoryImages: categoryImagesHook.categoryImages,
    handleFileUpload: categoryImagesHook.handleFileUpload,
    updateCategoryImage: categoryImagesHook.updateCategoryImage,
    deleteCategoryImage: categoryImagesHook.deleteCategoryImage,
    
    // Subcategories management
    subcategories: subcategoriesHook.subcategories,
    updateSubcategories: subcategoriesHook.updateSubcategories,
    deleteCategory: subcategoriesHook.deleteCategory,
    
    // Coupons management
    coupons: couponsHook.coupons,
    addCoupon: couponsHook.addCoupon,
    updateCoupon: couponsHook.updateCoupon,
    deleteCoupon: couponsHook.deleteCoupon,
    validateCoupon: couponsHook.validateCoupon,
    
    // Global admin functions
    reloadAllAdminData: dbSync.reloadAllAdminData,
    syncFromSupabase: dbSync.syncFromSupabase
  };
}
