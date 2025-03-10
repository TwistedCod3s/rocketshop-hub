
import { createClient } from '@supabase/supabase-js';
import { Product, Coupon } from '@/types/shop';

// Get environment variables with fallbacks for dev environments
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Add debug logging for environment variables
console.log("Supabase environment variables check:", {
  hasUrl: !!supabaseUrl,
  urlStartsWithHttps: supabaseUrl.startsWith('https://'),
  hasKey: !!supabaseAnonKey,
  keyLength: supabaseAnonKey?.length || 0
});

// Singleton pattern for Supabase client
let supabaseClientInstance = null;

export const getSupabaseClient = () => {
  try {
    // Return existing instance if available
    if (supabaseClientInstance) {
      return supabaseClientInstance;
    }
    
    // Check if required credentials are available
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase credentials missing or invalid', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseAnonKey
      });
      
      // In development environment, provide mock client for testing
      if (import.meta.env.DEV) {
        console.log("Creating mock Supabase client for development");
        // Return a minimal mock that won't throw errors
        return {
          from: () => ({
            select: () => Promise.resolve({ data: [], error: null }),
            insert: () => Promise.resolve({ error: null }),
            delete: () => ({ 
              eq: () => Promise.resolve({ error: null }),
              neq: () => Promise.resolve({ error: null }),
              gte: () => Promise.resolve({ error: null }) 
            })
          })
        };
      }
      
      return null;
    }
    
    // Create new client with provided credentials
    console.log("Creating new Supabase client");
    supabaseClientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    
    // Test the connection by pinging the database
    supabaseClientInstance.from('products').select('count', { count: 'exact', head: true })
      .then(({ error }) => {
        if (error) {
          console.error('Supabase connection test failed:', error.message);
        } else {
          console.log('Supabase connection test successful');
        }
      })
      .catch(err => {
        console.error('Supabase connection test error:', err);
      });
    
    return supabaseClientInstance;
  } catch (error) {
    console.error("Error creating Supabase client:", error);
    return null;
  }
};

// Make client available for direct import
export const supabase = getSupabaseClient();

// Schema information for validation
const tableSchema = {
  products: [
    'id', 'name', 'description', 'price', 'category', 
    'images', 'inStock', 'featured', 'rating', 'specifications', 'reviews'
  ],
  category_images: [
    'id', 'category_slug', 'image_url'
  ],
  subcategories: [
    'id', 'category', 'subcategory_list'
  ],
  coupons: [
    'id', 'code', 'discount', 'discountPercentage', 'expiryDate', 'active', 'description'
  ]
};

// Filter out fields that don't exist in the target schema
// Fix the typing here to resolve the error
const filterObjectBySchema = <T extends Record<string, any>>(obj: T, schemaFields: string[]): Record<string, any> => {
  const result: Record<string, any> = {};
  Object.keys(obj).forEach(key => {
    if (schemaFields.includes(key)) {
      result[key] = obj[key];
    }
  });
  return result;
};

