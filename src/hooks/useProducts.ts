
import { useState, useCallback, useEffect } from "react";
import { Product } from "@/types/shop";
import { initialProducts } from "@/data/initialProducts";

// Define consistent storage key
const PRODUCTS_STORAGE_KEY = "ROCKETRY_SHOP_PRODUCTS_V3";

// Create a global variable for products that all users will share
// Default to initialProducts but will be overwritten by localStorage if available
let globalProducts: Product[] = [...initialProducts];

// Use a simple pub/sub mechanism to sync changes across tabs/users
const eventBusName = "rocketry-product-update";

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
  
  // Listen for storage events from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === PRODUCTS_STORAGE_KEY) {
        try {
          const updatedProducts = JSON.parse(e.newValue);
          globalProducts = updatedProducts;
          setProducts([...globalProducts]);
          console.log("Products updated from another tab/window");
        } catch (error) {
          console.error("Error parsing products from storage event:", error);
        }
      }
    };

    // Listen for custom events from the same window
    const handleCustomEvent = (e: CustomEvent) => {
      globalProducts = e.detail;
      setProducts([...globalProducts]);
      console.log("Products updated via custom event");
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(eventBusName, handleCustomEvent as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(eventBusName, handleCustomEvent as EventListener);
    };
  }, []);
  
  // Sync to localStorage and broadcast changes
  const syncAndBroadcast = useCallback((updatedProducts: Product[]) => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updatedProducts));
      
      // Dispatch custom event for same-window communication
      const event = new CustomEvent(eventBusName, { detail: updatedProducts });
      window.dispatchEvent(event);
      
      console.log("Saved and broadcast products:", updatedProducts.length);
    } catch (error) {
      console.error("Error saving products to localStorage:", error);
    }
  }, []);
  
  // Product Management Functions
  const addProduct = useCallback((product: Product) => {
    const updatedProducts = [...globalProducts, product];
    globalProducts = updatedProducts;
    setProducts([...globalProducts]);
    syncAndBroadcast(updatedProducts);
    console.log("Added product to global store:", product.name);
  }, [syncAndBroadcast]);
  
  const updateProduct = useCallback((product: Product) => {
    const updatedProducts = globalProducts.map(p => p.id === product.id ? product : p);
    globalProducts = updatedProducts;
    setProducts([...globalProducts]);
    syncAndBroadcast(updatedProducts);
    console.log("Updated product in global store:", product.name);
  }, [syncAndBroadcast]);
  
  const removeProduct = useCallback((productId: string) => {
    const updatedProducts = globalProducts.filter(p => p.id !== productId);
    globalProducts = updatedProducts;
    setProducts([...globalProducts]);
    syncAndBroadcast(updatedProducts);
    console.log("Removed product from global store:", productId);
  }, [syncAndBroadcast]);
  
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
    const updatedProducts = globalProducts.map(p => 
      p.id === productId ? { ...p, featured: isFeatured } : p
    );
    globalProducts = updatedProducts;
    setProducts([...globalProducts]);
    syncAndBroadcast(updatedProducts);
    console.log(`${isFeatured ? "Added" : "Removed"} product ${productId} ${isFeatured ? "to" : "from"} featured`);
  }, [syncAndBroadcast]);

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
