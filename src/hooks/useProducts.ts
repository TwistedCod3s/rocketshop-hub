
import { useState, useCallback, useEffect } from "react";
import { Product } from "@/types/shop";
import { initialProducts } from "@/data/initialProducts";

// Define consistent storage key
const PRODUCTS_STORAGE_KEY = "ROCKETRY_SHOP_PRODUCTS_V4"; // Bumped version

// Create a global variable for products that all users will share
// Default to initialProducts but will be overwritten by localStorage if available
let globalProducts: Product[] = [...initialProducts];

// Use a enhanced pub/sub mechanism to sync changes across tabs/users
const eventBusName = "rocketry-product-update-v2";

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
  
  // Function to forcibly reload products from localStorage
  const reloadProductsFromStorage = useCallback(() => {
    try {
      const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (storedProducts) {
        const parsedProducts = JSON.parse(storedProducts);
        globalProducts = parsedProducts;
        setProducts([...globalProducts]);
        console.log("Manually reloaded products from localStorage:", parsedProducts.length);
      }
    } catch (error) {
      console.error("Error reloading products from localStorage:", error);
    }
  }, []);
  
  // Listen for storage events from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === PRODUCTS_STORAGE_KEY && e.newValue) {
        try {
          console.log("Storage event detected for products");
          const updatedProducts = JSON.parse(e.newValue);
          globalProducts = updatedProducts;
          setProducts([...globalProducts]);
          console.log("Products updated from storage event:", updatedProducts.length);
        } catch (error) {
          console.error("Error parsing products from storage event:", error);
          // Attempt recovery by directly reading from localStorage
          reloadProductsFromStorage();
        }
      }
    };

    // Listen for custom events from the same window
    const handleCustomEvent = (e: CustomEvent<Product[]>) => {
      console.log("Custom event detected for products");
      if (e.detail) {
        globalProducts = e.detail;
        setProducts([...globalProducts]);
        console.log("Products updated via custom event:", e.detail.length);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(eventBusName, handleCustomEvent as EventListener);
    
    // Initial forced reload
    reloadProductsFromStorage();
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(eventBusName, handleCustomEvent as EventListener);
    };
  }, [reloadProductsFromStorage]);
  
  // Sync to localStorage and broadcast changes with improved error handling
  const syncAndBroadcast = useCallback((updatedProducts: Product[]) => {
    try {
      // First make a deep copy to avoid reference issues
      const productsCopy = JSON.parse(JSON.stringify(updatedProducts));
      
      // Update localStorage
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(productsCopy));
      console.log("Saved products to localStorage:", productsCopy.length);
      
      // Dispatch custom event for same-window communication
      const event = new CustomEvent(eventBusName, { detail: productsCopy });
      window.dispatchEvent(event);
      console.log("Broadcast products via custom event");
      
      // Manually trigger storage event for cross-window communication
      // in browsers that don't automatically trigger it
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new StorageEvent('storage', {
          key: PRODUCTS_STORAGE_KEY,
          newValue: JSON.stringify(productsCopy),
          storageArea: localStorage
        }));
        console.log("Manually triggered storage event");
      }
    } catch (error) {
      console.error("Error in syncAndBroadcast for products:", error);
    }
  }, []);
  
  // Product Management Functions with improved error handling
  const addProduct = useCallback((product: Product) => {
    try {
      const updatedProducts = [...globalProducts, product];
      globalProducts = updatedProducts;
      setProducts([...globalProducts]);
      syncAndBroadcast(updatedProducts);
      console.log("Added product to global store:", product.name);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  }, [syncAndBroadcast]);
  
  const updateProduct = useCallback((product: Product) => {
    try {
      const updatedProducts = globalProducts.map(p => p.id === product.id ? product : p);
      globalProducts = updatedProducts;
      setProducts([...globalProducts]);
      syncAndBroadcast(updatedProducts);
      console.log("Updated product in global store:", product.name);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  }, [syncAndBroadcast]);
  
  const removeProduct = useCallback((productId: string) => {
    try {
      const updatedProducts = globalProducts.filter(p => p.id !== productId);
      globalProducts = updatedProducts;
      setProducts([...globalProducts]);
      syncAndBroadcast(updatedProducts);
      console.log("Removed product from global store:", productId);
    } catch (error) {
      console.error("Error removing product:", error);
    }
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
    try {
      const updatedProducts = globalProducts.map(p => 
        p.id === productId ? { ...p, featured: isFeatured } : p
      );
      globalProducts = updatedProducts;
      setProducts([...globalProducts]);
      syncAndBroadcast(updatedProducts);
      console.log(`${isFeatured ? "Added" : "Removed"} product ${productId} ${isFeatured ? "to" : "from"} featured`);
    } catch (error) {
      console.error("Error updating featured status:", error);
    }
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
    updateFeaturedProducts,
    reloadProductsFromStorage
  };
}
