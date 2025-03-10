
import { Product, Coupon } from '@/types/shop';
import { v4 as uuidv4 } from 'uuid';

/**
 * Utility functions to handle schema differences between the app and database
 */

/**
 * Checks if a string is a valid UUID
 */
const isValidUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

/**
 * Converts a product from the application schema to the database schema
 * This ensures we only send fields that exist in the database
 */
export const convertProductToDbSchema = (product: Product): Record<string, any> => {
  // Get all keys from the product
  const productKeys = Object.keys(product);
  
  // Create a new object with only the fields that we know exist in the database
  const dbProduct: Record<string, any> = {};
  
  // Handle ID - ensure it's a valid UUID
  if (!product.id) {
    // Generate a new UUID if id is missing
    dbProduct.id = uuidv4();
    console.log(`Generated UUID for product without ID: ${dbProduct.id}`);
  } else if (typeof product.id === 'number' || (typeof product.id === 'string' && /^\d+$/.test(product.id)) || !isValidUUID(String(product.id))) {
    // For numeric or invalid IDs, generate a UUID replacement
    const isNumeric = typeof product.id === 'number' || /^\d+$/.test(String(product.id));
    const originalId = String(product.id);
    dbProduct.id = uuidv4();
    console.log(`Converted ${isNumeric ? 'numeric' : 'invalid'} ID "${originalId}" to UUID: ${dbProduct.id}`);
  } else {
    dbProduct.id = product.id;
  }
  
  // Safe fields that we know exist in the database
  const safeFields = [
    'name', 'description', 'price', 'category', 'subcategory', 'images', 
    'inStock', 'featured', 'rating', 'reviews'
  ];
  
  // Copy only safe fields and ensure they have the correct types
  safeFields.forEach(field => {
    if (productKeys.includes(field) && product[field as keyof Product] !== undefined) {
      dbProduct[field] = product[field as keyof Product];
    }
  });
  
  // Ensure boolean fields are actually booleans
  if ('inStock' in dbProduct && typeof dbProduct.inStock !== 'boolean') {
    dbProduct.inStock = Boolean(dbProduct.inStock);
  }
  
  if ('featured' in dbProduct && typeof dbProduct.featured !== 'boolean') {
    dbProduct.featured = Boolean(dbProduct.featured);
  }
  
  // Handle special fields that might not exist in the database
  // For fullDescription, we'll store it in the description field if it doesn't exist in the DB
  if (product.fullDescription) {
    if (productKeys.includes('fullDescription')) {
      // Try to save it normally (this might fail if column doesn't exist)
      dbProduct.fullDescription = product.fullDescription;
    } else {
      // Append to the description as a fallback
      dbProduct.description = `${product.description || ''}\n\nFull Description: ${product.fullDescription}`;
    }
  }
  
  // Handle specifications field - convert to JSON string if needed
  if (product.specifications) {
    dbProduct.specifications = product.specifications;
  }
  
  // Don't use the last_updated field if it doesn't exist in the database
  // Comment this out since the column doesn't exist
  // dbProduct.last_updated = new Date().toISOString();
  
  return dbProduct;
};

/**
 * Converts products from the database schema to the application schema
 */
export const convertDbToProductSchema = (dbProduct: any): Product => {
  const product: Product = {
    id: dbProduct.id,
    name: dbProduct.name || '',
    description: dbProduct.description || '',
    price: dbProduct.price || 0,
  };
  
  // Copy other fields if they exist
  if (dbProduct.category) product.category = dbProduct.category;
  if (dbProduct.subcategory) product.subcategory = dbProduct.subcategory;
  if (dbProduct.images) product.images = dbProduct.images;
  if (dbProduct.inStock !== undefined) product.inStock = dbProduct.inStock;
  if (dbProduct.featured !== undefined) product.featured = dbProduct.featured;
  if (dbProduct.rating !== undefined) product.rating = dbProduct.rating;
  if (dbProduct.reviews) product.reviews = dbProduct.reviews;
  if (dbProduct.specifications) product.specifications = dbProduct.specifications;
  
  // Handle full description - extract from description if needed
  if (dbProduct.fullDescription) {
    product.fullDescription = dbProduct.fullDescription;
  } else if (dbProduct.description && dbProduct.description.includes('Full Description:')) {
    // Try to extract the full description from the description field
    const parts = dbProduct.description.split('Full Description:');
    if (parts.length > 1) {
      product.description = parts[0].trim();
      product.fullDescription = parts[1].trim();
    }
  }
  
  return product;
};

/**
 * Ensures that a coupon has a valid UUID ID
 */
export const ensureCouponHasValidUUID = (coupon: Coupon): Coupon => {
  if (!coupon.id || !isValidUUID(coupon.id)) {
    return {
      ...coupon,
      id: uuidv4()
    };
  }
  
  return coupon;
};

/**
 * Utility function to determine if data needs synchronization
 * by comparing timestamps
 */
export const needsSynchronization = (localTimestamp: string | null, remoteTimestamp: string | null): boolean => {
  if (!localTimestamp) return !!remoteTimestamp;
  if (!remoteTimestamp) return true;
  
  try {
    const localDate = new Date(localTimestamp);
    const remoteDate = new Date(remoteTimestamp);
    
    // Return true if remote data is newer
    return remoteDate > localDate;
  } catch (e) {
    console.error("Error comparing timestamps:", e);
    return true; // When in doubt, sync
  }
};

/**
 * Store the last sync timestamp
 */
export const updateSyncTimestamp = (): string => {
  const timestamp = new Date().toISOString();
  localStorage.setItem('ROCKETRY_LAST_SYNC_TIMESTAMP', timestamp);
  return timestamp;
};

/**
 * Get the last sync timestamp
 */
export const getLastSyncTimestamp = (): string | null => {
  return localStorage.getItem('ROCKETRY_LAST_SYNC_TIMESTAMP');
};
