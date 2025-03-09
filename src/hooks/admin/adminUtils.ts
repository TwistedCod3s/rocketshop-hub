
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
    localStorage.setItem(key, JSON.stringify(value));
    
    // Dispatch custom event for same-window communication
    const event = new CustomEvent(eventName, { detail: value });
    window.dispatchEvent(event);
    
    console.log(`Saved and broadcast ${key} to localStorage`);
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// Define consistent storage keys with version suffix
export const ADMIN_STORAGE_KEY = "ROCKETRY_SHOP_ADMIN_V3";
export const CATEGORY_IMAGES_KEY = "ROCKETRY_SHOP_CATEGORY_IMAGES_V3";
export const SUBCATEGORIES_KEY = "ROCKETRY_SHOP_SUBCATEGORIES_V3";
export const COUPONS_KEY = "ROCKETRY_SHOP_COUPONS_V3";

// Custom event names for real-time sync
export const CATEGORY_IMAGES_EVENT = "rocketry-category-images-update";
export const SUBCATEGORIES_EVENT = "rocketry-subcategories-update";
export const COUPONS_EVENT = "rocketry-coupons-update";
