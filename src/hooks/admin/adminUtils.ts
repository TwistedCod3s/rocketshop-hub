
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
      window.dispatchEvent(new StorageEvent('storage', {
        key: key,
        newValue: JSON.stringify(valueCopy),
        storageArea: localStorage
      }));
      console.log(`Manually triggered storage event for ${key}`);
    } catch (e) {
      console.error("Failed to manually trigger storage event:", e);
      
      // Fallback mechanism
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
export const ADMIN_STORAGE_KEY = "ROCKETRY_SHOP_ADMIN_V6"; // Bump version
export const CATEGORY_IMAGES_KEY = "ROCKETRY_SHOP_CATEGORY_IMAGES_V6"; // Bump version
export const SUBCATEGORIES_KEY = "ROCKETRY_SHOP_SUBCATEGORIES_V6"; // Bump version
export const COUPONS_KEY = "ROCKETRY_SHOP_COUPONS_V6"; // Bump version

// Custom event names for real-time sync
export const CATEGORY_IMAGES_EVENT = "rocketry-category-images-update-v6"; // Bump version
export const SUBCATEGORIES_EVENT = "rocketry-subcategories-update-v6"; // Bump version
export const COUPONS_EVENT = "rocketry-coupons-update-v6"; // Bump version
