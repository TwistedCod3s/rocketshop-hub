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
    const storedData = localStorage.getItem(CATEGORY_IMAGES_KEY);
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setCategoryImages(parsedData);
        console.log("Initial sync of category images from localStorage:", parsedData);
      } catch (e) {
        console.error("Error during initial sync of category images:", e);
      }
    }
    
    return () => {
      console.log("Removing category images event listeners");
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(CATEGORY_IMAGES_EVENT, handleCategoryImagesEvent as EventListener);
    };
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
    // Update local state using functional form to ensure we're working with the latest state
    setCategoryImages(prevImages => {
      const updatedImages = { ...prevImages, [categorySlug]: imageUrl };
      
      // Save to localStorage and broadcast
      saveAndBroadcast(CATEGORY_IMAGES_KEY, CATEGORY_IMAGES_EVENT, updatedImages);
      console.log("Updated category image for:", categorySlug, imageUrl);
      
      return updatedImages;
    });
  }, []);

  return {
    categoryImages,
    handleFileUpload,
    updateCategoryImage
  };
}
