
import { Product, Coupon } from '@/types/shop';

/**
 * Utility functions to handle schema differences between the app and database
 */

/**
 * Converts a product from the application schema to the database schema
 * This ensures we only send fields that exist in the database
 */
export const convertProductToDbSchema = (product: Product): Record<string, any> => {
  // Get all keys from the product
  const productKeys = Object.keys(product);
  
  // Create a new object with only the fields that we know exist in the database
  const dbProduct: Record<string, any> = {};
  
  // Always include the id
  dbProduct.id = product.id;
  
  // Safe fields that we know exist in the database
  const safeFields = [
    'name', 'description', 'price', 'category', 'images', 
    'inStock', 'featured', 'rating', 'reviews'
  ];
  
  // Copy only safe fields
  safeFields.forEach(field => {
    if (productKeys.includes(field) && product[field as keyof Product] !== undefined) {
      dbProduct[field] = product[field as keyof Product];
    }
  });
  
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
