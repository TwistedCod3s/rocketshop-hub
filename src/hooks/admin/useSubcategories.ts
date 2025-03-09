import { useState, useCallback, useEffect } from "react";
import { 
  loadFromStorage, 
  saveAndBroadcast, 
  SUBCATEGORIES_KEY, 
  SUBCATEGORIES_EVENT 
} from "./adminUtils";
import { SUBCATEGORIES as initialSubcategories } from "@/constants/categories";

// Initialize global subcategories state from localStorage or default values
let globalSubcategories = loadFromStorage<Record<string, string[]>>(SUBCATEGORIES_KEY, initialSubcategories);

export function useSubcategories() {
  const [subcategories, setSubcategories] = useState<Record<string, string[]>>(globalSubcategories);
  
  // Listen for storage and custom events to keep state in sync
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === SUBCATEGORIES_KEY) {
        try {
          const updatedSubcategories = JSON.parse(e.newValue || '{}');
          globalSubcategories = updatedSubcategories;
          setSubcategories(updatedSubcategories);
          console.log("Subcategories updated from another tab/window");
        } catch (error) {
          console.error("Error parsing subcategories from storage event:", error);
        }
      }
    };
    
    // Custom event handlers
    const handleSubcategoriesEvent = (e: CustomEvent) => {
      globalSubcategories = e.detail;
      setSubcategories(e.detail);
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
    // Update global state
    const updatedSubcategories = { ...globalSubcategories, [category]: newSubcategories };
    globalSubcategories = updatedSubcategories;
    setSubcategories(updatedSubcategories);
    
    // Save to localStorage and broadcast
    saveAndBroadcast(SUBCATEGORIES_KEY, SUBCATEGORIES_EVENT, updatedSubcategories);
    console.log("Updated subcategories for:", category);
  }, []);

  return {
    subcategories,
    updateSubcategories
  };
}
