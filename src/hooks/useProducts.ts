
import { useState, useCallback, useEffect } from "react";
import { Product } from "@/types/shop";
import { initialProducts } from "@/data/initialProducts";

// Use a consistent storage key that won't change between deployments
const PRODUCTS_STORAGE_KEY = "rocketry-shop-products";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  
  // Load initial data
  useEffect(() => {
    // Try to load products from localStorage
    const savedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (savedProducts) {
      try {
        const parsedProducts = JSON.parse(savedProducts);
        setProducts(parsedProducts);
        console.log("Loaded products from localStorage:", parsedProducts.length);
      } catch (error) {
        console.error("Error parsing saved products:", error);
        // Fall back to initial products if there's a parsing error
        setProducts(initialProducts);
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(initialProducts));
      }
    } else {
      // Use initial products data if nothing in localStorage
      console.log("No saved products found, using initial data");
      setProducts(initialProducts);
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(initialProducts));
    }
  }, []);
  
  // Update localStorage when products change
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
      console.log("Saved products to localStorage:", products.length);
    }
  }, [products]);

  // Product Management Functions
  const addProduct = useCallback((product: Product) => {
    setProducts(prev => [...prev, product]);
  }, []);
  
  const updateProduct = useCallback((product: Product) => {
    setProducts(prev => 
      prev.map(p => p.id === product.id ? product : p)
    );
  }, []);
  
  const removeProduct = useCallback((productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  }, []);
  
  const getProduct = useCallback((productId: string) => {
    return products.find(p => p.id === productId);
  }, [products]);
  
  const fetchAllProducts = useCallback((): Product[] => {
    return products;
  }, [products]);
  
  const fetchProductsByCategory = useCallback((category: string): Product[] => {
    console.log(`Filtering products by category: ${category}`);
    console.log("Available products:", products);
    
    // Return all products if no category is provided
    if (!category) {
      console.log("No category provided, returning all products");
      return products;
    }
    
    // Case-insensitive comparison for more reliable filtering
    const filteredProducts = products.filter(p => 
      p.category && p.category.toLowerCase() === category.toLowerCase()
    );
    
    console.log("Filtered products result:", filteredProducts);
    return filteredProducts;
  }, [products]);
  
  const getRelatedProducts = useCallback((category: string, excludeProductId: string) => {
    return products
      .filter(p => p.category === category && p.id !== excludeProductId)
      .slice(0, 4); // Limit to 4 related products
  }, [products]);
  
  const updateFeaturedProducts = useCallback((productId: string, isFeatured: boolean) => {
    setProducts(prev => 
      prev.map(p => p.id === productId ? { ...p, featured: isFeatured } : p)
    );
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
