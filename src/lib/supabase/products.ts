
import { getSupabaseClient } from './client';

export const productHelpers = {
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
};
