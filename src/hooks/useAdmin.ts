import { useState, useCallback, useEffect } from "react";
import { SUBCATEGORIES as initialSubcategories } from "@/constants/categories";
import { CouponCode } from "@/types/shop";
import { v4 as uuidv4 } from "uuid";

// Define consistent storage keys with version suffix to ensure fresh start
const ADMIN_STORAGE_KEY = "ROCKETRY_SHOP_ADMIN_V3";
const CATEGORY_IMAGES_KEY = "ROCKETRY_SHOP_CATEGORY_IMAGES_V3";
const SUBCATEGORIES_KEY = "ROCKETRY_SHOP_SUBCATEGORIES_V3";
const COUPONS_KEY = "ROCKETRY_SHOP_COUPONS_V3";

// Custom event names for real-time sync
const CATEGORY_IMAGES_EVENT = "rocketry-category-images-update";
const SUBCATEGORIES_EVENT = "rocketry-subcategories-update";
const COUPONS_EVENT = "rocketry-coupons-update";

// Initialize default coupons
const defaultCoupons = [
  {
    id: "coupon-1",
    code: "SCHOOL10",
    discountPercentage: 10,
    active: true,
    description: "10% discount for schools"
  },
  {
    id: "coupon-2",
    code: "EDUCATION20",
    discountPercentage: 20,
    active: true,
    description: "20% discount for educational institutions"
  }
];

