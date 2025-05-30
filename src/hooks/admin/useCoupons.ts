import { useState, useCallback, useEffect } from "react";
import { 
  loadFromStorage, 
  saveAndBroadcast, 
  COUPONS_KEY, 
  COUPONS_EVENT 
} from "./adminUtils";
import { Coupon } from "@/types/shop";
import { v4 as uuidv4 } from "uuid";

// Initialize default coupons with correct field names
const defaultCoupons: Coupon[] = [
  {
    id: uuidv4(), // Use UUID instead of "coupon-1"
    code: "SCHOOL10",
    discount: 0.1, // 10% as a decimal
    discountPercentage: 10,
    expiryDate: "2025-12-31", // Add expiry date in ISO format
    active: true,
    description: "10% discount for schools"
  },
  {
    id: uuidv4(), // Use UUID instead of "coupon-2"
    code: "EDUCATION20",
    discount: 0.2, // 20% as a decimal
    discountPercentage: 20,
    expiryDate: "2025-12-31", // Add expiry date in ISO format
    active: true,
    description: "20% discount for educational institutions"
  }
];

// Initialize global coupons state from localStorage or default values
const initialGlobalCoupons = loadFromStorage<Coupon[]>(COUPONS_KEY, defaultCoupons);

export function useCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>(initialGlobalCoupons);
  
  // Function to forcibly reload from localStorage
  const reloadFromStorage = useCallback(() => {
    try {
      const storedData = localStorage.getItem(COUPONS_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setCoupons(parsedData);
        console.log("Manually reloaded coupons from localStorage:", parsedData);
      }
    } catch (e) {
      console.error("Error during manual reload of coupons:", e);
    }
  }, []);
  
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
          // Attempt recovery
          reloadFromStorage();
        }
      }
    };
    
    // Custom event handlers
    const handleCouponsEvent = (e: CustomEvent<Coupon[]>) => {
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
    reloadFromStorage();
    
    return () => {
      console.log("Removing coupons event listeners");
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(COUPONS_EVENT, handleCouponsEvent as EventListener);
    };
  }, [reloadFromStorage]);

  // Coupon management functions with improved UUID generation
  const addCoupon = useCallback((coupon: Omit<Coupon, 'id'>) => {
    try {
      const newCoupon = {
        ...coupon,
        id: uuidv4() // Always use UUID for new coupons
      };
      
      // Update local state using functional form to ensure we're working with the latest state
      setCoupons(prevCoupons => {
        const updatedCoupons = [...prevCoupons, newCoupon];
        
        // Save to localStorage and broadcast
        saveAndBroadcast(COUPONS_KEY, COUPONS_EVENT, updatedCoupons);
        console.log("Added new coupon:", newCoupon.code, newCoupon);
        
        return updatedCoupons;
      });
    } catch (error) {
      console.error("Error adding coupon:", error);
    }
  }, []);

  const updateCoupon = useCallback((coupon: Coupon) => {
    try {
      // Update local state using functional form to ensure we're working with the latest state
      setCoupons(prevCoupons => {
        const updatedCoupons = prevCoupons.map(c => c.id === coupon.id ? coupon : c);
        
        // Save to localStorage and broadcast
        saveAndBroadcast(COUPONS_KEY, COUPONS_EVENT, updatedCoupons);
        console.log("Updated coupon:", coupon.code, coupon);
        
        return updatedCoupons;
      });
    } catch (error) {
      console.error("Error updating coupon:", error);
    }
  }, []);

  const deleteCoupon = useCallback((couponId: string) => {
    try {
      // Update local state using functional form to ensure we're working with the latest state
      setCoupons(prevCoupons => {
        const updatedCoupons = prevCoupons.filter(c => c.id !== couponId);
        
        // Save to localStorage and broadcast
        saveAndBroadcast(COUPONS_KEY, COUPONS_EVENT, updatedCoupons);
        console.log("Deleted coupon with ID:", couponId);
        
        return updatedCoupons;
      });
    } catch (error) {
      console.error("Error deleting coupon:", error);
    }
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
    validateCoupon,
    reloadFromStorage
  };
}
