import { createClient } from '@supabase/supabase-js';

// Create a global variable to store the client instance
let supabaseClientInstance: any = null;

// Initialize Supabase client
export const getSupabaseClient = () => {
  if (supabaseClientInstance) {
    return supabaseClientInstance;
  }

  // Get credentials from localStorage first (more reliable)
  const supabaseUrl = localStorage.getItem('ROCKETRY_DB_URL') || import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = localStorage.getItem('ROCKETRY_DB_KEY') || import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Anon Key missing. Check localStorage or environment variables.");
    return null;
  }

  try {
    console.log("Initializing Supabase client with URL:", supabaseUrl.substring(0, 15) + "...");
    supabaseClientInstance = createClient(supabaseUrl, supabaseAnonKey);
    return supabaseClientInstance;
  } catch (e) {
    console.error("Error initializing Supabase client:", e);
    return null;
  }
};

// Reset client instance (useful when updating URL/key)
export const resetSupabaseClient = () => {
  console.log("Resetting Supabase client instance");
  supabaseClientInstance = null;
};

// Database helper functions
export const dbHelpers = {
  getProducts: async () => {
    try {
      const client = getSupabaseClient();
      if (!client) return [];

      const { data, error } = await client
        .from('products')
        .select('*');

      if (error) {
        console.error("Error fetching products:", error);
        return [];
      }

      return data || [];
    } catch (e) {
      console.error("Error in getProducts:", e);
      return [];
    }
  },

  saveProducts: async (products: any[]) => {
    try {
      const client = getSupabaseClient();
      if (!client) return false;

      // Remove any fields that might not exist in the database schema
      const cleanedProducts = products.map(product => {
        const { last_updated, ...rest } = product;
        return rest;
      });

      const { data, error } = await client
        .from('products')
        .upsert(cleanedProducts, {
          onConflict: 'id'
        });

      if (error) {
        console.error("Error saving products:", error);
        return false;
      }

      console.log("Saved products to database");
      return true;
    } catch (e) {
      console.error("Error in saveProducts:", e);
      return false;
    }
  },

  getCategoryImages: async () => {
    try {
      const client = getSupabaseClient();
      if (!client) return {};

      const { data, error } = await client
        .from('category_images')
        .select('*');

      if (error) {
        console.error("Error fetching category images:", error);
        return {};
      }

      // Convert the array of objects to a single object
      const categoryImages: Record<string, string> = {};
      data.forEach((item: any) => {
        // Use the correct column name based on your schema
        const categorySlug = item.category_slug || item.category || '';
        const imageUrl = item.image_url || item.imageUrl || '';
        
        if (categorySlug) {
          categoryImages[categorySlug] = imageUrl;
        }
      });

      return categoryImages;
    } catch (e) {
      console.error("Error in getCategoryImages:", e);
      return {};
    }
  },

  saveCategoryImages: async (categoryImages: Record<string, string>) => {
    try {
      const client = getSupabaseClient();
      if (!client) return false;

      // First check if the table has id column required
      let needsId = false;
      try {
        const { data: tableInfo, error: tableError } = await client
          .from('category_images')
          .select('id')
          .limit(1);

        needsId = !tableError;
      } catch (e) {
        console.log("Couldn't determine if id column is needed, will include it");
        needsId = true;
      }

      // Convert the single object to an array of objects
      const categoryImagesArray = Object.entries(categoryImages).map(([category_slug, image_url]) => {
        const entry: any = {
          category_slug,
          image_url
        };
        
        // Add ID if needed
        if (needsId) {
          entry.id = crypto.randomUUID();
        }
        
        return entry;
      });

      // Use update if conflict since these might already exist
      const { data, error } = await client
        .from('category_images')
        .upsert(categoryImagesArray, {
          onConflict: 'category_slug'
        });

      if (error) {
        console.error("Error saving category images:", error);
        return false;
      }

      console.log("Saved category images to database");
      return true;
    } catch (e) {
      console.error("Error in saveCategoryImages:", e);
      return false;
    }
  },

  getSubcategories: async () => {
    try {
      const client = getSupabaseClient();
      if (!client) return {};

      const { data, error } = await client
        .from('subcategories')
        .select('*');

      if (error) {
        console.error("Error fetching subcategories:", error);
        return {};
      }

      // Convert the array of objects to a single object
      const subcategories: Record<string, string[]> = {};
      data.forEach((item: any) => {
        // Try different possible column names
        const categorySlug = item.category_slug || item.category || '';
        const subcategoryList = item.subcategories || item.subcategory_list || [];
        
        if (categorySlug) {
          subcategories[categorySlug] = subcategoryList;
        }
      });

      return subcategories;
    } catch (e) {
      console.error("Error in getSubcategories:", e);
      return {};
    }
  },

  saveSubcategories: async (subcategories: Record<string, string[]>) => {
    try {
      const client = getSupabaseClient();
      if (!client) return false;

      // Determine the correct column names by testing the table structure
      let categorySlugField = 'category_slug';
      let subcategoriesField = 'subcategories';
      
      try {
        // Try to get one record to see the column structure
        const { data: sampleData, error: sampleError } = await client
          .from('subcategories')
          .select('*')
          .limit(1);
        
        if (sampleError && sampleError.message.includes("category_slug")) {
          categorySlugField = 'category'; // Fallback column name
        }
        
        if (sampleError && sampleError.message.includes("subcategories")) {
          subcategoriesField = 'subcategory_list'; // Fallback column name
        }
      } catch (e) {
        console.log("Error checking subcategories table structure:", e);
        // Keep the default column names
      }

      // Check if the table has id column
      let needsId = false;
      try {
        const { data: tableInfo, error: tableError } = await client
          .from('subcategories')
          .select('id')
          .limit(1);

        needsId = !tableError;
      } catch (e) {
        console.log("Couldn't determine if id column is needed, will include it");
        needsId = true;
      }

      // Convert the single object to an array of objects
      const subcategoriesArray = Object.entries(subcategories).map(([category, subcategoryList]) => {
        const entry: any = {};
        entry[categorySlugField] = category;
        entry[subcategoriesField] = subcategoryList;
        
        // Add ID if needed
        if (needsId) {
          entry.id = crypto.randomUUID();
        }
        
        return entry;
      });

      const { data, error } = await client
        .from('subcategories')
        .upsert(subcategoriesArray, {
          onConflict: categorySlugField
        });

      if (error) {
        console.error("Error saving subcategories:", error);
        return false;
      }

      console.log("Saved subcategories to database");
      return true;
    } catch (e) {
      console.error("Error in saveSubcategories:", e);
      return false;
    }
  },

  getCoupons: async () => {
    try {
      const client = getSupabaseClient();
      if (!client) return [];

      const { data, error } = await client
        .from('coupons')
        .select('*');

      if (error) {
        console.error("Error fetching coupons:", error);
        return [];
      }

      return data || [];
    } catch (e) {
      console.error("Error in getCoupons:", e);
      return [];
    }
  },

  saveCoupons: async (coupons: any[]) => {
    try {
      const client = getSupabaseClient();
      if (!client) return false;

      // Determine if discountPercentage column exists
      let hasDiscountPercentage = true;
      try {
        const { error: testError } = await client
          .from('coupons')
          .select('discountPercentage')
          .limit(1);
        
        if (testError && testError.message.includes('discountPercentage')) {
          hasDiscountPercentage = false;
        }
      } catch (e) {
        console.log("Error checking coupons table structure, assuming discountPercentage exists:", e);
      }

      // Remove fields that don't exist in the schema
      const cleanedCoupons = coupons.map(coupon => {
        const cleaned = { ...coupon };
        
        // Remove discountPercentage if it doesn't exist in the schema
        if (!hasDiscountPercentage) {
          delete cleaned.discountPercentage;
        }
        
        return cleaned;
      });

      const { data, error } = await client
        .from('coupons')
        .upsert(cleanedCoupons, {
          onConflict: 'id'
        });

      if (error) {
        console.error("Error saving coupons:", error);
        return false;
      }

      console.log("Saved coupons to database");
      return true;
    } catch (e) {
      console.error("Error in saveCoupons:", e);
      return false;
    }
  },

  getLatestUpdateTimestamp: async (): Promise<string | null> => {
    try {
      const client = getSupabaseClient();
      if (!client) return null;
      
      // Try to get the latest updated product - check if last_updated exists
      try {
        const { data, error } = await client
          .from('products')
          .select('last_updated')
          .order('last_updated', { ascending: false })
          .limit(1);
        
        if (!error && data && data.length > 0 && data[0].last_updated) {
          return data[0].last_updated || null;
        }
      } catch (e) {
        console.log("last_updated column doesn't exist, using created_at instead");
      }
      
      // Fallback to created_at if last_updated doesn't exist
      try {
        const { data, error } = await client
          .from('products')
          .select('created_at')
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (!error && data && data.length > 0) {
          return data[0].created_at || null;
        }
      } catch (e) {
        console.log("created_at column doesn't exist either, returning null");
      }
      
      return null;
    } catch (e) {
      console.error("Error in getLatestUpdateTimestamp:", e);
      return null;
    }
  },
};
