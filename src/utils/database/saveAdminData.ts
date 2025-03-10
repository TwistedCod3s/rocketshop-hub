
import { Product, Coupon } from '@/types/shop';
import { dbHelpers } from '@/lib/supabase';

/**
 * Function to save all admin data to the database
 */
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
      await dbHelpers.saveProducts(products);
      console.log("Saved products to database");
    }
    
    // Save category images
    if (categoryImages && Object.keys(categoryImages).length > 0) {
      console.log(`Attempting to save ${Object.keys(categoryImages).length} category images to database`);
      await dbHelpers.saveCategoryImages(categoryImages);
      console.log("Saved category images to database");
    }
    
    // Save subcategories
    if (subcategories && Object.keys(subcategories).length > 0) {
      console.log(`Attempting to save ${Object.keys(subcategories).length} subcategory entries to database`);
      await dbHelpers.saveSubcategories(subcategories);
      console.log("Saved subcategories to database");
    }
    
    // Save coupons
    if (coupons && coupons.length > 0) {
      console.log(`Attempting to save ${coupons.length} coupons to database`);
      await dbHelpers.saveCoupons(coupons);
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
