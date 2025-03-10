
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { writeDataToFile } from '@/utils/fileSystemUtils';
import { Product, Coupon } from '@/types/shop';

// Define a type for the admin data structure to fix the TypeScript error
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

  // Function to write admin data directly to the codebase
  const writeAdminDataToCodebase = useCallback(async (): Promise<boolean> => {
    console.log("Writing admin data directly to codebase...");
    
    try {
      // Create a snapshot of all localStorage data with proper typing
      const dataToSave: AdminData = {};
      
      // Get products data
      const products = localStorage.getItem('ROCKETRY_SHOP_PRODUCTS_V7');
      if (products) {
        const parsedProducts = JSON.parse(products);
        dataToSave.products = parsedProducts;
        await writeDataToFile('data/products.json', parsedProducts);
        console.log("Wrote products data");
      }
      
      // Get category images data
      const categoryImages = localStorage.getItem('ROCKETRY_SHOP_CATEGORY_IMAGES_V7');
      if (categoryImages) {
        const parsedImages = JSON.parse(categoryImages);
        dataToSave.categoryImages = parsedImages;
        await writeDataToFile('data/categoryImages.json', parsedImages);
        console.log("Wrote category images data");
      }
      
      // Get subcategories data
      const subcategories = localStorage.getItem('ROCKETRY_SHOP_SUBCATEGORIES_V7');
      if (subcategories) {
        const parsedSubcategories = JSON.parse(subcategories);
        dataToSave.subcategories = parsedSubcategories;
        await writeDataToFile('data/subcategories.json', parsedSubcategories);
        console.log("Wrote subcategories data");
      }
      
      // Get coupons data
      const coupons = localStorage.getItem('ROCKETRY_SHOP_COUPONS_V7');
      if (coupons) {
        const parsedCoupons = JSON.parse(coupons);
        dataToSave.coupons = parsedCoupons;
        await writeDataToFile('data/coupons.json', parsedCoupons);
        console.log("Wrote coupons data");
      }
      
      // Write a combined data file for easy access
      await writeDataToFile('data/adminData.json', dataToSave);
      console.log("Wrote combined admin data");
      
      // Also write to the initialProducts data file to make it part of the codebase
      // This is the only file explicitly included in vercel.json
      if (dataToSave.products) {
        const tsContent = `export const initialProducts = ${JSON.stringify(dataToSave.products, null, 2)};`;
        await writeDataToFile('data/initialProducts.ts', tsContent);
        console.log("Updated initialProducts.ts");
      }
      
      console.log("Successfully wrote all admin data to codebase");
      return true;
    } catch (error) {
      console.error("Error writing admin data to codebase:", error);
      toast({
        title: "Error writing data",
        description: error instanceof Error ? error.message : "Failed to write data to codebase",
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
      // First, write the admin data to the codebase
      const writeSuccess = await writeAdminDataToCodebase();
      
      if (!writeSuccess) {
        toast({
          title: "Deployment failed",
          description: "Failed to write admin data to codebase.",
          variant: "destructive"
        });
        return false;
      }
      
      // Add a timestamp parameter to bust any caching
      const timestamp = Date.now();
      const urlWithTimestamp = `${deployHookUrl}${deployHookUrl.includes('?') ? '&' : '?'}timestamp=${timestamp}`;
      
      // Call the Vercel deployment hook
      const response = await fetch(urlWithTimestamp, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          force: true,             // Force a deployment even if no changes detected
          timestamp: timestamp,    // Include timestamp to ensure uniqueness
          trigger: 'admin-panel',  // Identify source of deployment
        })
      });
      
      if (response.ok) {
        console.log("Deployment successfully triggered with code updates");
        toast({
          title: "Deployment triggered",
          description: "Your changes have been written to the codebase and are being deployed to Vercel.",
        });
        
        // Clear pending changes flag after successful deployment
        localStorage.setItem('ROCKETRY_SHOP_CHANGES_PENDING', 'false');
        
        // Set last deployment time
        const now = new Date().toISOString();
        localStorage.setItem('LAST_DEPLOYMENT_TIME', now);
        
        // Wait 2 seconds to allow the deployment to start
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        return true;
      } else {
        const errorData = await response.text();
        console.error("Deployment error response:", errorData);
        toast({
          title: "Deployment failed",
          description: `Error: ${response.status} ${response.statusText}`,
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error("Deployment error:", error);
      toast({
        title: "Deployment failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsDeploying(false);
    }
  }, [getDeploymentHookUrl, writeAdminDataToCodebase, toast]);

  return {
    isDeploying,
    triggerDeployment,
    getDeploymentHookUrl,
    setDeploymentHookUrl,
    writeAdminDataToCodebase
  };
}
