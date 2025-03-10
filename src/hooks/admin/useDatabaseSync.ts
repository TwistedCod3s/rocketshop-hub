
import { useCallback } from "react";
import { dbHelpers } from "@/lib/supabase";
import { SYNC_KEY } from "./adminUtils";
import { useToast } from "../use-toast";

export function useDatabaseSync(
  categoryImagesReload: () => void,
  subcategoriesReload: () => void,
  couponsReload: () => void,
  productsReload: () => void
) {
  const { toast } = useToast();

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
      categoryImagesReload();
      subcategoriesReload();
      couponsReload();
      productsReload();
      
      return true;
    } catch (error) {
      console.error("Error syncing from Supabase to localStorage:", error);
      throw error;
    }
  }, [
    categoryImagesReload,
    subcategoriesReload,
    couponsReload,
    productsReload
  ]);
  
  // Function to force reload all admin data and propagate to all users
  const reloadAllAdminData = useCallback(async (triggerDeploy?: boolean) => {
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
      
      return true;
    } catch (error) {
      console.error("Error in reloadAllAdminData:", error);
      
      // Use fallback mechanism - only reload from localStorage
      console.log("Using fallback: reloading only from localStorage");
      try {
        // Reload all admin data
        categoryImagesReload();
        subcategoriesReload();
        couponsReload();
        
        // Also reload products
        if (productsReload) {
          productsReload();
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
    categoryImagesReload,
    subcategoriesReload,
    couponsReload,
    productsReload,
    toast
  ]);

  return {
    syncFromSupabase,
    reloadAllAdminData
  };
}
