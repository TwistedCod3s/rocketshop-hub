
import { useAdminAuth } from "./admin/useAdminAuth";
import { useCategoryImages } from "./admin/useCategoryImages";
import { useSubcategories } from "./admin/useSubcategories";
import { useCoupons } from "./admin/useCoupons";
import { useEffect } from "react";

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
  
  return {
    // Admin authentication
    isAdmin: auth.isAdmin,
    tryAdminLogin: auth.tryAdminLogin,
    
    // Category images management
    categoryImages: categoryImagesHook.categoryImages,
    handleFileUpload: categoryImagesHook.handleFileUpload,
    updateCategoryImage: categoryImagesHook.updateCategoryImage,
    
    // Subcategories management
    subcategories: subcategoriesHook.subcategories,
    updateSubcategories: subcategoriesHook.updateSubcategories,
    
    // Coupons management
    coupons: couponsHook.coupons,
    addCoupon: couponsHook.addCoupon,
    updateCoupon: couponsHook.updateCoupon,
    deleteCoupon: couponsHook.deleteCoupon,
    validateCoupon: couponsHook.validateCoupon
  };
}
