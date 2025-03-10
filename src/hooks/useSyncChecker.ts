
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
  const checkForUpdates = useCallback(async (forceCheck = false) => {
    try {
      // Skip if already syncing
      if (isSyncing && !forceCheck) return;
      
      console.log("Checking for updates in the database...");
      setIsSyncing(true);
      
      // Get latest timestamps from the database
      const latestTimestamp = await dbHelpers.getLatestUpdateTimestamp();
      const localTimestamp = getLastSyncTimestamp();
      
      console.log("Latest database timestamp:", latestTimestamp);
      console.log("Local timestamp:", localTimestamp);
      
      // Check if we need to synchronize
      if (forceCheck || needsSynchronization(localTimestamp, latestTimestamp)) {
        console.log("New data detected or force check requested, synchronizing...");
        
        // Try to use the admin reload function first (more comprehensive)
        if (reloadAllAdminData) {
          const success = await reloadAllAdminData(false);
          if (success) {
            toast({
              title: "Updated from database",
              description: "New changes were detected and loaded from the database"
            });
            console.log("Successfully reloaded all admin data");
          } else {
            console.log("reloadAllAdminData failed, trying alternative methods");
            await tryAlternativeSyncMethods();
          }
        } else {
          await tryAlternativeSyncMethods();
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

  // Helper function to try alternative sync methods
  const tryAlternativeSyncMethods = useCallback(async () => {
    // Try loading just the products from Supabase
    const success = await loadProductsFromSupabase();
    if (success) {
      toast({
        title: "Products updated",
        description: "New products were loaded from the database"
      });
      console.log("Successfully loaded products from Supabase");
    } else {
      // As final fallback, reload from localStorage
      console.log("Couldn't load from database, using localStorage...");
      reloadProductsFromStorage();
      toast({
        title: "Sync attempted",
        description: "Using local data as database sync failed"
      });
    }
  }, [loadProductsFromSupabase, reloadProductsFromStorage, toast]);

  // Set up periodic checking
  useEffect(() => {
    // Initial check on mount
    checkForUpdates(true); // Force an initial check
    
    // Set up interval (check every 15 seconds instead of 30)
    const intervalId = setInterval(() => checkForUpdates(), 15000);
    
    // Also check when sync events are triggered
    const handleSyncEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      console.log("Sync event detected, checking for updates...", customEvent.detail);
      checkForUpdates(true); // Force a check on sync event
    };
    
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === "ROCKETRY_SHOP_SYNC_TRIGGER_V7" || 
          e.key === "ROCKETRY_LAST_SYNC_TIMESTAMP" ||
          e.key === "EXTERNAL_SYNC_TRIGGER") {
        console.log(`Storage event detected for ${e.key}, force checking for updates`);
        checkForUpdates(true); // Force a check on storage event
      }
    };
    
    // Listen for all relevant events
    window.addEventListener('rocketry-sync-trigger-v7', handleSyncEvent);
    window.addEventListener('storage', handleStorageEvent);
    
    // Clean up
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('rocketry-sync-trigger-v7', handleSyncEvent);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [checkForUpdates]);

  return {
    lastChecked,
    isSyncing,
    checkForUpdates: () => checkForUpdates(true) // Expose a function that always forces a check
  };
}
