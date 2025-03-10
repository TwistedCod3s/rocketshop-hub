// Helper function to load from storage with defaults
export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    if (typeof window !== 'undefined') {
      // Try to load from localStorage
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          console.log(`Loaded ${key} from localStorage`);
          return JSON.parse(stored);
        } catch (parseError) {
          console.error(`Error parsing ${key} from localStorage:`, parseError);
          // Try to recover from backup
          for (let i = 0; i < localStorage.length; i++) {
            const storageKey = localStorage.key(i);
            if (storageKey && storageKey.startsWith(`${key}_BACKUP_`)) {
              try {
                const backupValue = localStorage.getItem(storageKey);
                if (backupValue) {
                  const parsedBackup = JSON.parse(backupValue);
                  console.log(`Recovered ${key} from backup:`, storageKey);
                  // Restore the main value from backup
                  localStorage.setItem(key, backupValue);
                  return parsedBackup;
                }
              } catch (backupError) {
                console.error(`Failed to recover from backup ${storageKey}:`, backupError);
              }
            }
          }
        }
      }
      
      // Initialize storage if not found or recovery failed
      localStorage.setItem(key, JSON.stringify(defaultValue));
      console.log(`Initialized ${key} in localStorage with defaults`);
      
      // Also store to session storage for better durability
      sessionStorage.setItem(`${key}_SESSION_BACKUP`, JSON.stringify(defaultValue));
    }
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    // Try to recover from session storage
    try {
      const sessionBackup = sessionStorage.getItem(`${key}_SESSION_BACKUP`);
      if (sessionBackup) {
        console.log(`Recovered ${key} from session storage backup`);
        return JSON.parse(sessionBackup);
      }
    } catch (sessionError) {
      console.error(`Failed to recover ${key} from session storage:`, sessionError);
    }
  }
  return defaultValue;
};

// Helper function to save state to localStorage and broadcast change
export const saveAndBroadcast = <T>(key: string, eventName: string, value: T): void => {
  try {
    // Make a deep copy to avoid reference issues
    const valueCopy = JSON.parse(JSON.stringify(value));
    const valueString = JSON.stringify(valueCopy);
    
    // First save to localStorage
    localStorage.setItem(key, valueString);
    console.log(`Saved ${key} to localStorage`, valueCopy);
    
    // Also save to sessionStorage as a backup
    sessionStorage.setItem(`${key}_SESSION_BACKUP`, valueString);
    
    // Create additional timestamped backups to ensure data persistence
    const backupKey = `${key}_BACKUP_${Date.now()}`;
    localStorage.setItem(backupKey, valueString);
    console.log(`Created backup for ${key} at ${backupKey}`);
    
    // Cleanup old backups to avoid localStorage filling up (keep last 2)
    const backupKeys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const storageKey = localStorage.key(i);
      if (storageKey && storageKey.startsWith(`${key}_BACKUP_`)) {
        backupKeys.push(storageKey);
      }
    }
    backupKeys.sort().reverse(); // newest first
    for (let i = 2; i < backupKeys.length; i++) {
      localStorage.removeItem(backupKeys[i]);
    }
    
    // Then dispatch custom event for same-window communication
    const customEvent = new CustomEvent(eventName, { detail: valueCopy });
    window.dispatchEvent(customEvent);
    console.log(`Broadcast ${eventName} custom event`, valueCopy);
    
    // Set "dirty" flag to indicate pending changes
    localStorage.setItem('ROCKETRY_SHOP_CHANGES_PENDING', 'true');
    
    // Then dispatch storage event manually for cross-window communication
    try {
      // Use a special sync key to force all clients to reload
      const syncKey = "ROCKETRY_SHOP_SYNC_TRIGGER_V7";
      const timestamp = new Date().toISOString();
      localStorage.setItem(syncKey, timestamp);
      
      // Create and dispatch a storage event
      const storageEvent = new StorageEvent('storage', {
        key: key,
        newValue: valueString,
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
    } catch (e) {
      console.error("Failed to manually trigger storage event:", e);
      
      // Real fallback - remove and re-add the item
      localStorage.removeItem(key);
      setTimeout(() => {
        localStorage.setItem(key, valueString);
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
