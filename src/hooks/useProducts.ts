
import { useState, useCallback, useEffect } from "react";
import { Product } from "@/types/shop";
import { initialProducts } from "@/data/initialProducts";
import { dbHelpers } from "@/lib/supabase";
import { convertProductToDbSchema } from "@/utils/schemaUtils";

// Define consistent storage key
const PRODUCTS_STORAGE_KEY = "ROCKETRY_SHOP_PRODUCTS_V7"; // Bumped version
const PRODUCTS_EVENT = "rocketry-product-update-v7"; // Bumped version

// Create a global variable for products that all users will share
// Default to initialProducts but will be overwritten by localStorage/Supabase if available
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
  
  // Function to load products from Supabase
  const loadProductsFromSupabase = useCallback(async () => {
    try {
      console.log("Attempting to load products from Supabase...");
      const supabaseProducts = await dbHelpers.getProducts();
      
      if (supabaseProducts && supabaseProducts.length > 0) {
        console.log("Successfully loaded products from Supabase:", supabaseProducts.length);
        
        // Update localStorage and global state
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(supabaseProducts));
        globalProducts = supabaseProducts;
        setProducts([...globalProducts]);
        
        return true;
      } else {
        console.log("No products found in Supabase, keeping localStorage data");
        return false;
      }
    } catch (error) {
      console.error("Error loading products from Supabase:", error);
      return false;
    }
  }, []);
  
  // Listen for storage events from other tabs/windows and sync trigger events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Handle both our specific key and the sync trigger key
      if ((e.key === PRODUCTS_STORAGE_KEY || 
           e.key === "ROCKETRY_SHOP_SYNC_TRIGGER_V7" || 
           e.key === "EXTERNAL_SYNC_TRIGGER") && e.newValue) {
        try {
          console.log(`Storage event detected: ${e.key}`);
          
          // Always reload from localStorage to ensure we have the latest data
          reloadProductsFromStorage();
          
        } catch (error) {
          console.error("Error handling storage event:", error);
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

    // Listen for general sync events 
    const handleSyncEvent = () => {
      console.log("Global sync event detected, reloading products");
      reloadProductsFromStorage();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(PRODUCTS_EVENT, handleCustomEvent as EventListener);
    window.addEventListener("rocketry-sync-trigger-v7", handleSyncEvent);
    
    // Initial load from Supabase, then fall back to localStorage if needed
    loadProductsFromSupabase().then(success => {
      if (!success) {
        // If Supabase load failed, ensure we have the latest from localStorage
        reloadProductsFromStorage();
      }
    });
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(PRODUCTS_EVENT, handleCustomEvent as EventListener);
      window.removeEventListener("rocketry-sync-trigger-v7", handleSyncEvent);
    };
  }, [reloadProductsFromStorage, loadProductsFromSupabase]);
  
  // Sync to localStorage, Supabase, and broadcast changes with improved error handling
  const syncAndBroadcast = useCallback((updatedProducts: Product[]) => {
    try {
      // First make a deep copy to avoid reference issues
      const productsCopy = JSON.parse(JSON.stringify(updatedProducts));
      
      // Update localStorage
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(productsCopy));
      console.log("Saved products to localStorage:", productsCopy.length);
      
      // Dispatch custom event for same-window communication
      const event = new CustomEvent(PRODUCTS_EVENT, { detail: productsCopy });
      window.dispatchEvent(event);
      console.log("Broadcast products via custom event");
      
      // Update the sync trigger to notify other windows
      const syncKey = "ROCKETRY_SHOP_SYNC_TRIGGER_V7";
      const timestamp = new Date().toISOString();
      localStorage.setItem(syncKey, timestamp);
      
      // For cross-window notification - we need a special entry
      localStorage.setItem('EXTERNAL_SYNC_TRIGGER', timestamp);
      setTimeout(() => localStorage.removeItem('EXTERNAL_SYNC_TRIGGER'), 100);
      
      // Set dirty flag
      localStorage.setItem('ROCKETRY_SHOP_CHANGES_PENDING', 'true');
      
      // Convert products to database schema to ensure UUID validity before syncing
      const dbReadyProducts = productsCopy.map((product: Product) => convertProductToDbSchema(product));
      
      // Sync to Supabase
      dbHelpers.saveProducts(dbReadyProducts)
        .then(() => {
          console.log("Successfully synced products to Supabase");
          localStorage.setItem('ROCKETRY_SHOP_CHANGES_PENDING', 'false');
        })
        .catch(err => {
          console.error("Error syncing products to Supabase:", err);
        });
      
      // Manually trigger storage events 
      try {
        window.dispatchEvent(new StorageEvent('storage', {
          key: PRODUCTS_STORAGE_KEY,
          newValue: JSON.stringify(productsCopy),
          storageArea: localStorage
        }));
        
        window.dispatchEvent(new StorageEvent('storage', {
          key: syncKey,
          newValue: timestamp,
          storageArea: localStorage
        }));
        
        console.log("Manually triggered storage events");
      } catch (e) {
        console.error("Error triggering storage events:", e);
        
        // Real fallback - remove and re-add the item
        localStorage.removeItem(PRODUCTS_STORAGE_KEY);
        setTimeout(() => {
          localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(productsCopy));
          console.log("Used fallback storage sync mechanism");
        }, 10);
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
    reloadProductsFromStorage,
    loadProductsFromSupabase
  };
}
