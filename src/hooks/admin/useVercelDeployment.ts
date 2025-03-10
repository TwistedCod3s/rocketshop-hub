
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Product, Coupon } from '@/types/shop';
import { saveAdminDataToDatabase } from '@/utils/databaseUtils';

// Define a type for the admin data structure
interface AdminData {
  products?: Product[];
  categoryImages?: Record<string, string>;
  subcategories?: Record<string, string[]>;
  coupons?: Coupon[];
  [key: string]: any; // Allow for additional properties
}

export function useVercelDeployment() {
  const [isDeploying, setIsDeploying] = useState(false);
  const { toast } = useToast();

  // Store the Vercel deployment hook URL in localStorage for configuration
  const getDeploymentHookUrl = useCallback(() => {
    return localStorage.getItem('VERCEL_DEPLOYMENT_HOOK_URL') || '';
  }, []);

  const setDeploymentHookUrl = useCallback((url: string) => {
    localStorage.setItem('VERCEL_DEPLOYMENT_HOOK_URL', url);
    console.log("Deployment hook URL saved:", url);
  }, []);

  // Function to write admin data to the database
  const writeAdminDataToDatabase = useCallback(async (): Promise<boolean> => {
    console.log("Writing admin data to database...");
    
    try {
      // Create a snapshot of all localStorage data with proper typing
      const dataToSave: AdminData = {};
      
      // Get products data
      const products = localStorage.getItem('ROCKETRY_SHOP_PRODUCTS_V7');
      let parsedProducts: Product[] = [];
      if (products) {
        try {
          parsedProducts = JSON.parse(products);
          dataToSave.products = parsedProducts;
        } catch (e) {
          console.error("Error parsing products data:", e);
          toast({
            title: "Error processing products data",
            description: "Could not parse products data from localStorage",
            variant: "destructive"
          });
        }
      }
      
      // Get category images data
      const categoryImages = localStorage.getItem('ROCKETRY_SHOP_CATEGORY_IMAGES_V7');
      let parsedImages: Record<string, string> = {};
      if (categoryImages) {
        try {
          parsedImages = JSON.parse(categoryImages);
          dataToSave.categoryImages = parsedImages;
        } catch (e) {
          console.error("Error parsing category images data:", e);
        }
      }
      
      // Get subcategories data
      const subcategories = localStorage.getItem('ROCKETRY_SHOP_SUBCATEGORIES_V7');
      let parsedSubcategories: Record<string, string[]> = {};
      if (subcategories) {
        try {
          parsedSubcategories = JSON.parse(subcategories);
          dataToSave.subcategories = parsedSubcategories;
        } catch (e) {
          console.error("Error parsing subcategories data:", e);
        }
      }
      
      // Get coupons data
      const coupons = localStorage.getItem('ROCKETRY_SHOP_COUPONS_V7');
      let parsedCoupons: Coupon[] = [];
      if (coupons) {
        try {
          parsedCoupons = JSON.parse(coupons);
          dataToSave.coupons = parsedCoupons;
        } catch (e) {
          console.error("Error parsing coupons data:", e);
        }
      }
      
      // Save all data to database
      await saveAdminDataToDatabase(
        parsedProducts, 
        parsedImages, 
        parsedSubcategories, 
        parsedCoupons
      );
      
      console.log("Successfully wrote all admin data to database");
      return true;
    } catch (error) {
      console.error("Error writing admin data to database:", error);
      toast({
        title: "Error writing data",
        description: error instanceof Error ? error.message : "Failed to write data to database",
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);

  // Trigger the Vercel deployment
  const triggerDeployment = useCallback(async (): Promise<boolean> => {
    const deployHookUrl = getDeploymentHookUrl();
    
    if (!deployHookUrl) {
      toast({
        title: "Deployment failed",
        description: "No Vercel deployment hook URL configured. Please set it in the admin settings.",
        variant: "destructive"
      });
      return false;
    }

    setIsDeploying(true);
    console.log("Starting Vercel deployment with hook URL:", deployHookUrl);
    
    try {
      // First, write the admin data to the database
      const writeSuccess = await writeAdminDataToDatabase();
      
      if (!writeSuccess) {
        toast({
          title: "Deployment failed",
          description: "Failed to write admin data to database.",
          variant: "destructive"
        });
        return false;
      }
      
      // No need to trigger a new deployment for content changes
      // The website can now read directly from the database
      
      // Clear pending changes flag after successful database update
      localStorage.setItem('ROCKETRY_SHOP_CHANGES_PENDING', 'false');
      
      // Set last deployment time
      const now = new Date().toISOString();
      localStorage.setItem('LAST_DEPLOYMENT_TIME', now);
      
      toast({
        title: "Changes saved",
        description: "Your changes have been saved to the database and are now live.",
      });
      
      // Wait 2 seconds for visual feedback
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return true;
    } catch (error) {
      console.error("Database save error:", error);
      toast({
        title: "Failed to save changes",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsDeploying(false);
    }
  }, [getDeploymentHookUrl, writeAdminDataToDatabase, toast]);

  return {
    isDeploying,
    triggerDeployment,
    getDeploymentHookUrl,
    setDeploymentHookUrl,
    writeAdminDataToDatabase
  };
}
