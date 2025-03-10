import { useAdminAuth } from "./admin/useAdminAuth";
import { useCategoryImages } from "./admin/useCategoryImages";
import { useSubcategories } from "./admin/useSubcategories";
import { useCoupons } from "./admin/useCoupons";
import { useEffect, useCallback, useState } from "react";
import { useProducts } from "./useProducts";
import { SYNC_KEY } from "./admin/adminUtils";
import { useVercelDeployment } from "./admin/useVercelDeployment";

export function useAdmin() {
  const auth = useAdminAuth();
  const categoryImagesHook = useCategoryImages();
  const subcategoriesHook = useSubcategories();
  const couponsHook = useCoupons();
  const productsHook = useProducts();
  const vercelDeployment = useVercelDeployment();
  const [autoDeployEnabled, setAutoDeployEnabled] = useState<boolean>(
    localStorage.getItem('AUTO_DEPLOY_ENABLED') === 'true'
  );
  
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

  // Function to toggle auto-deployment
  const toggleAutoDeploy = useCallback((enabled: boolean) => {
    setAutoDeployEnabled(enabled);
    localStorage.setItem('AUTO_DEPLOY_ENABLED', enabled.toString());
  }, []);
  
  // Function to force reload all admin data and propagate to all users
  const reloadAllAdminData = useCallback(async (triggerDeploy = false) => {
    console.log("Forcing reload of all admin data and propagating to all users");
    
    // Reload all admin data
    categoryImagesHook.reloadFromStorage();
    subcategoriesHook.reloadFromStorage();
    couponsHook.reloadFromStorage();
    
    // Also reload products
    if (productsHook && productsHook.reloadProductsFromStorage) {
      productsHook.reloadProductsFromStorage();
      console.log("Reloaded products from storage");
    }
    
    // Set global sync trigger that will notify ALL browser tabs/windows
    const timestamp = new Date().toISOString();
    localStorage.setItem(SYNC_KEY, timestamp);
    console.log("Set global sync trigger:", timestamp);
    
    try {
      // Dispatch a custom sync event
      window.dispatchEvent(new CustomEvent("rocketry-sync-trigger-v7", { 
        detail: { timestamp } 
      }));
      
      // Also dispatch a storage event for cross-window communication
      window.dispatchEvent(new StorageEvent('storage', {
        key: SYNC_KEY,
        newValue: timestamp,
        storageArea: localStorage
      }));
      
      console.log("Dispatched global sync events to notify all users");
      
      // Trigger Vercel deployment if requested or auto-deploy is enabled
      if ((triggerDeploy || autoDeployEnabled) && vercelDeployment.getDeploymentHookUrl()) {
        console.log("Triggering Vercel deployment");
        await vercelDeployment.triggerDeployment();
      }
    } catch (error) {
      console.error("Error dispatching sync events:", error);
      
      // Use fallback mechanism - remove and re-add
      localStorage.removeItem(SYNC_KEY);
      setTimeout(() => {
        localStorage.setItem(SYNC_KEY, timestamp);
        console.log("Used fallback sync mechanism");
      }, 10);
    }
    
    return true;
  }, [
    categoryImagesHook.reloadFromStorage,
    subcategoriesHook.reloadFromStorage,
    couponsHook.reloadFromStorage,
    productsHook,
    autoDeployEnabled,
    vercelDeployment
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
    
    // Deployment management
    isDeploying: vercelDeployment.isDeploying,
    triggerDeployment: vercelDeployment.triggerDeployment,
    getDeploymentHookUrl: vercelDeployment.getDeploymentHookUrl,
    setDeploymentHookUrl: vercelDeployment.setDeploymentHookUrl,
    autoDeployEnabled,
    toggleAutoDeploy,
    
    // Global admin functions
    reloadAllAdminData
  };
}
