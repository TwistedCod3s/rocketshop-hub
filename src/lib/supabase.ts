
import { createClient } from '@supabase/supabase-js';

// Environment variables would be set in your deployment platform
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a function to get the client that can be called when needed
export const getSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      'Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.'
    );
    return null;
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
};

// Create the client but handle the case where credentials are missing
export const supabase = getSupabaseClient();

// Helper functions for database operations that handle null client case
export const dbHelpers = {
  // Products
  async getProducts() {
    const client = getSupabaseClient();
    if (!client) throw new Error('Database connection not configured');
    
    const { data, error } = await client.from('products').select('*');
    if (error) throw error;
    return data || [];
  },
  
  async saveProducts(products: any[]) {
    const client = getSupabaseClient();
    if (!client) throw new Error('Database connection not configured');
    
    // First delete all products
    const { error: deleteError } = await client.from('products').delete().neq('id', 'placeholder');
    if (deleteError) throw deleteError;
    
    // Then insert new products
    if (products.length > 0) {
      const { error } = await client.from('products').insert(products);
      if (error) throw error;
    }
    return true;
  },
  
  // Category Images
  async getCategoryImages() {
    const client = getSupabaseClient();
    if (!client) throw new Error('Database connection not configured');
    
    const { data, error } = await client.from('category_images').select('*');
    if (error) throw error;
    
    // Convert array to object format
    const categoryImages: Record<string, string> = {};
    (data || []).forEach(item => {
      categoryImages[item.category_slug] = item.image_url;
    });
    
    return categoryImages;
  },
  
  async saveCategoryImages(categoryImages: Record<string, string>) {
    const client = getSupabaseClient();
    if (!client) throw new Error('Database connection not configured');
    
    // Convert object to array format for database
    const categoryImageArray = Object.entries(categoryImages).map(([category_slug, image_url]) => ({
      category_slug,
      image_url
    }));
    
    // Delete all existing category images
    const { error: deleteError } = await client.from('category_images').delete().neq('id', 'placeholder');
    if (deleteError) throw deleteError;
    
    // Insert new category images
    if (categoryImageArray.length > 0) {
      const { error } = await client.from('category_images').insert(categoryImageArray);
      if (error) throw error;
    }
    
    return true;
  },
  
  // Subcategories
  async getSubcategories() {
    const client = getSupabaseClient();
    if (!client) throw new Error('Database connection not configured');
    
    const { data, error } = await client.from('subcategories').select('*');
    if (error) throw error;
    
    // Convert array to object format
    const subcategories: Record<string, string[]> = {};
    (data || []).forEach(item => {
      subcategories[item.category] = item.subcategory_list;
    });
    
    return subcategories;
  },
  
  async saveSubcategories(subcategories: Record<string, string[]>) {
    const client = getSupabaseClient();
    if (!client) throw new Error('Database connection not configured');
    
    // Convert object to array format for database
    const subcategoryArray = Object.entries(subcategories).map(([category, subcategory_list]) => ({
      category,
      subcategory_list
    }));
    
    // Delete all existing subcategories
    const { error: deleteError } = await client.from('subcategories').delete().neq('id', 'placeholder');
    if (deleteError) throw deleteError;
    
    // Insert new subcategories
    if (subcategoryArray.length > 0) {
      const { error } = await client.from('subcategories').insert(subcategoryArray);
      if (error) throw error;
    }
    
    return true;
  },
  
  // Coupons
  async getCoupons() {
    const client = getSupabaseClient();
    if (!client) throw new Error('Database connection not configured');
    
    const { data, error } = await client.from('coupons').select('*');
    if (error) throw error;
    return data || [];
  },
  
  async saveCoupons(coupons: any[]) {
    const client = getSupabaseClient();
    if (!client) throw new Error('Database connection not configured');
    
    // Delete all existing coupons
    const { error: deleteError } = await client.from('coupons').delete().neq('id', 'placeholder');
    if (deleteError) throw deleteError;
    
    // Insert new coupons
    if (coupons.length > 0) {
      const { error } = await client.from('coupons').insert(coupons);
      if (error) throw error;
    }
    
    return true;
  }
};
