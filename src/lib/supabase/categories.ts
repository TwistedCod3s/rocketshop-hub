import { getSupabaseClient } from './client';

export const categoryHelpers = {
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
        // Use the correct column name based on your schema
        const categorySlug = item.category_slug || item.category || '';
        const imageUrl = item.image_url || item.imageUrl || '';
        
        if (categorySlug) {
          categoryImages[categorySlug] = imageUrl;
        }
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

      // First check if the table has id column required
      let needsId = false;
      try {
        const { data: tableInfo, error: tableError } = await client
          .from('category_images')
          .select('id')
          .limit(1);

        needsId = !tableError;
      } catch (e) {
        console.log("Couldn't determine if id column is needed, will include it");
        needsId = true;
      }

      // Convert the single object to an array of objects
      const categoryImagesArray = Object.entries(categoryImages).map(([category_slug, image_url]) => {
        const entry: any = {
          category_slug,
          image_url
        };
        
        // Add ID if needed
        if (needsId) {
          entry.id = crypto.randomUUID();
        }
        
        return entry;
      });

      // Use update if conflict since these might already exist
      const { data, error } = await client
        .from('category_images')
        .upsert(categoryImagesArray, {
          onConflict: 'category_slug'
        });

      if (error) {
        console.error("Error saving category images:", error);
        return false;
      }

      console.log("Saved category images to database");
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
        // Try different possible column names
        const categorySlug = item.category_slug || item.category || '';
        const subcategoryList = item.subcategories || item.subcategory_list || [];
        
        if (categorySlug) {
          subcategories[categorySlug] = subcategoryList;
        }
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

      // Determine the correct column names by testing the table structure
      let categorySlugField = 'category_slug';
      let subcategoriesField = 'subcategories';
      
      try {
        // Try to get one record to see the column structure
        const { data: sampleData, error: sampleError } = await client
          .from('subcategories')
          .select('*')
          .limit(1);
        
        if (sampleError && sampleError.message.includes("category_slug")) {
          categorySlugField = 'category'; // Fallback column name
        }
        
        if (sampleError && sampleError.message.includes("subcategories")) {
          subcategoriesField = 'subcategory_list'; // Fallback column name
        }
      } catch (e) {
        console.log("Error checking subcategories table structure:", e);
        // Keep the default column names
      }

      // Check if the table has id column
      let needsId = false;
      try {
        const { data: tableInfo, error: tableError } = await client
          .from('subcategories')
          .select('id')
          .limit(1);

        needsId = !tableError;
      } catch (e) {
        console.log("Couldn't determine if id column is needed, will include it");
        needsId = true;
      }

      // Convert the single object to an array of objects
      const subcategoriesArray = Object.entries(subcategories).map(([category, subcategoryList]) => {
        const entry: any = {};
        entry[categorySlugField] = category;
        entry[subcategoriesField] = subcategoryList;
        
        // Add ID if needed
        if (needsId) {
          entry.id = crypto.randomUUID();
        }
        
        return entry;
      });

      const { data, error } = await client
        .from('subcategories')
        .upsert(subcategoriesArray, {
          onConflict: categorySlugField
        });

      if (error) {
        console.error("Error saving subcategories:", error);
        return false;
      }

      console.log("Saved subcategories to database");
      return true;
    } catch (e) {
      console.error("Error in saveSubcategories:", e);
      return false;
    }
  },
};
