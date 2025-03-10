
import { Product, Coupon } from '@/types/shop';
import { saveAdminDataToDatabase } from './saveAdminData';

/**
 * Function to initialize the database with data from localStorage
 */
export const initializeDatabaseFromLocalStorage = async (): Promise<boolean> => {
  try {
    console.log("Initializing database from localStorage...");
    
    // Load data from localStorage
    const productsStr = localStorage.getItem('ROCKETRY_SHOP_PRODUCTS_V7');
    const categoryImagesStr = localStorage.getItem('ROCKETRY_SHOP_CATEGORY_IMAGES_V7');
    const subcategoriesStr = localStorage.getItem('ROCKETRY_SHOP_SUBCATEGORIES_V7');
    const couponsStr = localStorage.getItem('ROCKETRY_SHOP_COUPONS_V7');
    
    console.log("Retrieved from localStorage:", {
      hasProducts: !!productsStr,
      hasCategoryImages: !!categoryImagesStr,
      hasSubcategories: !!subcategoriesStr,
      hasCoupons: !!couponsStr
    });
    
    // Parse data with error handling
    let products: Product[] = [];
    let categoryImages: Record<string, string> = {};
    let subcategories: Record<string, string[]> = {};
    let coupons: Coupon[] = [];
    
    try {
      products = productsStr ? JSON.parse(productsStr) : [];
      console.log(`Parsed ${products.length} products from localStorage`);
    } catch (e) {
      console.error("Error parsing products:", e);
      products = [];
    }
    
    try {
      categoryImages = categoryImagesStr ? JSON.parse(categoryImagesStr) : {};
      console.log(`Parsed ${Object.keys(categoryImages).length} category images from localStorage`);
    } catch (e) {
      console.error("Error parsing category images:", e);
      categoryImages = {};
    }
    
    try {
      subcategories = subcategoriesStr ? JSON.parse(subcategoriesStr) : {};
      console.log(`Parsed ${Object.keys(subcategories).length} subcategory entries from localStorage`);
    } catch (e) {
      console.error("Error parsing subcategories:", e);
      subcategories = {};
    }
    
    try {
      coupons = couponsStr ? JSON.parse(couponsStr) : [];
      console.log(`Parsed ${coupons.length} coupons from localStorage`);
    } catch (e) {
      console.error("Error parsing coupons:", e);
      coupons = [];
    }
    
    // Save data to database
    const result = await saveAdminDataToDatabase(products, categoryImages, subcategories, coupons);
    
    if (result) {
      console.log("Successfully initialized database from localStorage");
      
      // Trigger a global sync notification after database update is complete
      // This will notify all clients to refresh their data
      const timestamp = new Date().toISOString();
      localStorage.setItem("ROCKETRY_SHOP_SYNC_TRIGGER_V7", timestamp);
      
      // Dispatch a custom sync event
      window.dispatchEvent(new CustomEvent("rocketry-sync-trigger-v7", { 
        detail: { timestamp, source: "database-init" } 
      }));
      
      // Update the last sync timestamp
      localStorage.setItem("ROCKETRY_LAST_SYNC_TIMESTAMP", timestamp);
      
      return true;
    } else {
      throw new Error("Database initialization returned false");
    }
  } catch (error) {
    console.error("Error initializing database from localStorage:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    } else {
      console.error("Non-error object thrown:", error);
    }
    throw error;
  }
};
