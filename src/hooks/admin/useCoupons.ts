import { useState, useCallback, useEffect } from "react";
import { 
  loadFromStorage, 
  saveAndBroadcast, 
  COUPONS_KEY, 
  COUPONS_EVENT 
} from "./adminUtils";
import { CouponCode } from "@/types/shop";
import { v4 as uuidv4 } from "uuid";

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

// Initialize global coupons state from localStorage or default values
let globalCoupons = loadFromStorage<CouponCode[]>(COUPONS_KEY, defaultCoupons);

export function useCoupons() {
  const [coupons, setCoupons] = useState<CouponCode[]>(globalCoupons);
  
  // Listen for storage and custom events to keep state in sync
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === COUPONS_KEY) {
        try {
          const updatedCoupons = JSON.parse(e.newValue || '[]');
          globalCoupons = updatedCoupons;
          setCoupons(updatedCoupons);
          console.log("Coupons updated from another tab/window");
        } catch (error) {
          console.error("Error parsing coupons from storage event:", error);
        }
      }
    };
    
    // Custom event handlers
    const handleCouponsEvent = (e: CustomEvent) => {
      globalCoupons = e.detail;
      setCoupons(e.detail);
    };
    
    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(COUPONS_EVENT, handleCouponsEvent as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(COUPONS_EVENT, handleCouponsEvent as EventListener);
    };
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
    coupons,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    validateCoupon
  };
}
