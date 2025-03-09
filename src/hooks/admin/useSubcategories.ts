import { useState, useCallback, useEffect } from "react";
import { 
  loadFromStorage, 
  saveAndBroadcast, 
  SUBCATEGORIES_KEY, 
  SUBCATEGORIES_EVENT 
} from "./adminUtils";
import { SUBCATEGORIES as initialSubcategories } from "@/constants/categories";

// Define types
type SubcategoriesMap = Record<string, string[]>;

// Initialize global subcategories state from localStorage or default values
const initialGlobalSubcategories = loadFromStorage<SubcategoriesMap>(SUBCATEGORIES_KEY, initialSubcategories);

export function useSubcategories() {
  const [subcategories, setSubcategories] = useState<SubcategoriesMap>(initialGlobalSubcategories);
  
  // Listen for storage and custom events to keep state in sync
  useEffect(() => {
    console.log("Setting up subcategories event listeners");
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === SUBCATEGORIES_KEY) {
        try {
          console.log("Storage event detected for subcategories", e);
          if (e.newValue) {
            const updatedSubcategories = JSON.parse(e.newValue);
            setSubcategories(updatedSubcategories);
            console.log("Subcategories updated from storage event:", updatedSubcategories);
          }
        } catch (error) {
          console.error("Error parsing subcategories from storage event:", error);
        }
      }
    };
    
    // Custom event handlers
    const handleSubcategoriesEvent = (e: CustomEvent<SubcategoriesMap>) => {
      console.log("Custom event detected for subcategories", e);
      if (e.detail) {
        setSubcategories(e.detail);
        console.log("Subcategories updated from custom event:", e.detail);
      }
    };
    
    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(SUBCATEGORIES_EVENT, handleSubcategoriesEvent as EventListener);
    
    // Force initial sync
    const storedData = localStorage.getItem(SUBCATEGORIES_KEY);
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setSubcategories(parsedData);
        console.log("Initial sync of subcategories from localStorage:", parsedData);
      } catch (e) {
        console.error("Error during initial sync of subcategories:", e);
      }
    }
    
    return () => {
      console.log("Removing subcategories event listeners");
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
      console.log("Updated subcategories for:", category, newSubcategories);
      
      return updatedSubcategories;
    });
  }, []);

  return {
    subcategories,
    updateSubcategories
  };
}
