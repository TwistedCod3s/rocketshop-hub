
import { useState, useCallback, useEffect } from "react";
import { SUBCATEGORIES as initialSubcategories } from "@/constants/categories";
import { CouponCode } from "@/types/shop";
import { v4 as uuidv4 } from "uuid";

// Define consistent storage keys
const ADMIN_STORAGE_KEY = "ROCKETRY_SHOP_ADMIN";
const CATEGORY_IMAGES_KEY = "ROCKETRY_SHOP_CATEGORY_IMAGES";
const SUBCATEGORIES_KEY = "ROCKETRY_SHOP_SUBCATEGORIES";
const COUPONS_KEY = "ROCKETRY_SHOP_COUPONS";

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

// Initialize global state from localStorage
const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(key);
      if (stored) {
        console.log(`Loaded ${key} from localStorage`);
        return JSON.parse(stored);
      }
    }
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
  }
  return defaultValue;
};

// Initialize global admin state from localStorage or default values
let globalAdminState = {
  categoryImages: loadFromStorage<Record<string, string>>(CATEGORY_IMAGES_KEY, {}),
  subcategories: loadFromStorage<Record<string, string[]>>(SUBCATEGORIES_KEY, initialSubcategories),
  coupons: loadFromStorage<CouponCode[]>(COUPONS_KEY, defaultCoupons)
};

// Helper function to save state to localStorage
const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    console.log(`Saved ${key} to localStorage`);
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// Save initial state to localStorage if not already there
saveToStorage(CATEGORY_IMAGES_KEY, globalAdminState.categoryImages);
saveToStorage(SUBCATEGORIES_KEY, globalAdminState.subcategories);
saveToStorage(COUPONS_KEY, globalAdminState.coupons);

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>(globalAdminState.categoryImages);
  const [subcategories, setSubcategories] = useState<Record<string, string[]>>(globalAdminState.subcategories);
  const [coupons, setCoupons] = useState<CouponCode[]>(globalAdminState.coupons);
  
  // Check if admin is logged in and load data from global state
  useEffect(() => {
    const adminLoggedIn = sessionStorage.getItem(ADMIN_STORAGE_KEY);
    if (adminLoggedIn === "true") {
      setIsAdmin(true);
      console.log("Admin logged in from sessionStorage");
    }
    
    // Always use the global state as the source of truth
    setCategoryImages(globalAdminState.categoryImages);
    setSubcategories(globalAdminState.subcategories);
    setCoupons(globalAdminState.coupons);
    console.log("Loaded admin data from global state");
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
    setCategoryImages(prev => {
      const updated = { ...prev, [categorySlug]: imageUrl };
      // Update the global state
      globalAdminState.categoryImages = updated;
      // Save to localStorage
      saveToStorage(CATEGORY_IMAGES_KEY, updated);
      console.log("Updated category image for:", categorySlug);
      return updated;
    });
  }, []);
  
  // Function to update subcategories for a category
  const updateSubcategories = useCallback((category: string, newSubcategories: string[]) => {
    setSubcategories(prev => {
      const updated = { ...prev, [category]: newSubcategories };
      // Update the global state
      globalAdminState.subcategories = updated;
      // Save to localStorage
      saveToStorage(SUBCATEGORIES_KEY, updated);
      console.log("Updated subcategories for:", category);
      return updated;
    });
  }, []);

  // Coupon management functions
  const addCoupon = useCallback((coupon: Omit<CouponCode, 'id'>) => {
    const newCoupon = {
      ...coupon,
      id: uuidv4()
    };
    
    setCoupons(prev => {
      const updated = [...prev, newCoupon];
      // Update the global state
      globalAdminState.coupons = updated;
      // Save to localStorage
      saveToStorage(COUPONS_KEY, updated);
      console.log("Added new coupon:", newCoupon.code);
      return updated;
    });
  }, []);

  const updateCoupon = useCallback((coupon: CouponCode) => {
    setCoupons(prev => {
      const updated = prev.map(c => c.id === coupon.id ? coupon : c);
      // Update the global state
      globalAdminState.coupons = updated;
      // Save to localStorage
      saveToStorage(COUPONS_KEY, updated);
      console.log("Updated coupon:", coupon.code);
      return updated;
    });
  }, []);

  const deleteCoupon = useCallback((couponId: string) => {
    setCoupons(prev => {
      const updated = prev.filter(c => c.id !== couponId);
      // Update the global state
      globalAdminState.coupons = updated;
      // Save to localStorage
      saveToStorage(COUPONS_KEY, updated);
      console.log("Deleted coupon with ID:", couponId);
      return updated;
    });
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
