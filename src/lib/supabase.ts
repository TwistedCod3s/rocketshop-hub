
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

      const { data, error } = await client
        .from('products')
        .upsert(products);

      if (error) {
        console.error("Error saving products:", error);
        return false;
      }

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
        categoryImages[item.category_slug] = item.image_url;
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

      // Convert the single object to an array of objects
      const categoryImagesArray = Object.entries(categoryImages).map(([category_slug, image_url]) => ({
        category_slug,
        image_url
      }));

      const { data, error } = await client
        .from('category_images')
        .upsert(categoryImagesArray);

      if (error) {
        console.error("Error saving category images:", error);
        return false;
      }

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
        subcategories[item.category_slug] = item.subcategories;
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

      // Convert the single object to an array of objects
      const subcategoriesArray = Object.entries(subcategories).map(([category_slug, subcategories]) => ({
        category_slug,
        subcategories
      }));

      const { data, error } = await client
        .from('subcategories')
        .upsert(subcategoriesArray);

      if (error) {
        console.error("Error saving subcategories:", error);
        return false;
      }

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

      const { data, error } = await client
        .from('coupons')
        .upsert(coupons);

      if (error) {
        console.error("Error saving coupons:", error);
        return false;
      }

      return true;
    } catch (e) {
      console.error("Error in saveCoupons:", e);
      return false;
    }
  },
    // Add this new function
  getLatestUpdateTimestamp: async (): Promise<string | null> => {
    try {
      const client = getSupabaseClient();
      if (!client) return null;
      
      // Try to get the latest updated product
      const { data, error } = await client
        .from('products')
        .select('last_updated')
        .order('last_updated', { ascending: false })
        .limit(1);
      
      if (error || !data || data.length === 0) {
        console.error("Error getting latest timestamp:", error);
        return null;
      }
      
      return data[0].last_updated || null;
    } catch (e) {
      console.error("Error in getLatestUpdateTimestamp:", e);
      return null;
    }
  },
};
