
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { globalCache } from '@/utils/cacheUtils';

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
    
    // Use the same createClient options to avoid multiple client warnings
    supabaseClientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        storageKey: 'rocketry-supabase-auth'
      }
    });
    
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

// Helper to ensure valid UUID
const ensureValidUUID = (id: string | number): string => {
  // Check if already a valid UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  if (typeof id === 'string' && uuidRegex.test(id)) {
    return id;
  }
  
  // For numeric IDs or invalid format, generate a new UUID
  console.log(`Converting non-UUID ID "${id}" to valid UUID`);
  return uuidv4();
};

// Cache TTL constants (in milliseconds)
const CACHE_TTL = {
  PRODUCTS: 15 * 60 * 1000, // 15 minutes for products
  CATEGORY_IMAGES: 30 * 60 * 1000, // 30 minutes for category images 
  SUBCATEGORIES: 30 * 60 * 1000, // 30 minutes for subcategories
  COUPONS: 30 * 60 * 1000, // 30 minutes for coupons
  TIMESTAMPS: 2 * 60 * 1000 // 2 minutes for timestamps
};

// Database helper functions
export const dbHelpers = {
  getProducts: async () => {
    try {
      // Check cache first
      const cacheKey = 'products';
      const cachedProducts = globalCache.get(cacheKey);
      
      if (cachedProducts) {
        console.log("Using cached products data");
        return cachedProducts;
      }
      
      const client = getSupabaseClient();
      if (!client) return [];

      console.log("Fetching products from Supabase (not cached)");
      const { data, error } = await client
        .from('products')
        .select('*');

      if (error) {
        console.error("Error fetching products:", error);
        return [];
      }

      // Cache the result
      globalCache.set(cacheKey, data || [], CACHE_TTL.PRODUCTS);
      console.log(`Cached ${data?.length || 0} products for ${CACHE_TTL.PRODUCTS/1000/60} minutes`);
      
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

      // Fix product IDs to ensure they are valid UUIDs
      const cleanedProducts = products.map(product => {
        // Create a cleaned product object with only fields that exist in the database
        const cleanProduct: any = {
          name: product.name || '',
          description: product.description || '',
          price: product.price || 0,
          category: product.category || null,
          subcategory: product.subcategory || null,
          images: product.images || [],
          inStock: !!product.inStock,
          featured: !!product.featured,
        };
        
        // Ensure ID is a valid UUID
        cleanProduct.id = ensureValidUUID(product.id);
        
        // Add optional fields only if they exist
        if (product.rating !== undefined) cleanProduct.rating = product.rating;
        if (product.reviews) cleanProduct.reviews = product.reviews;
        if (product.specifications) cleanProduct.specifications = product.specifications;
        if (product.fullDescription) cleanProduct.fullDescription = product.fullDescription;
        
        return cleanProduct;
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

      // Invalidate the products cache
      globalCache.delete('products');
      console.log("Saved products to database and invalidated cache");
      
      return true;
    } catch (e) {
      console.error("Error in saveProducts:", e);
      return false;
    }
  },

  getCategoryImages: async () => {
    try {
      // Check cache first
      const cacheKey = 'category_images';
      const cachedImages = globalCache.get(cacheKey);
      
      if (cachedImages) {
        console.log("Using cached category images data");
        return cachedImages;
      }
      
      const client = getSupabaseClient();
      if (!client) return {};

      console.log("Fetching category images from database...");
      const { data, error } = await client
        .from('category_images')
        .select('*');

      if (error) {
        console.error("Error fetching category images:", error);
        return {};
      }

      // Convert the array of objects to a single object
      const categoryImages: Record<string, string> = {};
      if (data && Array.isArray(data)) {
        data.forEach((item: any) => {
          // Check all possible column names
          const categorySlug = item.category_slug || item.slug || item.category || '';
          const imageUrl = item.image_url || item.url || item.image || '';
          
          if (categorySlug) {
            categoryImages[categorySlug] = imageUrl;
          }
        });
        console.log("Successfully loaded category images from DB:", Object.keys(categoryImages).length);
        
        // Cache the result
        globalCache.set(cacheKey, categoryImages, CACHE_TTL.CATEGORY_IMAGES);
      } else {
        console.log("No category images data returned from DB or invalid format");
      }

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
      
      // First, delete all existing records
      console.log("Clearing existing category_images table...");
      const { error: deleteError } = await client
        .from('category_images')
        .delete()
        .gte('id', '0'); // Delete all rows
      
      if (deleteError) {
        console.error("Error clearing category images table:", deleteError);
        console.log("Continuing with insert despite delete error");
      } else {
        console.log("Successfully cleared category_images table");
      }
      
      // Convert the single object to an array of objects with the correct column names
      const categoryImagesArray = Object.entries(categoryImages).map(([category_slug, image_url]) => {
        return {
          id: uuidv4(), // Always generate a new UUID
          category_slug,
          image_url
        };
      });

      // Insert all records
      const { error: insertError } = await client
        .from('category_images')
        .insert(categoryImagesArray);

      if (insertError) {
        console.error("Error inserting category images:", insertError);
        return false;
      }

      // Invalidate the cache
      globalCache.delete('category_images');
      console.log("Successfully saved category images to database and invalidated cache");
      
      return true;
    } catch (e) {
      console.error("Error in saveCategoryImages:", e);
      return false;
    }
  },

  getSubcategories: async () => {
    try {
      // Check cache first
      const cacheKey = 'subcategories';
      const cachedSubcategories = globalCache.get(cacheKey);
      
      if (cachedSubcategories) {
        console.log("Using cached subcategories data");
        return cachedSubcategories;
      }
      
      const client = getSupabaseClient();
      if (!client) return {};

      console.log("Fetching subcategories from database...");
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
        const categorySlug = item.category || '';
        const subcategoryList = item.subcategory_list || [];
        
        if (categorySlug) {
          subcategories[categorySlug] = subcategoryList;
        }
      });
      
      // Cache the result
      globalCache.set(cacheKey, subcategories, CACHE_TTL.SUBCATEGORIES);
      console.log(`Cached subcategories for ${CACHE_TTL.SUBCATEGORIES/1000/60} minutes`);

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

      // Convert the single object to an array of objects with the correct column names
      const subcategoriesArray = Object.entries(subcategories).map(([category, subcategoryList]) => ({
        id: uuidv4(), // Always generate a new UUID for consistency
        category, // Using 'category' instead of 'category_slug'
        subcategory_list: subcategoryList // Using 'subcategory_list' instead of 'subcategories'
      }));

      const { data, error } = await client
        .from('subcategories')
        .upsert(subcategoriesArray, {
          onConflict: 'category'
        });

      if (error) {
        console.error("Error saving subcategories:", error);
        return false;
      }

      // Invalidate the cache
      globalCache.delete('subcategories');
      console.log("Saved subcategories to database and invalidated cache");
      
      return true;
    } catch (e) {
      console.error("Error in saveSubcategories:", e);
      return false;
    }
  },

  getCoupons: async () => {
    try {
      // Check cache first
      const cacheKey = 'coupons';
      const cachedCoupons = globalCache.get(cacheKey);
      
      if (cachedCoupons) {
        console.log("Using cached coupons data");
        return cachedCoupons;
      }
      
      const client = getSupabaseClient();
      if (!client) return [];

      console.log("Fetching coupons from database...");
      const { data, error } = await client
        .from('coupons')
        .select('*');

      if (error) {
        console.error("Error fetching coupons:", error);
        return [];
      }

      // Convert database format to app format
      const coupons = data.map((coupon: any) => ({
        id: coupon.id,
        code: coupon.code,
        discount: coupon.discount,
        discountPercentage: coupon.discount_percentage, // Map from database format
        expiryDate: coupon.expiry_date, // Map from database format
        active: coupon.active,
        description: coupon.description
      }));
      
      // Cache the result
      globalCache.set(cacheKey, coupons || [], CACHE_TTL.COUPONS);
      console.log(`Cached ${coupons.length} coupons for ${CACHE_TTL.COUPONS/1000/60} minutes`);

      return coupons || [];
    } catch (e) {
      console.error("Error in getCoupons:", e);
      return [];
    }
  },

  saveCoupons: async (coupons: any[]) => {
    try {
      const client = getSupabaseClient();
      if (!client) return false;

      // Convert app format to database format
      const formattedCoupons = coupons.map(coupon => ({
        id: ensureValidUUID(coupon.id),
        code: coupon.code,
        discount: coupon.discount,
        discount_percentage: coupon.discountPercentage, // Use database column format
        expiry_date: coupon.expiryDate, // Use database column format
        active: coupon.active,
        description: coupon.description,
      }));

      const { data, error } = await client
        .from('coupons')
        .upsert(formattedCoupons, {
          onConflict: 'id'
        });

      if (error) {
        console.error("Error saving coupons:", error);
        return false;
      }

      // Invalidate the cache
      globalCache.delete('coupons');
      console.log("Saved coupons to database and invalidated cache");
      
      return true;
    } catch (e) {
      console.error("Error in saveCoupons:", e);
      return false;
    }
  },

  getLatestUpdateTimestamp: async (): Promise<string | null> => {
    try {
      // Check cache first
      const cacheKey = 'latest_timestamp';
      const cachedTimestamp = globalCache.get<string>(cacheKey);
      
      if (cachedTimestamp) {
        console.log("Using cached timestamp:", cachedTimestamp);
        return cachedTimestamp;
      }
      
      const client = getSupabaseClient();
      if (!client) return null;
      
      console.log("Fetching latest timestamp from database...");
      
      // Try to get the latest updated product using created_at or updated_at 
      try {
        const { data, error } = await client
          .from('products')
          .select('created_at')
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (!error && data && data.length > 0) {
          const timestamp = data[0].created_at || null;
          
          // Cache the timestamp
          if (timestamp) {
            globalCache.set(cacheKey, timestamp, CACHE_TTL.TIMESTAMPS);
            console.log(`Cached timestamp for ${CACHE_TTL.TIMESTAMPS/1000/60} minutes:`, timestamp);
          }
          
          return timestamp;
        }
      } catch (e) {
        console.log("Error getting timestamp from created_at:", e);
      }
      
      return null;
    } catch (e) {
      console.error("Error in getLatestUpdateTimestamp:", e);
      return null;
    }
  },
};
