
import { useAdminAuth } from "./admin/useAdminAuth";
import { useCategoryImages } from "./admin/useCategoryImages";
import { useSubcategories } from "./admin/useSubcategories";
import { useCoupons } from "./admin/useCoupons";
import { useEffect, useCallback, useState } from "react";
import { useProducts } from "./useProducts";
import { SYNC_KEY } from "./admin/adminUtils";
import { useVercelDeployment } from "./admin/useVercelDeployment";
import { useToast } from "./use-toast";
import { dbHelpers } from "@/lib/supabase";

export function useAdmin() {
  const auth = useAdminAuth();
  const categoryImagesHook = useCategoryImages();
  const subcategoriesHook = useSubcategories();
  const couponsHook = useCoupons();
  const productsHook = useProducts();
  const vercelDeployment = useVercelDeployment();
  const { toast } = useToast();
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
    // If auto-deploy is enabled, schedule a deployment when data changes
    if (autoDeployEnabled && Object.keys(categoryImagesHook.categoryImages).length > 0) {
      const pendingChanges = localStorage.getItem('ROCKETRY_SHOP_CHANGES_PENDING');
      if (pendingChanges === 'true') {
        console.log("Auto-deploy: Changes detected, scheduling deployment");
        setTimeout(() => reloadAllAdminData(true), 2000);
      }
    }
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
    console.log(`Auto-deploy ${enabled ? 'enabled' : 'disabled'}`);
    
    // If enabling and there are pending changes, trigger a deployment
    if (enabled && localStorage.getItem('ROCKETRY_SHOP_CHANGES_PENDING') === 'true') {
      toast({
        title: "Pending changes detected",
        description: "Triggering deployment for previously made changes"
      });
      setTimeout(() => reloadAllAdminData(true), 1000);
    }
  }, [toast]);
  
  // Function to sync data from Supabase to localStorage
  const syncFromSupabase = useCallback(async () => {
    console.log("Attempting to sync from Supabase to localStorage...");
    try {
      // Get data from Supabase
      const [products, categoryImages, subcategories, coupons] = await Promise.all([
        dbHelpers.getProducts(),
        dbHelpers.getCategoryImages(),
        dbHelpers.getSubcategories(),
        dbHelpers.getCoupons()
      ]);
      
      console.log("Fetched data from Supabase:", {
        productsCount: products.length,
        categoryImagesCount: Object.keys(categoryImages).length,
        subcategoriesCount: Object.keys(subcategories).length,
        couponsCount: coupons.length
      });
      
      // Update localStorage with fetched data (if there is any)
      if (products.length > 0) {
        localStorage.setItem('ROCKETRY_SHOP_PRODUCTS_V7', JSON.stringify(products));
        console.log(`Updated localStorage with ${products.length} products from Supabase`);
      }
      
      if (Object.keys(categoryImages).length > 0) {
        localStorage.setItem('ROCKETRY_SHOP_CATEGORY_IMAGES_V7', JSON.stringify(categoryImages));
        console.log(`Updated localStorage with ${Object.keys(categoryImages).length} category images from Supabase`);
      }
      
      if (Object.keys(subcategories).length > 0) {
        localStorage.setItem('ROCKETRY_SHOP_SUBCATEGORIES_V7', JSON.stringify(subcategories));
        console.log(`Updated localStorage with subcategories for ${Object.keys(subcategories).length} categories from Supabase`);
      }
      
      if (coupons.length > 0) {
        localStorage.setItem('ROCKETRY_SHOP_COUPONS_V7', JSON.stringify(coupons));
        console.log(`Updated localStorage with ${coupons.length} coupons from Supabase`);
      }
      
      // Now force reload all hooks to update their state from localStorage
      categoryImagesHook.reloadFromStorage();
      subcategoriesHook.reloadFromStorage();
      couponsHook.reloadFromStorage();
      productsHook.reloadProductsFromStorage();
      
      return true;
    } catch (error) {
      console.error("Error syncing from Supabase to localStorage:", error);
      throw error;
    }
  }, [
    categoryImagesHook.reloadFromStorage,
    subcategoriesHook.reloadFromStorage,
    couponsHook.reloadFromStorage,
    productsHook.reloadProductsFromStorage
  ]);
  
  // Function to force reload all admin data and propagate to all users
  const reloadAllAdminData = useCallback(async (triggerDeploy = false) => {
    console.log("Forcing reload of all admin data and propagating to all users");
    
    try {
      // First try to load fresh data from Supabase
      await syncFromSupabase();
      console.log("Successfully synced from Supabase to localStorage");
        
      // Set global sync trigger that will notify ALL browser tabs/windows
      const timestamp = new Date().toISOString();
      localStorage.setItem(SYNC_KEY, timestamp);
      console.log("Set global sync trigger:", timestamp);
      
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
      
      // Clear the pending changes flag
      localStorage.setItem('ROCKETRY_SHOP_CHANGES_PENDING', 'false');
      
      // Trigger Vercel deployment if requested or auto-deploy is enabled
      if ((triggerDeploy || autoDeployEnabled) && vercelDeployment.getDeploymentHookUrl()) {
        console.log("Triggering Vercel deployment");
        const success = await vercelDeployment.triggerDeployment();
        if (success) {
          toast({
            title: "Deployment successful",
            description: "Your changes are being deployed and will be visible to all users shortly"
          });
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error in reloadAllAdminData:", error);
      
      // Use fallback mechanism - only reload from localStorage
      console.log("Using fallback: reloading only from localStorage");
      try {
        // Reload all admin data
        categoryImagesHook.reloadFromStorage();
        subcategoriesHook.reloadFromStorage();
        couponsHook.reloadFromStorage();
        
        // Also reload products
        if (productsHook && productsHook.reloadProductsFromStorage) {
          productsHook.reloadProductsFromStorage();
          console.log("Reloaded products from storage");
        }
        
        // Still set the sync trigger
        const timestamp = new Date().toISOString();
        localStorage.setItem(SYNC_KEY, timestamp);
        window.dispatchEvent(new CustomEvent("rocketry-sync-trigger-v7", { 
          detail: { timestamp } 
        }));
        
        toast({
          title: "Database sync failed",
          description: "Synchronized only with localStorage. Database operation failed.",
          variant: "destructive"
        });
        
        return false;
      } catch (fallbackError) {
        console.error("Error in fallback reloadAllAdminData:", fallbackError);
        throw fallbackError;
      }
    }
  }, [
    syncFromSupabase,
    categoryImagesHook.reloadFromStorage,
    subcategoriesHook.reloadFromStorage,
    couponsHook.reloadFromStorage,
    productsHook,
    autoDeployEnabled,
    vercelDeployment,
    toast
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
    reloadAllAdminData,
    syncFromSupabase
  };
}
