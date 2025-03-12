import { useState, useCallback, useEffect } from "react";
import { 
  loadFromStorage, 
  saveAndBroadcast, 
  CATEGORY_IMAGES_KEY, 
  CATEGORY_IMAGES_EVENT 
} from "./adminUtils";
import { dbHelpers } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

// Define types
type CategoryImagesMap = Record<string, string>;

// Type guard to check if value is a CategoryImagesMap
function isCategoryImagesMap(value: unknown): value is CategoryImagesMap {
  if (!value || typeof value !== 'object') return false;
  
  // Check if all entries are string key-value pairs
  return Object.entries(value).every(
    ([key, val]) => typeof key === 'string' && typeof val === 'string'
  );
}

// Initialize global category images state from localStorage or default values
const initialGlobalCategoryImages = loadFromStorage<CategoryImagesMap>(CATEGORY_IMAGES_KEY, {});

export function useCategoryImages() {
  const [categoryImages, setCategoryImages] = useState<CategoryImagesMap>(initialGlobalCategoryImages);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  
  // Function to forcibly reload from localStorage
  const reloadFromStorage = useCallback(() => {
    try {
      const storedData = localStorage.getItem(CATEGORY_IMAGES_KEY);
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          if (isCategoryImagesMap(parsedData)) {
            setCategoryImages(parsedData);
            console.log("Manually reloaded category images from localStorage:", parsedData);
          } else {
            throw new Error("Invalid category images data structure");
          }
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
                  if (isCategoryImagesMap(parsedBackup)) {
                    setCategoryImages(parsedBackup);
                    console.log("Recovered category images from backup:", key, parsedBackup);
                    
                    // Restore the main entry
                    localStorage.setItem(CATEGORY_IMAGES_KEY, backupData);
                    recovered = true;
                    break;
                  }
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
      loadDataFromDatabase();
    };
    
    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(CATEGORY_IMAGES_EVENT, handleCategoryImagesEvent as EventListener);
    window.addEventListener('rocketry-sync-trigger-v7', handleSyncEvent);
    
    // Initial data load
    loadDataFromDatabase();
    
    return () => {
      console.log("Removing category images event listeners");
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(CATEGORY_IMAGES_EVENT, handleCategoryImagesEvent as EventListener);
      window.removeEventListener('rocketry-sync-trigger-v7', handleSyncEvent);
    };
  }, [reloadFromStorage]);
  
  // Function to load data directly from the database
  const loadDataFromDatabase = async () => {
    try {
      console.log("Loading category images from database...");
      const images = await dbHelpers.getCategoryImages();
      
      if (images && isCategoryImagesMap(images)) {
        console.log("Loaded category images from database:", images);
        setCategoryImages(images);
        
        // Also update localStorage to stay in sync
        localStorage.setItem(CATEGORY_IMAGES_KEY, JSON.stringify(images));
      } else {
        // If no data in database or invalid data, fall back to localStorage
        reloadFromStorage();
      }
    } catch (err) {
      console.error("Failed to load category images from database:", err);
      reloadFromStorage();
    }
  };
  
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
  const updateCategoryImage = useCallback(async (categorySlug: string, imageUrl: string) => {
    try {
      setIsUpdating(true);
      console.log(`Updating image for category slug ${categorySlug}, image size: ${imageUrl.length} chars`);
      
      // Update local state using functional form to ensure we're working with the latest state
      setCategoryImages(prevImages => {
        const updatedImages = { ...prevImages, [categorySlug]: imageUrl };
        
        // First sync to database directly
        dbHelpers.saveCategoryImages(updatedImages)
          .then(success => {
            if (success) {
              console.log("Successfully synced category images to database");
              // Only update localStorage and broadcast if database sync was successful
              saveAndBroadcast(CATEGORY_IMAGES_KEY, CATEGORY_IMAGES_EVENT, updatedImages);
              toast({
                title: "Category image updated",
                description: "Image has been saved to the database",
              });
            } else {
              console.error("Failed to sync category images to database");
              toast({
                title: "Error updating image",
                description: "Could not save to database. Please try again.",
                variant: "destructive"
              });
            }
            setIsUpdating(false);
          })
          .catch(err => {
            console.error("Error during sync to database:", err);
            toast({
              title: "Error updating image",
              description: "Database error. Please try again.",
              variant: "destructive"
            });
            setIsUpdating(false);
          });
        
        return updatedImages;
      });
      
    } catch (error) {
      console.error("Error updating category image:", error);
      setIsUpdating(false);
      
      toast({
        title: "Error updating image",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Function to delete a category image
  const deleteCategoryImage = useCallback(async (categorySlug: string) => {
    try {
      setIsUpdating(true);
      
      setCategoryImages(prevImages => {
        const updatedImages = { ...prevImages };
        delete updatedImages[categorySlug];
        
        // First sync to database directly
        dbHelpers.saveCategoryImages(updatedImages)
          .then(success => {
            if (success) {
              console.log("Successfully deleted category image from database");
              // Only update localStorage and broadcast if database sync was successful
              saveAndBroadcast(CATEGORY_IMAGES_KEY, CATEGORY_IMAGES_EVENT, updatedImages);
              toast({
                title: "Category image deleted",
                description: "Image has been removed from the database",
              });
            } else {
              console.error("Failed to delete category image from database");
              toast({
                title: "Error deleting image",
                description: "Could not remove from database. Please try again.",
                variant: "destructive"
              });
            }
            setIsUpdating(false);
          })
          .catch(err => {
            console.error("Error during deletion from database:", err);
            toast({
              title: "Error deleting image",
              description: "Database error. Please try again.",
              variant: "destructive"
            });
            setIsUpdating(false);
          });
        
        return updatedImages;
      });
      
    } catch (error) {
      console.error("Error deleting category image:", error);
      setIsUpdating(false);
      
      toast({
        title: "Error deleting image",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  }, [toast]);

  return {
    categoryImages,
    handleFileUpload,
    updateCategoryImage,
    deleteCategoryImage,
    reloadFromStorage,
    isUpdating
  };
}