// Helper function to load from storage with defaults
const loadFromStorage = <T>(key: string, defaultValue: T): T => {
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

// Initialize global admin state from localStorage or default values
let globalCategoryImages = loadFromStorage<Record<string, string>>(CATEGORY_IMAGES_KEY, {});
let globalSubcategories = loadFromStorage<Record<string, string[]>>(SUBCATEGORIES_KEY, initialSubcategories);
let globalCoupons = loadFromStorage<CouponCode[]>(COUPONS_KEY, defaultCoupons);

// Helper function to save state to localStorage and broadcast change
const saveAndBroadcast = <T>(key: string, eventName: string, value: T): void => {
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

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>(globalCategoryImages);
  const [subcategories, setSubcategories] = useState<Record<string, string[]>>(globalSubcategories);
  const [coupons, setCoupons] = useState<CouponCode[]>(globalCoupons);
  
  // Listen for storage and custom events to keep state in sync
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === CATEGORY_IMAGES_KEY) {
        try {
          const updatedImages = JSON.parse(e.newValue);
          globalCategoryImages = updatedImages;
          setCategoryImages(updatedImages);
          console.log("Category images updated from another tab/window");
        } catch (error) {
          console.error("Error parsing category images from storage event:", error);
        }
      } else if (e.key === SUBCATEGORIES_KEY) {
        try {
          const updatedSubcategories = JSON.parse(e.newValue);
          globalSubcategories = updatedSubcategories;
          setSubcategories(updatedSubcategories);
          console.log("Subcategories updated from another tab/window");
        } catch (error) {
          console.error("Error parsing subcategories from storage event:", error);
        }
      } else if (e.key === COUPONS_KEY) {
        try {
          const updatedCoupons = JSON.parse(e.newValue);
          globalCoupons = updatedCoupons;
          setCoupons(updatedCoupons);
          console.log("Coupons updated from another tab/window");
        } catch (error) {
          console.error("Error parsing coupons from storage event:", error);
        }
      }
    };

    // Custom event handlers
    const handleCategoryImagesEvent = (e: CustomEvent) => {
      globalCategoryImages = e.detail;
      setCategoryImages(e.detail);
    };
    
    const handleSubcategoriesEvent = (e: CustomEvent) => {
      globalSubcategories = e.detail;
      setSubcategories(e.detail);
    };
    
    const handleCouponsEvent = (e: CustomEvent) => {
      globalCoupons = e.detail;
      setCoupons(e.detail);
    };

    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(CATEGORY_IMAGES_EVENT, handleCategoryImagesEvent as EventListener);
    window.addEventListener(SUBCATEGORIES_EVENT, handleSubcategoriesEvent as EventListener);
    window.addEventListener(COUPONS_EVENT, handleCouponsEvent as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(CATEGORY_IMAGES_EVENT, handleCategoryImagesEvent as EventListener);
      window.removeEventListener(SUBCATEGORIES_EVENT, handleSubcategoriesEvent as EventListener);
      window.removeEventListener(COUPONS_EVENT, handleCouponsEvent as EventListener);
    };
  }, []);
  
  // Check if admin is logged in from session storage (per user)
  useEffect(() => {
    const adminLoggedIn = sessionStorage.getItem(ADMIN_STORAGE_KEY);
    if (adminLoggedIn === "true") {
      setIsAdmin(true);
      console.log("Admin logged in from sessionStorage");
    }
  }, []);
  
  // Admin login function
  const tryAdminLogin = useCallback((username: string, password: string) => {
    // Simple mock authentication for demo purposes
    if (username === "admin" && password === "password123") {
      sessionStorage.setItem(ADMIN_STORAGE_KEY, "true");
      setIsAdmin(true);
      console.log("Admin login successful");
      return true;
    }
    return false;
  }, []);

  // Function to handle file uploads and convert to base64
  const handleFileUpload = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      reader.readAsDataURL(file);
    });
  }, []);
  
  // Function to update category image
  const updateCategoryImage = useCallback((categorySlug: string, imageUrl: string) => {
    // Update global state
    const updatedImages = { ...globalCategoryImages, [categorySlug]: imageUrl };
    globalCategoryImages = updatedImages;
    setCategoryImages(updatedImages);
    
    // Save to localStorage and broadcast
    saveAndBroadcast(CATEGORY_IMAGES_KEY, CATEGORY_IMAGES_EVENT, updatedImages);
    console.log("Updated category image for:", categorySlug);
  }, []);
  
  // Function to update subcategories for a category
  const updateSubcategories = useCallback((category: string, newSubcategories: string[]) => {
    // Update global state
    const updatedSubcategories = { ...globalSubcategories, [category]: newSubcategories };
    globalSubcategories = updatedSubcategories;
    setSubcategories(updatedSubcategories);
    
    // Save to localStorage and broadcast
    saveAndBroadcast(SUBCATEGORIES_KEY, SUBCATEGORIES_EVENT, updatedSubcategories);
    console.log("Updated subcategories for:", category);
  }, []);

  // Coupon management functions
  const addCoupon = useCallback((coupon: Omit<CouponCode, 'id'>) => {
    const newCoupon = {
      ...coupon,
      id: uuidv4()
    };
    
    // Update global state
    const updatedCoupons = [...globalCoupons, newCoupon];
    globalCoupons = updatedCoupons;
    setCoupons(updatedCoupons);
    
    // Save to localStorage and broadcast
    saveAndBroadcast(COUPONS_KEY, COUPONS_EVENT, updatedCoupons);
    console.log("Added new coupon:", newCoupon.code);
  }, []);

  const updateCoupon = useCallback((coupon: CouponCode) => {
    // Update global state
    const updatedCoupons = globalCoupons.map(c => c.id === coupon.id ? coupon : c);
    globalCoupons = updatedCoupons;
    setCoupons(updatedCoupons);
    
    // Save to localStorage and broadcast
    saveAndBroadcast(COUPONS_KEY, COUPONS_EVENT, updatedCoupons);
    console.log("Updated coupon:", coupon.code);
  }, []);

  const deleteCoupon = useCallback((couponId: string) => {
    // Update global state
    const updatedCoupons = globalCoupons.filter(c => c.id !== couponId);
    globalCoupons = updatedCoupons;
    setCoupons(updatedCoupons);
    
    // Save to localStorage and broadcast
    saveAndBroadcast(COUPONS_KEY, COUPONS_EVENT, updatedCoupons);
    console.log("Deleted coupon with ID:", couponId);
  }, []);

  const validateCoupon = useCallback((code: string) => {
    return coupons.find(
      c => c.code.toLowerCase() === code.toLowerCase() && c.active
    );
  }, [coupons]);

  return {
    isAdmin,
    categoryImages,
    subcategories,
    coupons,
    tryAdminLogin,
    handleFileUpload,
    updateCategoryImage,
    updateSubcategories,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    validateCoupon
  };
}
