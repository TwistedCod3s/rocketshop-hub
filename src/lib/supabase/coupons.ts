
import { getSupabaseClient } from './client';

export const couponHelpers = {
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
};
