
import { useState, useCallback, useEffect } from "react";
import { SUBCATEGORIES as initialSubcategories } from "@/constants/categories";
import { CouponCode } from "@/types/shop";
import { v4 as uuidv4 } from "uuid";

// Define consistent storage keys with version suffix to ensure fresh start
const ADMIN_STORAGE_KEY = "ROCKETRY_SHOP_ADMIN_V2";
const CATEGORY_IMAGES_KEY = "ROCKETRY_SHOP_CATEGORY_IMAGES_V2";
const SUBCATEGORIES_KEY = "ROCKETRY_SHOP_SUBCATEGORIES_V2";
const COUPONS_KEY = "ROCKETRY_SHOP_COUPONS_V2";

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
let globalAdminState = {
  categoryImages: loadFromStorage<Record<string, string>>(CATEGORY_IMAGES_KEY, {}),
  subcategories: loadFromStorage<Record<string, string[]>>(SUBCATEGORIES_KEY, initialSubcategories),
  coupons: loadFromStorage<CouponCode[]>(COUPONS_KEY, defaultCoupons)
};

// Helper function to save state to localStorage and update global state
const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    console.log(`Saved ${key} to localStorage`);
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>(globalAdminState.categoryImages);
  const [subcategories, setSubcategories] = useState<Record<string, string[]>>(globalAdminState.subcategories);
  const [coupons, setCoupons] = useState<CouponCode[]>(globalAdminState.coupons);
  
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
    globalAdminState.categoryImages = { ...globalAdminState.categoryImages, [categorySlug]: imageUrl };
    setCategoryImages({ ...globalAdminState.categoryImages });
    
    // Save to localStorage
    saveToStorage(CATEGORY_IMAGES_KEY, globalAdminState.categoryImages);
    console.log("Updated category image for:", categorySlug);
  }, []);
  
  // Function to update subcategories for a category
  const updateSubcategories = useCallback((category: string, newSubcategories: string[]) => {
    // Update global state
    globalAdminState.subcategories = { ...globalAdminState.subcategories, [category]: newSubcategories };
    setSubcategories({ ...globalAdminState.subcategories });
    
    // Save to localStorage
    saveToStorage(SUBCATEGORIES_KEY, globalAdminState.subcategories);
    console.log("Updated subcategories for:", category);
  }, []);

  // Coupon management functions
  const addCoupon = useCallback((coupon: Omit<CouponCode, 'id'>) => {
    const newCoupon = {
      ...coupon,
      id: uuidv4()
    };
    
    // Update global state
    globalAdminState.coupons = [...globalAdminState.coupons, newCoupon];
    setCoupons([...globalAdminState.coupons]);
    
    // Save to localStorage
    saveToStorage(COUPONS_KEY, globalAdminState.coupons);
    console.log("Added new coupon:", newCoupon.code);
  }, []);

  const updateCoupon = useCallback((coupon: CouponCode) => {
    // Update global state
    globalAdminState.coupons = globalAdminState.coupons.map(c => c.id === coupon.id ? coupon : c);
    setCoupons([...globalAdminState.coupons]);
    
    // Save to localStorage
    saveToStorage(COUPONS_KEY, globalAdminState.coupons);
    console.log("Updated coupon:", coupon.code);
  }, []);

  const deleteCoupon = useCallback((couponId: string) => {
    // Update global state
    globalAdminState.coupons = globalAdminState.coupons.filter(c => c.id !== couponId);
    setCoupons([...globalAdminState.coupons]);
    
    // Save to localStorage
    saveToStorage(COUPONS_KEY, globalAdminState.coupons);
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
