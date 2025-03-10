import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, Coupon } from '@/types/shop';

// Declare the global window property correctly
declare global {
  interface Window {
    // Fix the type declaration to match the existing one
    supabaseClientInstance: any;
  }
}

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          category: string | null
          description: string | null
          featured: boolean | null
          fullDescription: string | null
          images: string[] | null
          inStock: boolean | null
          name: string | null
          price: number | null
          rating: number | null
          reviews: number | null
          specifications: string[] | null
        }
        Insert: {
          id?: string
          category?: string | null
          description?: string | null
          featured?: boolean | null
          fullDescription?: string | null
          images?: string[] | null
          inStock?: boolean | null
          name?: string | null
          price?: number | null
          rating?: number | null
          reviews?: number | null
          specifications?: string[] | null
        }
        Update: {
          id?: string
          category?: string | null
          description?: string | null
          featured?: boolean | null
          fullDescription?: string | null
          images?: string[] | null
          inStock?: boolean | null
          name?: string | null
          price?: number | null
          rating?: number | null
          reviews?: number | null
          specifications?: string[] | null
        }
      }
      category_images: {
        Row: {
          id: string
          category_slug: string | null
          image_url: string | null
        }
        Insert: {
          id?: string
          category_slug?: string | null
          image_url?: string | null
        }
        Update: {
          id?: string
          category_slug?: string | null
          image_url?: string | null
        }
      }
      subcategories: {
        Row: {
          id: string
          category: string | null
          subcategory_list: string[] | null
        }
        Insert: {
          id?: string
          category?: string | null
          subcategory_list?: string[] | null
        }
        Update: {
          id?: string
          category?: string | null
          subcategory_list?: string[] | null
        }
      }
       coupons: {
        Row: {
          id: string
          code: string | null
          discount: number | null
          discountPercentage: number | null
          expiryDate: string | null
          active: boolean | null
          description: string | null
        }
        Insert: {
          id?: string
          code?: string | null
          discount?: number | null
          discountPercentage?: number | null
          expiryDate?: string | null
          active?: boolean | null
          description?: string | null
        }
        Update: {
          id?: string
          code?: string | null
          discount?: number | null
          discountPercentage?: number | null
          expiryDate?: string | null
          active?: boolean | null
          description?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Create and cache a Supabase client
export const getSupabaseClient = (): SupabaseClient<any, "public", any> | null => {
  try {
    // If we already have a cached client, return it
    if (window.supabaseClientInstance) {
      return window.supabaseClientInstance;
    }
    
    // Try to get the credentials from localStorage first
    let supabaseUrl = localStorage.getItem('ROCKETRY_DB_URL');
    let supabaseKey = localStorage.getItem('ROCKETRY_DB_KEY');
    
    // If not in localStorage, try environment variables
    if (!supabaseUrl || !supabaseKey) {
      supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    }
    
    // Validate credentials before creating client
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase credentials missing or invalid', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey
      });
      
      // In development mode, use a mock client for testing
      if (import.meta.env.DEV) {
        console.info('Creating mock Supabase client for development');
        // Create a fake client that returns empty data but doesn't error
        return createMockClient();
      }
      
      return null;
    }
    
    // Create and cache the client
    const client = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      global: {
        fetch: (...args) => {
          return fetch(...args);
        },
      },
    });
    
    window.supabaseClientInstance = client;
    return client;
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    return null;
  }
};