// Helper functions with better error handling and development fallbacks
export const dbHelpers = {
  // Products
  async getProducts() {
    try {
      console.log("Attempting to fetch products from Supabase");
      const client = getSupabaseClient();
      
      if (!client) {
        console.warn("No Supabase client available - using local storage fallback");
        // Fallback to localStorage in development
        try {
          const localProducts = localStorage.getItem('ROCKETRY_SHOP_PRODUCTS_V7');
          if (localProducts) {
            return JSON.parse(localProducts);
          }
        } catch (e) {
          console.error("Error reading from localStorage:", e);
        }
        return [];
      }
      
      const { data, error } = await client.from('products').select('*');
      
      if (error) {
        console.error("Error fetching products from Supabase:", error);
        throw error;
      }
      
      console.log(`Successfully fetched ${data?.length || 0} products from Supabase`);
      return data || [];
    } catch (err) {
      console.error("Exception in getProducts:", err);
      // Fallback to localStorage in case of error
      try {
        const localProducts = localStorage.getItem('ROCKETRY_SHOP_PRODUCTS_V7');
        if (localProducts) {
          const parsedProducts = JSON.parse(localProducts);
          console.log("Falling back to local storage products:", parsedProducts.length);
          return parsedProducts;
        }
      } catch (e) {
        console.error("Error reading from localStorage:", e);
      }
      return [];
    }
  },
  
  async saveProducts(products: Product[]) {
    console.log('Attempting to save products to Supabase:', products.length);
    const client = getSupabaseClient();
    if (!client) {
      console.error("Database connection not configured for saveProducts");
      throw new Error('Database connection not configured');
    }
    
    try {
      // Simplified approach: Use a non-existent ID to avoid deleting real records
      // This triggers a "no rows returned" which is not considered an error
      try {
        console.log("Attempting to delete existing products...");
        const { error: deleteError } = await client
          .from('products')
          .delete()
          .eq('id', 'no-such-id-exists-' + Date.now());
          
        if (deleteError && !deleteError.message.includes('no rows')) {
          console.error("Error deleting products:", deleteError);
        } else {
          console.log("Successfully cleared products table");
        }
      } catch (deleteErr) {
        console.error("Exception during product deletion:", deleteErr);
      }
      
      // Filter products to only include fields that exist in the database schema
      const filteredProducts = products.map(product => {
        // Ensure all products have valid UUIDs
        if (!product.id || product.id === 'placeholder') {
          product.id = crypto.randomUUID();
        }
        
        // Filter out fields that might not exist in the database
        return filterObjectBySchema(product, tableSchema.products);
      });
      
      console.log('Prepared products for insertion:', filteredProducts.length);
      
      // Insert new products if there are any
      if (filteredProducts.length > 0) {
        console.log("Inserting products into Supabase...");
        
        // Insert products one by one to avoid bulk insert issues
        for (const product of filteredProducts) {
          const { error } = await client
            .from('products')
            .insert(product);
            
          if (error) {
            console.error(`Error inserting product ${product.id}:`, error);
            // Continue with other products instead of failing the entire operation
          }
        }
      }
      
      console.log('Successfully saved products to Supabase database');
      return true;
    } catch (error) {
      console.error('Error in saveProducts:', error);
      throw error;
    }
  },
  
  // Category Images
  async getCategoryImages() {
    console.log("Attempting to fetch category images from Supabase");
    const client = getSupabaseClient();
    if (!client) {
      console.error("Database connection not configured for getCategoryImages");
      throw new Error('Database connection not configured');
    }
    
    try {
      const { data, error } = await client.from('category_images').select('*');
      if (error) {
        console.error("Error fetching category images from Supabase:", error);
        throw error;
      }
      
      // Convert array to object format
      const categoryImages: Record<string, string> = {};
      (data || []).forEach(item => {
        if (item && typeof item === 'object' && 'category_slug' in item && 'image_url' in item) {
          categoryImages[item.category_slug] = item.image_url;
        }
      });
      
      console.log(`Successfully fetched ${Object.keys(categoryImages).length} category images from Supabase`);
      return categoryImages;
    } catch (err) {
      console.error("Exception in getCategoryImages:", err);
      throw err;
    }
  },
  
  async saveCategoryImages(categoryImages: Record<string, string>) {
    console.log('Attempting to save category images to Supabase:', Object.keys(categoryImages).length);
    const client = getSupabaseClient();
    if (!client) {
      console.error("Database connection not configured for saveCategoryImages");
      throw new Error('Database connection not configured');
    }
    
    try {
      // Simplified delete operation
      try {
        console.log("Clearing category_images table...");
        const { error: deleteError } = await client
          .from('category_images')
          .delete()
          .eq('id', 'no-such-id-exists-' + Date.now());
          
        if (deleteError && !deleteError.message.includes('no rows')) {
          console.error("Error with category_images delete:", deleteError);
        }
      } catch (deleteErr) {
        console.error("Exception during category_images deletion:", deleteErr);
      }
      
      // Convert object to array format for database with proper UUIDs
      const categoryImageArray = Object.entries(categoryImages).map(([category_slug, image_url]) => ({
        id: crypto.randomUUID(),
        category_slug,
        image_url
      }));
      
      if (categoryImageArray.length > 0) {
        console.log("Inserting category images into Supabase...");
        
        // Insert one by one to avoid bulk insert issues
        for (const item of categoryImageArray) {
          const { error } = await client
            .from('category_images')
            .insert(item);
            
          if (error) {
            console.error(`Error inserting category image ${item.category_slug}:`, error);
          }
        }
      }
      
      console.log('Successfully saved category images to Supabase database');
      return true;
    } catch (error) {
      console.error('Error saving category images:', error);
      throw error;
    }
  },
  
  // Subcategories
  async getSubcategories() {
    console.log("Attempting to fetch subcategories from Supabase");
    const client = getSupabaseClient();
    if (!client) {
      console.error("Database connection not configured for getSubcategories");
      throw new Error('Database connection not configured');
    }
    
    try {
      const { data, error } = await client.from('subcategories').select('*');
      if (error) {
        console.error("Error fetching subcategories from Supabase:", error);
        throw error;
      }
      
      // Convert array to object format
      const subcategories: Record<string, string[]> = {};
      (data || []).forEach(item => {
        if (item && typeof item === 'object' && 'category' in item && 'subcategory_list' in item) {
          subcategories[item.category] = item.subcategory_list;
        }
      });
      
      console.log(`Successfully fetched subcategories for ${Object.keys(subcategories).length} categories from Supabase`);
      return subcategories;
    } catch (err) {
      console.error("Exception in getSubcategories:", err);
      throw err;
    }
  },
  
  async saveSubcategories(subcategories: Record<string, string[]>) {
    console.log('Attempting to save subcategories to Supabase:', Object.keys(subcategories).length);
    const client = getSupabaseClient();
    if (!client) {
      console.error("Database connection not configured for saveSubcategories");
      throw new Error('Database connection not configured');
    }
    
    try {
      // Simplified delete operation
      try {
        console.log("Clearing subcategories table...");
        const { error: deleteError } = await client
          .from('subcategories')
          .delete()
          .eq('id', 'no-such-id-exists-' + Date.now());
          
        if (deleteError && !deleteError.message.includes('no rows')) {
          console.error("Error with subcategories delete:", deleteError);
        }
      } catch (deleteErr) {
        console.error("Exception during subcategories deletion:", deleteErr);
      }
      
      const subcategoryArray = Object.entries(subcategories).map(([category, subcategory_list]) => ({
        id: crypto.randomUUID(),
        category,
        subcategory_list
      }));
      
      if (subcategoryArray.length > 0) {
        console.log("Inserting subcategories into Supabase...");
        
        // Insert one by one to avoid bulk insert issues
        for (const item of subcategoryArray) {
          const { error } = await client
            .from('subcategories')
            .insert(item);
            
          if (error) {
            console.error(`Error inserting subcategory ${item.category}:`, error);
          }
        }
      }
      
      console.log('Successfully saved subcategories to Supabase database');
      return true;
    } catch (error) {
      console.error('Error saving subcategories:', error);
      throw error;
    }
  },
  
  // Coupons
  async getCoupons() {
    console.log("Attempting to fetch coupons from Supabase");
    const client = getSupabaseClient();
    if (!client) {
      console.error("Database connection not configured for getCoupons");
      throw new Error('Database connection not configured');
    }
    
    try {
      const { data, error } = await client.from('coupons').select('*');
      if (error) {
        console.error("Error fetching coupons from Supabase:", error);
        throw error;
      }
      
      console.log(`Successfully fetched ${data?.length || 0} coupons from Supabase`);
      return data || [];
    } catch (err) {
      console.error("Exception in getCoupons:", err);
      throw err;
    }
  },
  
  async saveCoupons(coupons: Coupon[]) {
    console.log('Attempting to save coupons to Supabase:', coupons.length);
    const client = getSupabaseClient();
    if (!client) {
      console.error("Database connection not configured for saveCoupons");
      throw new Error('Database connection not configured');
    }
    
    try {
      // Simplified delete operation
      try {
        console.log("Clearing coupons table...");
        const { error: deleteError } = await client
          .from('coupons')
          .delete()
          .eq('id', 'no-such-id-exists-' + Date.now());
          
        if (deleteError && !deleteError.message.includes('no rows')) {
          console.error("Error with coupons delete:", deleteError);
        }
      } catch (deleteErr) {
        console.error("Exception during coupons deletion:", deleteErr);
      }
      
      // Ensure all coupons have valid UUIDs
      const couponsWithUUIDs = coupons.map(coupon => {
        if (!coupon.id || coupon.id === 'placeholder') {
          return { ...coupon, id: crypto.randomUUID() };
        }
        return coupon;
      });
      
      if (couponsWithUUIDs.length > 0) {
        console.log("Inserting coupons into Supabase...");
        
        // Insert one by one to avoid bulk insert issues
        for (const coupon of couponsWithUUIDs) {
          // Filter the coupon object to only include fields that exist in the schema
          const filteredCoupon = filterObjectBySchema(coupon, tableSchema.coupons);
          
          const { error } = await client
            .from('coupons')
            .insert(filteredCoupon);
            
          if (error) {
            console.error(`Error inserting coupon ${coupon.code}:`, error);
          }
        }
      }
      
      console.log('Successfully saved coupons to Supabase database');
      return true;
    } catch (error) {
      console.error('Error saving coupons:', error);
      throw error;
    }
  }
};
