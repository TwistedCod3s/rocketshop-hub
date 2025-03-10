
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useVercelDeployment() {
  const [isDeploying, setIsDeploying] = useState(false);
  const { toast } = useToast();

  // Store the Vercel deployment hook URL in localStorage
  const getDeploymentHookUrl = useCallback(() => {
    return localStorage.getItem('VERCEL_DEPLOYMENT_HOOK_URL') || '';
  }, []);

  const setDeploymentHookUrl = useCallback((url: string) => {
    localStorage.setItem('VERCEL_DEPLOYMENT_HOOK_URL', url);
    console.log("Deployment hook URL saved:", url);
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
      // Create a complete snapshot of all localStorage data
      const storageSnapshot: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          if (value) {
            storageSnapshot[key] = value;
          }
        }
      }
      
      console.log("Created localStorage snapshot for deployment:", Object.keys(storageSnapshot).length, "items");
      
      // Add a timestamp parameter to bust any caching
      const timestamp = Date.now();
      const urlWithTimestamp = `${deployHookUrl}${deployHookUrl.includes('?') ? '&' : '?'}timestamp=${timestamp}`;
      
      // Call the Vercel deployment hook with explicit data
      const response = await fetch(urlWithTimestamp, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          force: true,             // Force a deployment even if no changes detected
          timestamp: timestamp,    // Include timestamp to ensure uniqueness
          trigger: 'admin-panel',  // Identify source of deployment
          storageData: storageSnapshot, // Include ALL localStorage data in the deployment payload
          // Explicitly include critical keys
          categoryImages: localStorage.getItem('ROCKETRY_SHOP_CATEGORY_IMAGES_V7'),
          subcategories: localStorage.getItem('ROCKETRY_SHOP_SUBCATEGORIES_V7'),
          coupons: localStorage.getItem('ROCKETRY_SHOP_COUPONS_V7'),
          products: localStorage.getItem('ROCKETRY_SHOP_PRODUCTS_V7')
        })
      });
      
      if (response.ok) {
        console.log("Deployment successfully triggered with complete data snapshot");
        toast({
          title: "Deployment triggered",
          description: "All changes are being deployed to Vercel. This may take a few minutes.",
        });
        
        // Clear pending changes flag after successful deployment
        localStorage.setItem('ROCKETRY_SHOP_CHANGES_PENDING', 'false');
        
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
  }, [getDeploymentHookUrl, toast]);

  return {
    isDeploying,
    triggerDeployment,
    getDeploymentHookUrl,
    setDeploymentHookUrl
  };
}
