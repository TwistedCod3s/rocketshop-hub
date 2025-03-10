
import { getSupabaseClient, resetSupabaseClient } from './client';
import { productHelpers } from './products';
import { categoryHelpers } from './categories';
import { couponHelpers } from './coupons';

// Utility helpers
const utilityHelpers = {
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

// Combine all helpers into a single dbHelpers object
export const dbHelpers = {
  ...productHelpers,
  ...categoryHelpers,
  ...couponHelpers,
  ...utilityHelpers
};

// Export the client functions
export { getSupabaseClient, resetSupabaseClient };
