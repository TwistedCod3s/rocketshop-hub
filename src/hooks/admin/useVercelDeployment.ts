
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { writeDataToFile } from '@/utils/fileSystemUtils';

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
      // Create a snapshot of all localStorage data
      const dataToSave = {};
      
      // Get products data
      const products = localStorage.getItem('ROCKETRY_SHOP_PRODUCTS_V7');
      if (products) {
        dataToSave['products'] = JSON.parse(products);
        await writeDataToFile('products.json', JSON.parse(products));
      }
      
      // Get category images data
      const categoryImages = localStorage.getItem('ROCKETRY_SHOP_CATEGORY_IMAGES_V7');
      if (categoryImages) {
        dataToSave['categoryImages'] = JSON.parse(categoryImages);
        await writeDataToFile('categoryImages.json', JSON.parse(categoryImages));
      }
      
      // Get subcategories data
      const subcategories = localStorage.getItem('ROCKETRY_SHOP_SUBCATEGORIES_V7');
      if (subcategories) {
        dataToSave['subcategories'] = JSON.parse(subcategories);
        await writeDataToFile('subcategories.json', JSON.parse(subcategories));
      }
      
      // Get coupons data
      const coupons = localStorage.getItem('ROCKETRY_SHOP_COUPONS_V7');
      if (coupons) {
        dataToSave['coupons'] = JSON.parse(coupons);
        await writeDataToFile('coupons.json', JSON.parse(coupons));
      }
      
      // Write a combined data file for easy access
      await writeDataToFile('adminData.json', dataToSave);
      
      // Also write to the initialProducts data file to make it part of the codebase
      await writeDataToFile('../data/initialProducts.ts', 
        `export const initialProducts = ${JSON.stringify(dataToSave.products, null, 2)};`
      );
      
      console.log("Successfully wrote admin data to codebase");
      return true;
    } catch (error) {
      console.error("Error writing admin data to codebase:", error);
      return false;
    }
  }, []);

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
