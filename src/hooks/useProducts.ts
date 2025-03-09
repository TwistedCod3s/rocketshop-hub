import { useState, useCallback, useEffect } from "react";
import { Product } from "@/types/shop";
import { initialProducts } from "@/data/initialProducts";

// Define a global variable to store products in memory for all users
// This will persist during the lifecycle of the application
let globalProducts: Product[] = [];

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  
  // Load initial data
  useEffect(() => {
    // If we already have products in the global store, use those
    if (globalProducts.length > 0) {
      console.log("Using products from global store:", globalProducts.length);
      setProducts(globalProducts);
    } else {
      // Otherwise, initialize with default products
      console.log("Initializing products with default data");
      setProducts(initialProducts);
      globalProducts = [...initialProducts];
    }
  }, []);
  
  // Product Management Functions
  const addProduct = useCallback((product: Product) => {
    setProducts(prev => {
      const updated = [...prev, product];
      // Update the global store
      globalProducts = [...updated];
      console.log("Added product to global store:", product.name);
      return updated;
    });
  }, []);
  
  const updateProduct = useCallback((product: Product) => {
    setProducts(prev => {
      const updated = prev.map(p => p.id === product.id ? product : p);
      // Update the global store
      globalProducts = [...updated];
      console.log("Updated product in global store:", product.name);
      return updated;
    });
  }, []);
  
  const removeProduct = useCallback((productId: string) => {
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== productId);
      // Update the global store
      globalProducts = [...updated];
      console.log("Removed product from global store:", productId);
      return updated;
    });
  }, []);
  
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
    setProducts(prev => {
      const updated = prev.map(p => p.id === productId ? { ...p, featured: isFeatured } : p);
      // Update the global store
      globalProducts = [...updated];
      console.log(`${isFeatured ? "Added" : "Removed"} product ${productId} ${isFeatured ? "to" : "from"} featured`);
      return updated;
    });
  }, []);

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
