
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
    // First save to localStorage
    localStorage.setItem(key, JSON.stringify(value));
    console.log(`Saved ${key} to localStorage`);
    
    // Then dispatch custom event for same-window communication
    window.dispatchEvent(new CustomEvent(eventName, { detail: value }));
    console.log(`Broadcast ${eventName} custom event`);
    
    // Then dispatch storage event manually for cross-window communication
    // We have to manually trigger this because changes in the same window don't trigger storage events
    try {
      const storageEvent = new StorageEvent('storage', {
        key: key,
        newValue: JSON.stringify(value),
        storageArea: localStorage
      });
      window.dispatchEvent(storageEvent);
      console.log(`Manually triggered storage event for ${key}`);
    } catch (e) {
      console.error("Failed to manually trigger storage event:", e);
    }
  } catch (error) {
    console.error(`Error in saveAndBroadcast for ${key}:`, error);
  }
};

// Define consistent storage keys with version suffix
export const ADMIN_STORAGE_KEY = "ROCKETRY_SHOP_ADMIN_V4"; // Bump version
export const CATEGORY_IMAGES_KEY = "ROCKETRY_SHOP_CATEGORY_IMAGES_V4"; // Bump version
export const SUBCATEGORIES_KEY = "ROCKETRY_SHOP_SUBCATEGORIES_V4"; // Bump version
export const COUPONS_KEY = "ROCKETRY_SHOP_COUPONS_V4"; // Bump version

// Custom event names for real-time sync
export const CATEGORY_IMAGES_EVENT = "rocketry-category-images-update-v4"; // Bump version
export const SUBCATEGORIES_EVENT = "rocketry-subcategories-update-v4"; // Bump version
export const COUPONS_EVENT = "rocketry-coupons-update-v4"; // Bump version
