
import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useShopContext } from "@/context/ShopContext";
import { Product } from "@/types/shop";
import ProductFilters from "@/components/products/ProductFilters";
import SortOptions from "@/components/products/SortOptions";
import ProductGrid from "@/components/products/ProductGrid";
import { useProductFilter } from "@/hooks/useProductFilter";
import { useSyncChecker } from "@/hooks/useSyncChecker";

const ProductList = () => {
  const { 
    fetchAllProducts, 
    reloadProductsFromStorage, 
    loadProductsFromSupabase,
    reloadAllAdminData 
  } = useShopContext();
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use our sync checker hook to periodically check for updates
  // but only check for updates on mount, not continually
  useSyncChecker(reloadProductsFromStorage, loadProductsFromSupabase, reloadAllAdminData);
  
  // Load products and refresh only when necessary
  useEffect(() => {
    let isMounted = true;
    
    const loadProducts = async () => {
      if (!isMounted) return;
      setIsLoading(true);
      
      try {
        console.log("Starting to load products in ProductList...");
        
        // Use the products already loaded in context first
        const contextProducts = fetchAllProducts();
        if (contextProducts && contextProducts.length > 0) {
          console.log("Using products from context:", contextProducts.length);
          setDisplayProducts(contextProducts);
          setIsLoading(false);
          return;
        }
        
        // If no products in context, try loading from localStorage
        if (reloadProductsFromStorage) {
          reloadProductsFromStorage();
          const localProducts = fetchAllProducts();
          if (localProducts && localProducts.length > 0) {
            console.log("Using products from localStorage:", localProducts.length);
            setDisplayProducts(localProducts);
            setIsLoading(false);
            return;
          }
        }
        
        // Only if both context and localStorage fail, try loading from Supabase
        if (loadProductsFromSupabase) {
          console.log("Loading products from Supabase as a last resort");
          await loadProductsFromSupabase();
          
          if (isMounted) {
            const products = fetchAllProducts();
            setDisplayProducts(products);
          }
        }
      } catch (error) {
        console.error("Error loading products:", error);
        
        // Final fallback
        if (isMounted) {
          const products = fetchAllProducts();
          setDisplayProducts(products);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    // Initial load
    loadProducts();
    
    // Set up event listeners for product updates, but with debouncing
    let debounceTimer: NodeJS.Timeout | null = null;
    
    const debouncedProductRefresh = () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      
      debounceTimer = setTimeout(() => {
        console.log("Debounced product refresh executing");
        loadProducts();
        debounceTimer = null;
      }, 1000); // 1 second debounce
    };
    
    const handleProductUpdate = () => {
      console.log("Product update detected, debouncing refresh");
      debouncedProductRefresh();
    };
    
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === "ROCKETRY_SHOP_PRODUCTS_V7" || 
          e.key === "ROCKETRY_SHOP_SYNC_TRIGGER_V7" ||
          e.key === "ROCKETRY_SHOP_CHANGES_PENDING" ||
          e.key === "EXTERNAL_SYNC_TRIGGER" ||
          e.key === "ROCKETRY_LAST_SYNC_TIMESTAMP" ||
          e.key === "ROCKETRY_SYNC_NEEDED") {
        console.log(`Storage event detected for ${e.key}, debouncing products refresh`);
        debouncedProductRefresh();
      }
    };
    
    // Event listeners with reduced frequency
    window.addEventListener('rocketry-product-update-v7', handleProductUpdate);
    window.addEventListener('rocketry-sync-trigger-v7', handleProductUpdate);
    window.addEventListener('storage', handleStorageEvent);
    
    return () => {
      isMounted = false;
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      window.removeEventListener('rocketry-product-update-v7', handleProductUpdate);
      window.removeEventListener('rocketry-sync-trigger-v7', handleProductUpdate);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [fetchAllProducts, reloadProductsFromStorage, loadProductsFromSupabase]);
  
  // Use our custom hook for filtering
  const {
    filteredProducts,
    searchTerm,
    setSearchTerm,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    selectedCategories,
    handleCategoryChange
  } = useProductFilter(displayProducts);
  
  return (
    <MainLayout>
      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-rocketry-navy mb-2">
            All Products
          </h1>
          <p className="text-muted-foreground">
            Browse our complete collection of rocketry products.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Filters */}
          <ProductFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedCategories={selectedCategories}
            handleCategoryChange={handleCategoryChange}
            filterOpen={filterOpen}
            setFilterOpen={setFilterOpen}
          />
          
          {/* Product List */}
          <div className="flex-1">
            <SortOptions 
              sortBy={sortBy} 
              setSortBy={setSortBy} 
              productCount={filteredProducts.length} 
            />
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <ProductGrid products={filteredProducts} />
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductList;
