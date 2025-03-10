
import { dbHelpers } from '@/lib/supabase';
import { Product, Coupon } from '@/types/shop';
import { v4 as uuidv4 } from 'uuid';
import { convertProductToDbSchema, ensureCouponHasValidUUID } from './schemaUtils';

// Helper function to ensure UUID validity
const ensureValidUUID = (id: string | undefined): string => {
  if (!id) return uuidv4();
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return uuidv4();
  }
  return id;
};

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
      console.log(`Attempting to save ${products.length} products to database`);
      // Convert each product to ensure it has a valid UUID and follows DB schema
      const dbReadyProducts = products.map(product => convertProductToDbSchema(product));
      
      // The error occurs here - we need to pass the properly typed array to saveProducts
      // TypeScript treats this as products type isn't maintained
      await dbHelpers.saveProducts(dbReadyProducts as any); // Use type assertion as a temporary fix
      console.log("Saved products to database");
    }
    
    // Save category images
    if (categoryImages && Object.keys(categoryImages).length > 0) {
      console.log(`Attempting to save ${Object.keys(categoryImages).length} category images to database`);
      // Generate a UUID for category images entries if needed
      const dbReadyCategoryImages = Object.entries(categoryImages).reduce((acc, [slug, url]) => {
        acc[slug] = url;
        return acc;
      }, {} as Record<string, string>);
      
      await dbHelpers.saveCategoryImages(dbReadyCategoryImages);
      console.log("Saved category images to database");
    }
    
    // Save subcategories
    if (subcategories && Object.keys(subcategories).length > 0) {
      console.log(`Attempting to save ${Object.keys(subcategories).length} subcategory entries to database`);
      // No modification needed for subcategories
      await dbHelpers.saveSubcategories(subcategories);
      console.log("Saved subcategories to database");
    }
    
    // Save coupons with UUID validation
    if (coupons && coupons.length > 0) {
      // Make sure all coupons have valid UUIDs
      const validatedCoupons = coupons.map(coupon => ensureCouponHasValidUUID(coupon));
      
      console.log(`Attempting to save ${validatedCoupons.length} coupons to database`);
      await dbHelpers.saveCoupons(validatedCoupons);
      console.log("Saved coupons to database");
    }
    
    console.log("Successfully saved all admin data to database");
    return true;
  } catch (error) {
    console.error("Error saving admin data to database:", error);
    // Ensure we capture and show any errors from the Supabase operations
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    } else {
      console.error("Non-error object thrown:", error);
    }
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
    console.log("Loaded category images from database:", Object.keys(categoryImages).length);
    
    // Load subcategories
    const subcategories = await dbHelpers.getSubcategories();
    console.log("Loaded subcategories from database:", Object.keys(subcategories).length);
    
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
    // Ensure we capture and show any errors from the Supabase operations
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    } else {
      console.error("Non-error object thrown:", error);
    }
    throw error;
  }
};

// Function to initialize the database with data from localStorage
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
