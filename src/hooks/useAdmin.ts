
import { useAdminAuth } from "./admin/useAdminAuth";
import { useCategoryImages } from "./admin/useCategoryImages";
import { useSubcategories } from "./admin/useSubcategories";
import { useCoupons } from "./admin/useCoupons";
import { useEffect, useCallback } from "react";

export function useAdmin() {
  const auth = useAdminAuth();
  const categoryImagesHook = useCategoryImages();
  const subcategoriesHook = useSubcategories();
  const couponsHook = useCoupons();
  
  // Debug logging
  useEffect(() => {
    console.log("useAdmin hook initialized or re-rendered");
    
    return () => {
      console.log("useAdmin hook unmounted");
    };
  }, []);

  // Debug logging for state changes
  useEffect(() => {
    console.log("useAdmin: categoryImages updated", categoryImagesHook.categoryImages);
  }, [categoryImagesHook.categoryImages]);

  useEffect(() => {
    console.log("useAdmin: subcategories updated", subcategoriesHook.subcategories);
  }, [subcategoriesHook.subcategories]);

  useEffect(() => {
    console.log("useAdmin: coupons updated", couponsHook.coupons);
  }, [couponsHook.coupons]);
  
  // Function to force reload all admin data
  const reloadAllAdminData = useCallback(() => {
    console.log("Forcing reload of all admin data");
    categoryImagesHook.reloadFromStorage();
    subcategoriesHook.reloadFromStorage();
    couponsHook.reloadFromStorage();
  }, [
    categoryImagesHook.reloadFromStorage,
    subcategoriesHook.reloadFromStorage,
    couponsHook.reloadFromStorage
  ]);
  
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
    reloadAllAdminData
  };
}
