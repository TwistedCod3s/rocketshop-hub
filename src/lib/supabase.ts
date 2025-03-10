
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Make sure URL format is correct - must start with https://
const isValidUrl = (url: string) => {
  try {
    return url.startsWith('https://') && new URL(url).hostname.length > 0;
  } catch (e) {
    return false;
  }
};

// Improved debugging for environment variables
console.log("Supabase connection info:", {
  url: supabaseUrl, 
  isValidUrl: isValidUrl(supabaseUrl),
  hasKey: !!supabaseAnonKey,
  keyLength: supabaseAnonKey?.length
});

if (supabaseAnonKey) {
  console.log("Anon key preview:", supabaseAnonKey.substring(0, 4) + "..." + supabaseAnonKey.substring(supabaseAnonKey.length - 4));
}

export const getSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase credentials missing:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey
    });
    return null;
  }
  
  if (!isValidUrl(supabaseUrl)) {
    console.error('Invalid Supabase URL format:', supabaseUrl);
    console.error('URL must start with https:// and be a valid URL');
    return null;
  }
  
  try {
    console.log("Creating Supabase client with:", {
      url: supabaseUrl,
      keyLength: supabaseAnonKey.length
    });
    
    const client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false, // Don't persist auth state in localStorage
        autoRefreshToken: true
      }
    });
    
    console.log("Supabase client created successfully");
    return client;
  } catch (error) {
    console.error("Error creating Supabase client:", error);
    return null;
  }
};

// Create the client but handle the case where credentials are missing
export const supabase = getSupabaseClient();

// Helper functions for database operations that handle null client case
export const dbHelpers = {
  // Products
  async getProducts() {
    console.log("Attempting to fetch products from Supabase");
    const client = getSupabaseClient();
    if (!client) {
      console.error("Database connection not configured for getProducts");
      throw new Error('Database connection not configured');
    }
    
    try {
      const { data, error } = await client.from('products').select('*');
      if (error) {
        console.error("Error fetching products from Supabase:", error);
        throw error;
      }
      
      console.log(`Successfully fetched ${data?.length || 0} products from Supabase`);
      return data || [];
    } catch (err) {
      console.error("Exception in getProducts:", err);
      throw err;
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
      // First delete all existing products
      console.log("Deleting existing products...");
      const { error: deleteError } = await client
        .from('products')
        .delete()
        .neq('id', 'dummy'); // Using neq with dummy to match all rows
        
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
      // Delete existing records
      const { error: deleteError } = await client
        .from('category_images')
        .delete()
        .neq('id', 'dummy');
        
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
      // Delete existing records
      const { error: deleteError } = await client
        .from('subcategories')
        .delete()
        .neq('id', 'dummy');
        
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
      // Delete existing records
      const { error: deleteError } = await client
        .from('coupons')
        .delete()
        .neq('id', 'dummy');
        
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
