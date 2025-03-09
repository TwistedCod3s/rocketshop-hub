
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
    console.log(`Saved ${key} to localStorage`, value);
    
    // Then dispatch custom event for same-window communication
    const customEvent = new CustomEvent(eventName, { detail: value });
    window.dispatchEvent(customEvent);
    console.log(`Broadcast ${eventName} custom event`, value);
    
    // Then dispatch storage event manually for cross-window communication
    // We have to manually trigger this because changes in the same window don't trigger storage events
    try {
      // Create event with correct properties
      const storageEvent = new StorageEvent('storage', {
        key: key,
        newValue: JSON.stringify(value),
        oldValue: null,
        storageArea: localStorage
      });
      
      // Dispatch it
      window.dispatchEvent(storageEvent);
      console.log(`Manually triggered storage event for ${key}`, {
        key,
        newValue: JSON.stringify(value)
      });
    } catch (e) {
      console.error("Failed to manually trigger storage event:", e);
      
      // Fallback mechanism - less reliable but might help in some browsers
      setTimeout(() => {
        console.log("Using fallback window.dispatchEvent for 'storage'");
        window.dispatchEvent(new Event('storage'));
      }, 0);
    }
  } catch (error) {
    console.error(`Error in saveAndBroadcast for ${key}:`, error);
  }
};

// Define consistent storage keys with version suffix
export const ADMIN_STORAGE_KEY = "ROCKETRY_SHOP_ADMIN_V5"; // Bump version
export const CATEGORY_IMAGES_KEY = "ROCKETRY_SHOP_CATEGORY_IMAGES_V5"; // Bump version
export const SUBCATEGORIES_KEY = "ROCKETRY_SHOP_SUBCATEGORIES_V5"; // Bump version
export const COUPONS_KEY = "ROCKETRY_SHOP_COUPONS_V5"; // Bump version

// Custom event names for real-time sync
export const CATEGORY_IMAGES_EVENT = "rocketry-category-images-update-v5"; // Bump version
export const SUBCATEGORIES_EVENT = "rocketry-subcategories-update-v5"; // Bump version
export const COUPONS_EVENT = "rocketry-coupons-update-v5"; // Bump version
