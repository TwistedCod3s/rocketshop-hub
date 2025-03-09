import { useState, useCallback, useEffect } from "react";
import { 
  loadFromStorage, 
  saveAndBroadcast, 
  CATEGORY_IMAGES_KEY, 
  CATEGORY_IMAGES_EVENT 
} from "./adminUtils";

// Initialize global category images state from localStorage or default values
let globalCategoryImages = loadFromStorage<Record<string, string>>(CATEGORY_IMAGES_KEY, {});

export function useCategoryImages() {
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>(globalCategoryImages);
  
  // Listen for storage and custom events to keep state in sync
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CATEGORY_IMAGES_KEY) {
        try {
          const updatedImages = JSON.parse(e.newValue || '{}');
          globalCategoryImages = updatedImages;
          setCategoryImages(updatedImages);
          console.log("Category images updated from another tab/window");
        } catch (error) {
          console.error("Error parsing category images from storage event:", error);
        }
      }
    };
    
    // Custom event handlers
    const handleCategoryImagesEvent = (e: CustomEvent) => {
      globalCategoryImages = e.detail;
      setCategoryImages(e.detail);
    };
    
    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(CATEGORY_IMAGES_EVENT, handleCategoryImagesEvent as EventListener);
    
    return () => {
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
    // Update global state
    const updatedImages = { ...globalCategoryImages, [categorySlug]: imageUrl };
    globalCategoryImages = updatedImages;
    setCategoryImages(updatedImages);
    
    // Save to localStorage and broadcast
    saveAndBroadcast(CATEGORY_IMAGES_KEY, CATEGORY_IMAGES_EVENT, updatedImages);
    console.log("Updated category image for:", categorySlug);
  }, []);

  return {
    categoryImages,
    handleFileUpload,
    updateCategoryImage
  };
}
