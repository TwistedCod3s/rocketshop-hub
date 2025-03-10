
import { useState, useCallback, useEffect } from "react";
import { 
  loadFromStorage, 
  saveAndBroadcast, 
  CATEGORY_IMAGES_KEY, 
  CATEGORY_IMAGES_EVENT 
} from "./adminUtils";
import { dbHelpers } from "@/lib/supabase";

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
        try {
          const parsedData = JSON.parse(storedData);
          setCategoryImages(parsedData);
          console.log("Manually reloaded category images from localStorage:", parsedData);
          
          // After loading from localStorage, sync to Supabase
          dbHelpers.saveCategoryImages(parsedData)
            .then(success => {
              if (success) {
                console.log("Auto-synced category images to Supabase after reload");
              }
            })
            .catch(err => console.error("Failed to auto-sync category images:", err));
        } catch (parseError) {
          console.error("Error parsing category images:", parseError);
          
          // Try to recover from backup
          let recovered = false;
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(`${CATEGORY_IMAGES_KEY}_BACKUP_`)) {
              try {
                const backupData = localStorage.getItem(key);
                if (backupData) {
                  const parsedBackup = JSON.parse(backupData);
                  setCategoryImages(parsedBackup);
                  console.log("Recovered category images from backup:", key, parsedBackup);
                  
                  // Restore the main entry
                  localStorage.setItem(CATEGORY_IMAGES_KEY, backupData);
                  recovered = true;
                  break;
                }
              } catch (backupError) {
                console.error(`Failed to recover from backup ${key}:`, backupError);
              }
            }
          }
          
          if (!recovered) {
            console.error("Could not recover category images from any backup");
          }
        }
      } else {
        console.log("No category images found in localStorage");
        setCategoryImages({});
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
      } else if (e.key === "ROCKETRY_SHOP_SYNC_TRIGGER_V7") {
        // General sync trigger - reload to be safe
        console.log("Sync trigger detected, reloading category images");
        reloadFromStorage();
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
    
    // Generic sync event handler
    const handleSyncEvent = () => {
      console.log("Sync event detected, reloading category images");
      reloadFromStorage();
    };
    
    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(CATEGORY_IMAGES_EVENT, handleCategoryImagesEvent as EventListener);
    window.addEventListener('rocketry-sync-trigger-v7', handleSyncEvent);
    
    // Force initial sync
    reloadFromStorage();
    
    return () => {
      console.log("Removing category images event listeners");
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(CATEGORY_IMAGES_EVENT, handleCategoryImagesEvent as EventListener);
      window.removeEventListener('rocketry-sync-trigger-v7', handleSyncEvent);
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
      // For debug - check the size of the image
      console.log(`Updating image for category slug ${categorySlug}, image size: ${imageUrl.length} chars`);
      
      // Update local state using functional form to ensure we're working with the latest state
      setCategoryImages(prevImages => {
        const updatedImages = { ...prevImages, [categorySlug]: imageUrl };
        
        // Save to localStorage and broadcast with more aggressive synchronization
        saveAndBroadcast(CATEGORY_IMAGES_KEY, CATEGORY_IMAGES_EVENT, updatedImages);
        
        console.log("Updated category image for:", categorySlug, "Data size:", imageUrl.length);
        
        // Direct sync to Supabase (in addition to the sync in saveAndBroadcast)
        setTimeout(() => {
          dbHelpers.saveCategoryImages(updatedImages)
            .then(success => {
              if (success) {
                console.log("Direct sync of category images to Supabase succeeded");
              } else {
                console.warn("Direct sync of category images to Supabase returned false");
              }
            })
            .catch(err => console.error("Error during direct sync to Supabase:", err));
        }, 100);
        
        return updatedImages;
      });
      
      // Set pending changes flag directly
      localStorage.setItem('ROCKETRY_SHOP_CHANGES_PENDING', 'true');
    } catch (error) {
      console.error("Error updating category image:", error);
      
      // Try recovery update if the first attempt failed
      try {
        const currentImages = { ...categoryImages, [categorySlug]: imageUrl };
        localStorage.setItem(CATEGORY_IMAGES_KEY, JSON.stringify(currentImages));
        localStorage.setItem('ROCKETRY_SHOP_CHANGES_PENDING', 'true');
        console.log("Used recovery path to save category image");
      } catch (recoveryError) {
        console.error("Recovery save also failed:", recoveryError);
      }
    }
  }, [categoryImages]);

  // Function to delete a category image
  const deleteCategoryImage = useCallback((categorySlug: string) => {
    try {
      setCategoryImages(prevImages => {
        const updatedImages = { ...prevImages };
        delete updatedImages[categorySlug];
        
        // Save to localStorage and broadcast
        saveAndBroadcast(CATEGORY_IMAGES_KEY, CATEGORY_IMAGES_EVENT, updatedImages);
        console.log("Deleted category image for:", categorySlug);
        
        // Direct sync to Supabase
        setTimeout(() => {
          dbHelpers.saveCategoryImages(updatedImages)
            .then(success => {
              if (success) {
                console.log("Direct sync of category images to Supabase after deletion succeeded");
              } else {
                console.warn("Direct sync of category images to Supabase after deletion returned false");
              }
            })
            .catch(err => console.error("Error during direct sync to Supabase after deletion:", err));
        }, 100);
        
        // Set pending changes flag
        localStorage.setItem('ROCKETRY_SHOP_CHANGES_PENDING', 'true');
        
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
