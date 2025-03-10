
import { useEffect, useCallback, useState } from 'react';
import { dbHelpers } from '@/lib/supabase';
import { getLastSyncTimestamp, updateSyncTimestamp, needsSynchronization } from '@/utils/schemaUtils';
import { useToast } from './use-toast';

/**
 * Hook to periodically check for database changes and sync when needed
 */
export function useSyncChecker(
  reloadProductsFromStorage: () => void,
  loadProductsFromSupabase: () => Promise<boolean>,
  reloadAllAdminData?: (triggerDeploy?: boolean) => Promise<boolean>
) {
  const [lastChecked, setLastChecked] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  // Function to check if there are updates in the database
  const checkForUpdates = useCallback(async () => {
    try {
      // Skip if already syncing
      if (isSyncing) return;
      
      console.log("Checking for updates in the database...");
      setIsSyncing(true);
      
      // Get latest timestamps from the database
      const latestTimestamp = await dbHelpers.getLatestUpdateTimestamp();
      const localTimestamp = getLastSyncTimestamp();
      
      console.log("Latest database timestamp:", latestTimestamp);
      console.log("Local timestamp:", localTimestamp);
      
      // Check if we need to synchronize
      if (needsSynchronization(localTimestamp, latestTimestamp)) {
        console.log("New data detected, synchronizing...");
        
        // Try to use the admin reload function first (more comprehensive)
        if (reloadAllAdminData) {
          await reloadAllAdminData(false);
          toast({
            title: "Updated from database",
            description: "New changes were detected and loaded from the database"
          });
        } else {
          // Fallback to just loading products
          const success = await loadProductsFromSupabase();
          if (success) {
            toast({
              title: "Products updated",
              description: "New products were loaded from the database"
            });
          } else {
            // As final fallback, reload from localStorage
            console.log("Couldn't load from database, using localStorage...");
            reloadProductsFromStorage();
          }
        }
        
        // Update the last sync timestamp
        updateSyncTimestamp();
      } else {
        console.log("No new updates detected.");
      }
      
      setLastChecked(new Date().toISOString());
    } catch (error) {
      console.error("Error checking for updates:", error);
      // Still try to load from localStorage as fallback
      reloadProductsFromStorage();
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, loadProductsFromSupabase, reloadProductsFromStorage, reloadAllAdminData, toast]);

  // Set up periodic checking
  useEffect(() => {
    // Initial check on mount
    checkForUpdates();
    
    // Set up interval (check every 30 seconds)
    const intervalId = setInterval(checkForUpdates, 30000);
    
    // Also check when sync events are triggered
    const handleSyncEvent = () => {
      console.log("Sync event detected, checking for updates...");
      checkForUpdates();
    };
    
    window.addEventListener('rocketry-sync-trigger-v7', handleSyncEvent);
    
    // Clean up
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('rocketry-sync-trigger-v7', handleSyncEvent);
    };
  }, [checkForUpdates]);

  return {
    lastChecked,
    isSyncing,
    checkForUpdates
  };
}
