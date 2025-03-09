
import { useState, useCallback, useEffect } from "react";
import { SUBCATEGORIES as initialSubcategories } from "@/constants/categories";
import { CouponCode } from "@/types/shop";
import { v4 as uuidv4 } from "uuid";

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
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (adminLoggedIn === "true") {
      setIsAdmin(true);
    }
    
    // Load saved category images from localStorage if available
    const savedImages = localStorage.getItem("categoryImages");
    if (savedImages) {
      setCategoryImages(JSON.parse(savedImages));
    }
    
    // Load saved subcategories from localStorage if available
    const savedSubcategories = localStorage.getItem("subcategories");
    if (savedSubcategories) {
      setSubcategories(JSON.parse(savedSubcategories));
    }

    // Load saved coupons from localStorage if available
    const savedCoupons = localStorage.getItem("coupons");
    if (savedCoupons) {
      setCoupons(JSON.parse(savedCoupons));
    } else {
      // Initialize with default coupons
      setCoupons(initialCoupons);
      localStorage.setItem("coupons", JSON.stringify(initialCoupons));
    }
  }, []);
  
  // Admin functions
  const tryAdminLogin = useCallback((username: string, password: string) => {
    // Simple mock authentication for demo purposes
    if (username === "admin" && password === "password123") {
      localStorage.setItem("adminLoggedIn", "true");
      setIsAdmin(true);
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
      localStorage.setItem("categoryImages", JSON.stringify(updated));
      return updated;
    });
  }, []);
  
  // Function to update subcategories for a category
  const updateSubcategories = useCallback((category: string, newSubcategories: string[]) => {
    setSubcategories(prev => {
      const updated = { ...prev, [category]: newSubcategories };
      // Save to localStorage for persistence
      localStorage.setItem("subcategories", JSON.stringify(updated));
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
      localStorage.setItem("coupons", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateCoupon = useCallback((coupon: CouponCode) => {
    setCoupons(prev => {
      const updated = prev.map(c => c.id === coupon.id ? coupon : c);
      localStorage.setItem("coupons", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteCoupon = useCallback((couponId: string) => {
    setCoupons(prev => {
      const updated = prev.filter(c => c.id !== couponId);
      localStorage.setItem("coupons", JSON.stringify(updated));
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
