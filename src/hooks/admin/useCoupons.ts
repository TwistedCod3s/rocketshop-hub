
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
const defaultCoupons: CouponCode[] = [
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
const initialGlobalCoupons = loadFromStorage<CouponCode[]>(COUPONS_KEY, defaultCoupons);

export function useCoupons() {
  const [coupons, setCoupons] = useState<CouponCode[]>(initialGlobalCoupons);
  
  // Listen for storage and custom events to keep state in sync
  useEffect(() => {
    console.log("Setting up coupons event listeners");
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === COUPONS_KEY) {
        try {
          console.log("Storage event detected for coupons", e);
          if (e.newValue) {
            const updatedCoupons = JSON.parse(e.newValue);
            setCoupons(updatedCoupons);
            console.log("Coupons updated from storage event:", updatedCoupons);
          }
        } catch (error) {
          console.error("Error parsing coupons from storage event:", error);
        }
      }
    };
    
    // Custom event handlers
    const handleCouponsEvent = (e: CustomEvent<CouponCode[]>) => {
      console.log("Custom event detected for coupons", e);
      if (e.detail) {
        setCoupons(e.detail);
        console.log("Coupons updated from custom event:", e.detail);
      }
    };
    
    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(COUPONS_EVENT, handleCouponsEvent as EventListener);
    
    // Force initial sync
    const storedData = localStorage.getItem(COUPONS_KEY);
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setCoupons(parsedData);
        console.log("Initial sync of coupons from localStorage:", parsedData);
      } catch (e) {
        console.error("Error during initial sync of coupons:", e);
      }
    }
    
    return () => {
      console.log("Removing coupons event listeners");
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
    
    // Update local state using functional form to ensure we're working with the latest state
    setCoupons(prevCoupons => {
      const updatedCoupons = [...prevCoupons, newCoupon];
      
      // Save to localStorage and broadcast
      saveAndBroadcast(COUPONS_KEY, COUPONS_EVENT, updatedCoupons);
      console.log("Added new coupon:", newCoupon.code, newCoupon);
      
      return updatedCoupons;
    });
  }, []);

  const updateCoupon = useCallback((coupon: CouponCode) => {
    // Update local state using functional form to ensure we're working with the latest state
    setCoupons(prevCoupons => {
      const updatedCoupons = prevCoupons.map(c => c.id === coupon.id ? coupon : c);
      
      // Save to localStorage and broadcast
      saveAndBroadcast(COUPONS_KEY, COUPONS_EVENT, updatedCoupons);
      console.log("Updated coupon:", coupon.code, coupon);
      
      return updatedCoupons;
    });
  }, []);

  const deleteCoupon = useCallback((couponId: string) => {
    // Update local state using functional form to ensure we're working with the latest state
    setCoupons(prevCoupons => {
      const updatedCoupons = prevCoupons.filter(c => c.id !== couponId);
      
      // Save to localStorage and broadcast
      saveAndBroadcast(COUPONS_KEY, COUPONS_EVENT, updatedCoupons);
      console.log("Deleted coupon with ID:", couponId);
      
      return updatedCoupons;
    });
  }, []);

  const validateCoupon = useCallback((code: string) => {
    console.log("Validating coupon:", code, "against", coupons);
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
