import { createClient } from '@supabase/supabase-js';

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
              is: () => ({ then: (cb) => cb() && { error: null } }),
              not: () => Promise.resolve({ error: null })
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
  
  async saveProducts(products: any[]) {
    console.log('Attempting to save products to Supabase:', products.length);
    const client = getSupabaseClient();
    if (!client) {
      console.error("Database connection not configured for saveProducts");
      throw new Error('Database connection not configured');
    }
    
    try {
      // First delete all existing products - FIX: Use a simpler approach
      console.log("Deleting existing products...");
      
      // Use a single delete operation without chaining multiple operations
      const { error: deleteError } = await client
        .from('products')
        .delete()
        .neq('id', 'placeholder-id-that-doesnt-exist');  // This will match all records
        
      if (deleteError) {
        console.error("Error deleting products:", deleteError);
        throw deleteError;
      }
      
      // Ensure all products have valid UUIDs
      const productsWithUUIDs = products.map(product => {
        if (!product.id || product.id === 'placeholder') {
          return { ...product, id: crypto.randomUUID() };
        }
        return product;
      });
      
      console.log('Prepared products for insertion:', productsWithUUIDs.length);
      
      // Insert new products if there are any
      if (productsWithUUIDs.length > 0) {
        console.log("Inserting products into Supabase...");
        const { error } = await client
          .from('products')
          .insert(productsWithUUIDs);
          
        if (error) {
          console.error("Error inserting products:", error);
          throw error;
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
        categoryImages[item.category_slug] = item.image_url;
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
      // Convert object to array format for database with proper UUIDs
      const categoryImageArray = Object.entries(categoryImages).map(([category_slug, image_url]) => ({
        id: crypto.randomUUID(),
        category_slug,
        image_url
      }));
      
      console.log("Deleting existing category images...");
      // Delete existing records - FIX: Use a simpler approach
      const { error: deleteError } = await client
        .from('category_images')
        .delete()
        .neq('id', 'placeholder-id-that-doesnt-exist');  // This will match all records
        
      if (deleteError) {
        console.error("Error deleting category images:", deleteError);
        throw deleteError;
      }
      
      if (categoryImageArray.length > 0) {
        console.log("Inserting category images into Supabase...");
        const { error } = await client
          .from('category_images')
          .insert(categoryImageArray);
          
        if (error) {
          console.error("Error inserting category images:", error);
          throw error;
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
        subcategories[item.category] = item.subcategory_list;
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
      const subcategoryArray = Object.entries(subcategories).map(([category, subcategory_list]) => ({
        id: crypto.randomUUID(),
        category,
        subcategory_list
      }));
      
      console.log("Deleting existing subcategories...");
      // Delete existing records - FIX: Use a simpler approach
      const { error: deleteError } = await client
        .from('subcategories')
        .delete()
        .neq('id', 'placeholder-id-that-doesnt-exist');  // This will match all records
        
      if (deleteError) {
        console.error("Error deleting subcategories:", deleteError);
        throw deleteError;
      }
      
      if (subcategoryArray.length > 0) {
        console.log("Inserting subcategories into Supabase...");
        const { error } = await client
          .from('subcategories')
          .insert(subcategoryArray);
          
        if (error) {
          console.error("Error inserting subcategories:", error);
          throw error;
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
  
  async saveCoupons(coupons: any[]) {
    console.log('Attempting to save coupons to Supabase:', coupons.length);
    const client = getSupabaseClient();
    if (!client) {
      console.error("Database connection not configured for saveCoupons");
      throw new Error('Database connection not configured');
    }
    
    try {
      // Ensure all coupons have valid UUIDs
      const couponsWithUUIDs = coupons.map(coupon => {
        if (!coupon.id || coupon.id === 'placeholder') {
          return { ...coupon, id: crypto.randomUUID() };
        }
        return coupon;
      });
      
      console.log("Deleting existing coupons...");
      // Delete existing records - FIX: Use a simpler approach
      const { error: deleteError } = await client
        .from('coupons')
        .delete()
        .neq('id', 'placeholder-id-that-doesnt-exist');  // This will match all records
        
      if (deleteError) {
        console.error("Error deleting coupons:", deleteError);
        throw deleteError;
      }
      
      if (couponsWithUUIDs.length > 0) {
        console.log("Inserting coupons into Supabase...");
        const { error } = await client
          .from('coupons')
          .insert(couponsWithUUIDs);
          
        if (error) {
          console.error("Error inserting coupons:", error);
          throw error;
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