// Create a mock client for development
const createMockClient = () => {
  // This mock client implements the minimum interface needed
  const mockClient: Partial<SupabaseClient<any, "public", any>> = {
    from: (table: string) => {
      console.log(`Mock Supabase client: from('${table}')`);
      
      // Create a mock query builder
      const queryBuilder: any = {
        select: () => queryBuilder,
        insert: () => queryBuilder,
        upsert: () => queryBuilder,
        update: () => queryBuilder,
        delete: () => queryBuilder,
        eq: () => queryBuilder,
        neq: () => queryBuilder,
        gt: () => queryBuilder,
        lt: () => queryBuilder,
        gte: () => queryBuilder,
        lte: () => queryBuilder,
        is: () => queryBuilder,
        in: () => queryBuilder,
        contains: () => queryBuilder,
        limit: () => queryBuilder,
        order: () => queryBuilder,
        match: () => queryBuilder,
        single: () => queryBuilder,
        maybeSingle: () => queryBuilder,
        then: (callback: Function) => {
          callback({ data: [], error: null });
          return queryBuilder;
        },
      };
      
      // Add the async method to mimic the actual client
      queryBuilder.then = (resolve: Function) => {
        resolve({ data: [], error: null });
        return Promise.resolve({ data: [], error: null });
      };
      
      return queryBuilder;
    },
    auth: {
      signUp: () => Promise.resolve({ data: null, error: null }),
      signIn: () => Promise.resolve({ data: null, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    } as any,
  };
  
  return mockClient as SupabaseClient<any, "public", any>;
};

export const dbHelpers = {
  getProducts: async (): Promise<Product[]> => {
    const client = getSupabaseClient();
    if (!client) {
      throw new Error("Could not create Supabase client");
    }
    
    const { data, error } = await client
      .from('products')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
    
    return data || [];
  },
  saveProducts: async (products: Product[]): Promise<void> => {
    const client = getSupabaseClient();
    if (!client) {
      throw new Error("Could not create Supabase client");
    }
    
    const { error } = await client
      .from('products')
      .upsert(products, { onConflict: 'id' });
    
    if (error) {
      console.error("Error saving products:", error);
      throw error;
    }
  },
  getCategoryImages: async (): Promise<Record<string, string>> => {
    const client = getSupabaseClient();
    if (!client) {
      throw new Error("Could not create Supabase client");
    }
    
    const { data, error } = await client
      .from('category_images')
      .select('*');
    
    if (error) {
      console.error("Error fetching category images:", error);
      throw error;
    }
    
    const categoryImages: Record<string, string> = {};
    data?.forEach(item => {
      if (item.category_slug && item.image_url) {
        categoryImages[item.category_slug] = item.image_url;
      }
    });
    
    return categoryImages;
  },
  saveCategoryImages: async (categoryImages: Record<string, string>): Promise<void> => {
    const client = getSupabaseClient();
    if (!client) {
      throw new Error("Could not create Supabase client");
    }
    
    // Convert the categoryImages object into an array of objects
    const updates = Object.entries(categoryImages).map(([category_slug, image_url]) => ({
      category_slug,
      image_url,
    }));
    
    // Iterate through the updates and perform individual upserts
    for (const update of updates) {
      const { error } = await client
        .from('category_images')
        .upsert(update, { onConflict: 'category_slug' });
      
      if (error) {
        console.error(`Error saving category image for ${update.category_slug}:`, error);
        throw error;
      }
    }
  },
  getSubcategories: async (): Promise<Record<string, string[]>> => {
    const client = getSupabaseClient();
    if (!client) {
      throw new Error("Could not create Supabase client");
    }
    
    const { data, error } = await client
      .from('subcategories')
      .select('*');
    
    if (error) {
      console.error("Error fetching subcategories:", error);
      throw error;
    }
    
    const subcategories: Record<string, string[]> = {};
    data?.forEach(item => {
      if (item.category && item.subcategory_list) {
        subcategories[item.category] = item.subcategory_list;
      }
    });
    
    return subcategories;
  },
  saveSubcategories: async (subcategories: Record<string, string[]>): Promise<void> => {
    const client = getSupabaseClient();
    if (!client) {
      throw new Error("Could not create Supabase client");
    }
    
    // Convert the subcategories object into an array of objects
    const updates = Object.entries(subcategories).map(([category, subcategory_list]) => ({
      category,
      subcategory_list,
    }));
    
    // Iterate through the updates and perform individual upserts
    for (const update of updates) {
      const { error } = await client
        .from('subcategories')
        .upsert(update, { onConflict: 'category' });
      
      if (error) {
        console.error(`Error saving subcategories for ${update.category}:`, error);
        throw error;
      }
    }
  },
  getCoupons: async (): Promise<Coupon[]> => {
    const client = getSupabaseClient();
    if (!client) {
      throw new Error("Could not create Supabase client");
    }
    
    const { data, error } = await client
      .from('coupons')
      .select('*');
    
    if (error) {
      console.error("Error fetching coupons:", error);
      throw error;
    }
    
    return data || [];
  },
  saveCoupons: async (coupons: Coupon[]): Promise<void> => {
    const client = getSupabaseClient();
    if (!client) {
      throw new Error("Could not create Supabase client");
    }
    
    const { error } = await client
      .from('coupons')
      .upsert(coupons, { onConflict: 'id' });
    
    if (error) {
      console.error("Error saving coupons:", error);
      throw error;
    }
  },
};
