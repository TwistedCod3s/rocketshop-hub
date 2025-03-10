
import { dbHelpers } from '@/lib/supabase';
import { Product, Coupon } from '@/types/shop';

// Function to save all admin data to the database
export const saveAdminDataToDatabase = async (
  products: Product[],
  categoryImages: Record<string, string>,
  subcategories: Record<string, string[]>,
  coupons: Coupon[]
): Promise<boolean> => {
  try {
    console.log("Saving admin data to database...");
    
    // Save products
    if (products && products.length > 0) {
      await dbHelpers.saveProducts(products);
      console.log("Saved products to database");
    }
    
    // Save category images
    if (categoryImages && Object.keys(categoryImages).length > 0) {
      await dbHelpers.saveCategoryImages(categoryImages);
      console.log("Saved category images to database");
    }
    
    // Save subcategories
    if (subcategories && Object.keys(subcategories).length > 0) {
      await dbHelpers.saveSubcategories(subcategories);
      console.log("Saved subcategories to database");
    }
    
    // Save coupons
    if (coupons && coupons.length > 0) {
      await dbHelpers.saveCoupons(coupons);
      console.log("Saved coupons to database");
    }
    
    console.log("Successfully saved all admin data to database");
    return true;
  } catch (error) {
    console.error("Error saving admin data to database:", error);
    throw error;
  }
};

// Function to load all admin data from the database
export const loadAdminDataFromDatabase = async (): Promise<{
  products: Product[];
  categoryImages: Record<string, string>;
  subcategories: Record<string, string[]>;
  coupons: Coupon[];
}> => {
  try {
    console.log("Loading admin data from database...");
    
    // Load products
    const products = await dbHelpers.getProducts();
    console.log("Loaded products from database:", products.length);
    
    // Load category images
    const categoryImages = await dbHelpers.getCategoryImages();
    console.log("Loaded category images from database");
    
    // Load subcategories
    const subcategories = await dbHelpers.getSubcategories();
    console.log("Loaded subcategories from database");
    
    // Load coupons
    const coupons = await dbHelpers.getCoupons();
    console.log("Loaded coupons from database:", coupons.length);
    
    return {
      products,
      categoryImages,
      subcategories,
      coupons
    };
  } catch (error) {
    console.error("Error loading admin data from database:", error);
    throw error;
  }
};

// Function to initialize the database with data from localStorage
export const initializeDatabaseFromLocalStorage = async (): Promise<boolean> => {
  try {
    console.log("Initializing database from localStorage...");
    
    // Load data from localStorage
    const products = JSON.parse(localStorage.getItem('ROCKETRY_SHOP_PRODUCTS_V7') || '[]');
    const categoryImages = JSON.parse(localStorage.getItem('ROCKETRY_SHOP_CATEGORY_IMAGES_V7') || '{}');
    const subcategories = JSON.parse(localStorage.getItem('ROCKETRY_SHOP_SUBCATEGORIES_V7') || '{}');
    const coupons = JSON.parse(localStorage.getItem('ROCKETRY_SHOP_COUPONS_V7') || '[]');
    
    // Save data to database
    await saveAdminDataToDatabase(products, categoryImages, subcategories, coupons);
    
    console.log("Successfully initialized database from localStorage");
    return true;
  } catch (error) {
    console.error("Error initializing database from localStorage:", error);
    return false;
  }
};
