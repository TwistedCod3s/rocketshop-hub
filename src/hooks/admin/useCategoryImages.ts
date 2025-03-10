
import { useState, useCallback, useEffect } from "react";
import { 
  loadFromStorage, 
  saveAndBroadcast, 
  CATEGORY_IMAGES_KEY, 
  CATEGORY_IMAGES_EVENT 
} from "./adminUtils";

// Define types
type CategoryImagesMap = Record<string, string>;

// Initialize global category images state from localStorage or default values
const initialGlobalCategoryImages = loadFromStorage<CategoryImagesMap>(CATEGORY_IMAGES_KEY, {});

export function useCategoryImages() {
  const [categoryImages, setCategoryImages] = useState<CategoryImagesMap>(initialGlobalCategoryImages);
  
  // Function to forcibly reload from localStorage
  const reloadFromStorage = useCallback(() => {
    try {
      const storedData = localStorage.getItem(CATEGORY_IMAGES_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setCategoryImages(parsedData);
        console.log("Manually reloaded category images from localStorage:", parsedData);
      }
    } catch (e) {
      console.error("Error during manual reload of category images:", e);
    }
  }, []);
  
  // Listen for storage and custom events to keep state in sync
  useEffect(() => {
    console.log("Setting up category images event listeners");
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CATEGORY_IMAGES_KEY) {
        try {
          console.log("Storage event detected for category images", e);
          if (e.newValue) {
            const updatedImages = JSON.parse(e.newValue);
            setCategoryImages(updatedImages);
            console.log("Category images updated from storage event:", updatedImages);
          }
        } catch (error) {
          console.error("Error parsing category images from storage event:", error);
          // Attempt recovery
          reloadFromStorage();
        }
      }
    };
    
    // Custom event handlers
    const handleCategoryImagesEvent = (e: CustomEvent<CategoryImagesMap>) => {
      console.log("Custom event detected for category images", e);
      if (e.detail) {
        setCategoryImages(e.detail);
        console.log("Category images updated from custom event:", e.detail);
      }
    };
    
    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(CATEGORY_IMAGES_EVENT, handleCategoryImagesEvent as EventListener);
    
    // Force initial sync
    reloadFromStorage();
    
    return () => {
      console.log("Removing category images event listeners");
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(CATEGORY_IMAGES_EVENT, handleCategoryImagesEvent as EventListener);
    };
  }, [reloadFromStorage]);
  
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
    try {
      // Update local state using functional form to ensure we're working with the latest state
      setCategoryImages(prevImages => {
        const updatedImages = { ...prevImages, [categorySlug]: imageUrl };
        
        // Save to localStorage and broadcast with more aggressive synchronization
        saveAndBroadcast(CATEGORY_IMAGES_KEY, CATEGORY_IMAGES_EVENT, updatedImages);
        
        // Also create a backup copy with timestamp to ensure persistence
        const backupKey = `${CATEGORY_IMAGES_KEY}_BACKUP_${Date.now()}`;
        localStorage.setItem(backupKey, JSON.stringify(updatedImages));
        
        console.log("Updated category image for:", categorySlug, imageUrl);
        console.log("Created backup copy at:", backupKey);
        
        return updatedImages;
      });
    } catch (error) {
      console.error("Error updating category image:", error);
    }
  }, []);

  // Function to delete a category image
  const deleteCategoryImage = useCallback((categorySlug: string) => {
    try {
      setCategoryImages(prevImages => {
        const updatedImages = { ...prevImages };
        delete updatedImages[categorySlug];
        
        // Save to localStorage and broadcast
        saveAndBroadcast(CATEGORY_IMAGES_KEY, CATEGORY_IMAGES_EVENT, updatedImages);
        console.log("Deleted category image for:", categorySlug);
        
        return updatedImages;
      });
    } catch (error) {
      console.error("Error deleting category image:", error);
    }
  }, []);

  return {
    categoryImages,
    handleFileUpload,
    updateCategoryImage,
    deleteCategoryImage,
    reloadFromStorage
  };
}
