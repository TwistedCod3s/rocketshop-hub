
// Helper function to load from storage with defaults
export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(key);
      if (stored) {
        console.log(`Loaded ${key} from localStorage`);
        return JSON.parse(stored);
      }
      // Initialize storage if not found
      localStorage.setItem(key, JSON.stringify(defaultValue));
      console.log(`Initialized ${key} in localStorage with defaults`);
    }
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
  }
  return defaultValue;
};

// Helper function to save state to localStorage and broadcast change
export const saveAndBroadcast = <T>(key: string, eventName: string, value: T): void => {
  try {
    // Make a deep copy to avoid reference issues
    const valueCopy = JSON.parse(JSON.stringify(value));
    
    // First save to localStorage
    localStorage.setItem(key, JSON.stringify(valueCopy));
    console.log(`Saved ${key} to localStorage`, valueCopy);
    
    // Then dispatch custom event for same-window communication
    const customEvent = new CustomEvent(eventName, { detail: valueCopy });
    window.dispatchEvent(customEvent);
    console.log(`Broadcast ${eventName} custom event`, valueCopy);
    
    // Then dispatch storage event manually for cross-window communication
    try {
      // Use a special sync key to force all clients to reload
      const syncKey = "ROCKETRY_SHOP_SYNC_TRIGGER";
      const timestamp = new Date().toISOString();
      localStorage.setItem(syncKey, timestamp);
      
      // Create and dispatch a storage event
      const storageEvent = new StorageEvent('storage', {
        key: key,
        newValue: JSON.stringify(valueCopy),
        storageArea: localStorage
      });
      window.dispatchEvent(storageEvent);
      
      // Also dispatch for the sync key itself
      const syncEvent = new StorageEvent('storage', {
        key: syncKey,
        newValue: timestamp,
        storageArea: localStorage
      });
      window.dispatchEvent(syncEvent);
      
      console.log(`Manually triggered storage events for ${key} and sync trigger`);
      
      // Add a backup entry with timestamp to ensure data persistence
      const backupKey = `${key}_BACKUP_${Date.now()}`;
      localStorage.setItem(backupKey, JSON.stringify(valueCopy));
      console.log(`Created backup for ${key} at ${backupKey}`);
      
      // Set a "dirty" flag to indicate that changes need to be deployed
      localStorage.setItem('ROCKETRY_SHOP_CHANGES_PENDING', 'true');
    } catch (e) {
      console.error("Failed to manually trigger storage event:", e);
      
      // Real fallback - remove and re-add the item
      const oldValue = localStorage.getItem(key);
      localStorage.removeItem(key);
      setTimeout(() => {
        localStorage.setItem(key, JSON.stringify(valueCopy));
        console.log("Used fallback storage sync mechanism for", key);
      }, 10);
    }
  } catch (error) {
    console.error(`Error in saveAndBroadcast for ${key}:`, error);
  }
};

// Define consistent storage keys with version suffix
export const ADMIN_STORAGE_KEY = "ROCKETRY_SHOP_ADMIN_V7"; // Bumped version
export const CATEGORY_IMAGES_KEY = "ROCKETRY_SHOP_CATEGORY_IMAGES_V7"; // Bumped version
export const SUBCATEGORIES_KEY = "ROCKETRY_SHOP_SUBCATEGORIES_V7"; // Bumped version
export const COUPONS_KEY = "ROCKETRY_SHOP_COUPONS_V7"; // Bumped version
export const SYNC_KEY = "ROCKETRY_SHOP_SYNC_TRIGGER_V7"; // New sync key

// Custom event names for real-time sync
export const CATEGORY_IMAGES_EVENT = "rocketry-category-images-update-v7"; // Bumped version
export const SUBCATEGORIES_EVENT = "rocketry-subcategories-update-v7"; // Bumped version
export const COUPONS_EVENT = "rocketry-coupons-update-v7"; // Bumped version
export const SYNC_EVENT = "rocketry-sync-trigger-v7"; // New sync event
