import { useState, useCallback, useEffect } from "react";
import { SUBCATEGORIES as initialSubcategories } from "@/constants/categories";
import { CouponCode } from "@/types/shop";
import { v4 as uuidv4 } from "uuid";

// Use consistent storage keys that won't change between deployments
const ADMIN_STORAGE_KEY = "rocketry-shop-admin";
const CATEGORY_IMAGES_STORAGE_KEY = "rocketry-shop-category-images";
const SUBCATEGORIES_STORAGE_KEY = "rocketry-shop-subcategories";
const COUPONS_STORAGE_KEY = "rocketry-shop-coupons";

// Initial coupon codes
const initialCoupons: CouponCode[] = [
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

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>({});
  const [subcategories, setSubcategories] = useState<Record<string, string[]>>(initialSubcategories);
  const [coupons, setCoupons] = useState<CouponCode[]>([]);
  
  // Check if admin is logged in and load stored data
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (adminLoggedIn === "true") {
      setIsAdmin(true);
      console.log("Admin logged in from localStorage");
    }
    
    // Load saved category images from localStorage if available
    const savedImages = localStorage.getItem(CATEGORY_IMAGES_STORAGE_KEY);
    if (savedImages) {
      try {
        const parsedImages = JSON.parse(savedImages);
        setCategoryImages(parsedImages);
        console.log("Loaded category images from localStorage");
      } catch (error) {
        console.error("Error parsing saved category images:", error);
        setCategoryImages({});
      }
    }
    
    // Load saved subcategories from localStorage if available
    const savedSubcategories = localStorage.getItem(SUBCATEGORIES_STORAGE_KEY);
    if (savedSubcategories) {
      try {
        const parsedSubcategories = JSON.parse(savedSubcategories);
        setSubcategories(parsedSubcategories);
        console.log("Loaded subcategories from localStorage");
      } catch (error) {
        console.error("Error parsing saved subcategories:", error);
        setSubcategories(initialSubcategories);
      }
    }

    // Load saved coupons from localStorage if available
    const savedCoupons = localStorage.getItem(COUPONS_STORAGE_KEY);
    if (savedCoupons) {
      try {
        const parsedCoupons = JSON.parse(savedCoupons);
        setCoupons(parsedCoupons);
        console.log("Loaded coupons from localStorage:", parsedCoupons.length);
      } catch (error) {
        console.error("Error parsing saved coupons:", error);
        setCoupons(initialCoupons);
        localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(initialCoupons));
      }
    } else {
      // Initialize with default coupons
      setCoupons(initialCoupons);
      localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(initialCoupons));
      console.log("No saved coupons found, using initial data");
    }
  }, []);
  
  // Admin functions
  const tryAdminLogin = useCallback((username: string, password: string) => {
    // Simple mock authentication for demo purposes
    if (username === "admin" && password === "password123") {
      localStorage.setItem(ADMIN_STORAGE_KEY, "true");
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
      // Save to localStorage for persistence
      localStorage.setItem(CATEGORY_IMAGES_STORAGE_KEY, JSON.stringify(updated));
      console.log("Saved category image for:", categorySlug);
      return updated;
    });
  }, []);
  
  // Function to update subcategories for a category
  const updateSubcategories = useCallback((category: string, newSubcategories: string[]) => {
    setSubcategories(prev => {
      const updated = { ...prev, [category]: newSubcategories };
      // Save to localStorage for persistence
      localStorage.setItem(SUBCATEGORIES_STORAGE_KEY, JSON.stringify(updated));
      console.log("Saved subcategories for:", category);
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
      localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(updated));
      console.log("Added new coupon:", newCoupon.code);
      return updated;
    });
  }, []);

  const updateCoupon = useCallback((coupon: CouponCode) => {
    setCoupons(prev => {
      const updated = prev.map(c => c.id === coupon.id ? coupon : c);
      localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(updated));
      console.log("Updated coupon:", coupon.code);
      return updated;
    });
  }, []);

  const deleteCoupon = useCallback((couponId: string) => {
    setCoupons(prev => {
      const updated = prev.filter(c => c.id !== couponId);
      localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(updated));
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
