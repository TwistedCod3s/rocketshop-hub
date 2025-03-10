
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
    
    try {
      // Call the Vercel deployment hook
      const response = await fetch(deployHookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        toast({
          title: "Deployment triggered",
          description: "Changes are being deployed to Vercel. This may take a few minutes.",
        });
        return true;
      } else {
        const errorData = await response.text();
        console.error("Deployment error:", errorData);
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
