
import { useAdminAuth } from "./admin/useAdminAuth";
import { useCategoryImages } from "./admin/useCategoryImages";
import { useSubcategories } from "./admin/useSubcategories";
import { useCoupons } from "./admin/useCoupons";

export function useAdmin() {
  const auth = useAdminAuth();
  const categoryImagesHook = useCategoryImages();
  const subcategoriesHook = useSubcategories();
  const couponsHook = useCoupons();
  
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
