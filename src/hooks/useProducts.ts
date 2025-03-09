
import { useState, useCallback, useEffect } from "react";
import { Product } from "@/types/shop";
import { initialProducts } from "@/data/initialProducts";

// Define consistent storage key
const PRODUCTS_STORAGE_KEY = "ROCKETRY_SHOP_PRODUCTS_V2";

// Create a global variable for products that all users will share
// Default to initialProducts but will be overwritten by localStorage if available
let globalProducts: Product[] = [...initialProducts];

// Try to load saved products from localStorage on initial module load
try {
  if (typeof window !== 'undefined') {
    const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (storedProducts) {
      console.log("Initializing global products from localStorage");
      globalProducts = JSON.parse(storedProducts);
    } else {
      // If no products in localStorage, initialize with default and save
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(globalProducts));
      console.log("Initialized localStorage with default products");
    }
  }
} catch (error) {
  console.error("Error loading products from localStorage:", error);
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([...globalProducts]);
  
  // Sync to localStorage whenever globalProducts changes
  const syncToLocalStorage = useCallback(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(globalProducts));
      console.log("Saved products to localStorage:", globalProducts.length);
    } catch (error) {
      console.error("Error saving products to localStorage:", error);
    }
  }, []);
  
  // Product Management Functions
  const addProduct = useCallback((product: Product) => {
    globalProducts = [...globalProducts, product];
    setProducts([...globalProducts]);
    syncToLocalStorage();
    console.log("Added product to global store:", product.name);
  }, [syncToLocalStorage]);
  
  const updateProduct = useCallback((product: Product) => {
    globalProducts = globalProducts.map(p => p.id === product.id ? product : p);
    setProducts([...globalProducts]);
    syncToLocalStorage();
    console.log("Updated product in global store:", product.name);
  }, [syncToLocalStorage]);
  
  const removeProduct = useCallback((productId: string) => {
    globalProducts = globalProducts.filter(p => p.id !== productId);
    setProducts([...globalProducts]);
    syncToLocalStorage();
    console.log("Removed product from global store:", productId);
  }, [syncToLocalStorage]);
  
  const getProduct = useCallback((productId: string) => {
    return products.find(p => p.id === productId);
  }, [products]);
  
  const fetchAllProducts = useCallback((): Product[] => {
    return products;
  }, [products]);
  
  const fetchProductsByCategory = useCallback((category: string): Product[] => {
    console.log(`Filtering products by category: ${category}`);
    
    // Return all products if no category is provided
    if (!category) {
      console.log("No category provided, returning all products");
      return products;
    }
    
    // Case-insensitive comparison for more reliable filtering
    const filteredProducts = products.filter(p => 
      p.category && p.category.toLowerCase() === category.toLowerCase()
    );
    
    console.log("Filtered products result:", filteredProducts.length);
    return filteredProducts;
  }, [products]);
  
  const getRelatedProducts = useCallback((category: string, excludeProductId: string) => {
    return products
      .filter(p => p.category === category && p.id !== excludeProductId)
      .slice(0, 4); // Limit to 4 related products
  }, [products]);
  
  const updateFeaturedProducts = useCallback((productId: string, isFeatured: boolean) => {
    globalProducts = globalProducts.map(p => p.id === productId ? { ...p, featured: isFeatured } : p);
    setProducts([...globalProducts]);
    syncToLocalStorage();
    console.log(`${isFeatured ? "Added" : "Removed"} product ${productId} ${isFeatured ? "to" : "from"} featured`);
  }, [syncToLocalStorage]);

  return {
    products,
    addProduct,
    updateProduct,
    removeProduct,
    getProduct,
    fetchAllProducts,
    fetchProductsByCategory,
    getRelatedProducts,
    updateFeaturedProducts
  };
}
