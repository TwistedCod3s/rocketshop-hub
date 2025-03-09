
import { useState, useCallback, useEffect } from "react";
import { 
  loadFromStorage, 
  saveAndBroadcast, 
  SUBCATEGORIES_KEY, 
  SUBCATEGORIES_EVENT 
} from "./adminUtils";
import { SUBCATEGORIES as initialSubcategories } from "@/constants/categories";

// Initialize global subcategories state from localStorage or default values
const initialGlobalSubcategories = loadFromStorage<Record<string, string[]>>(SUBCATEGORIES_KEY, initialSubcategories);

export function useSubcategories() {
  const [subcategories, setSubcategories] = useState<Record<string, string[]>>(initialGlobalSubcategories);
  
  // Listen for storage and custom events to keep state in sync
  useEffect(() => {
    console.log("Setting up subcategories event listeners");
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === SUBCATEGORIES_KEY && e.newValue) {
        try {
          console.log("Storage event detected for subcategories");
          const updatedSubcategories = JSON.parse(e.newValue);
          setSubcategories(updatedSubcategories);
          console.log("Subcategories updated from storage event:", updatedSubcategories);
        } catch (error) {
          console.error("Error parsing subcategories from storage event:", error);
        }
      }
    };
    
    // Custom event handlers
    const handleSubcategoriesEvent = (e: CustomEvent<Record<string, string[]>>) => {
      console.log("Custom event detected for subcategories");
      setSubcategories(e.detail);
      console.log("Subcategories updated from custom event:", e.detail);
    };
    
    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(SUBCATEGORIES_EVENT, handleSubcategoriesEvent as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(SUBCATEGORIES_EVENT, handleSubcategoriesEvent as EventListener);
    };
  }, []);
  
  // Function to update subcategories for a category
  const updateSubcategories = useCallback((category: string, newSubcategories: string[]) => {
    // Update local state using functional form to ensure we're working with the latest state
    setSubcategories(prevSubcategories => {
      const updatedSubcategories = { ...prevSubcategories, [category]: newSubcategories };
      
      // Save to localStorage and broadcast
      saveAndBroadcast(SUBCATEGORIES_KEY, SUBCATEGORIES_EVENT, updatedSubcategories);
      console.log("Updated subcategories for:", category);
      
      return updatedSubcategories;
    });
  }, []);

  return {
    subcategories,
    updateSubcategories
  };
}
