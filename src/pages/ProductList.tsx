
import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useShopContext } from "@/context/ShopContext";
import { Product } from "@/types/shop";
import ProductFilters from "@/components/products/ProductFilters";
import SortOptions from "@/components/products/SortOptions";
import ProductGrid from "@/components/products/ProductGrid";
import { useProductFilter } from "@/hooks/useProductFilter";
import { dbHelpers } from "@/lib/supabase";
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
  
  // Use our new sync checker hook to periodically check for updates
  useSyncChecker(reloadProductsFromStorage, loadProductsFromSupabase, reloadAllAdminData);
  
  // Load products and refresh when products change
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      
      try {
        console.log("Starting to load products in ProductList...");
        // Try loading from Supabase first
        let loadedFromSupabase = false;
        
        if (loadProductsFromSupabase) {
          console.log("Attempting to use loadProductsFromSupabase hook function");
          loadedFromSupabase = await loadProductsFromSupabase();
          console.log("Result from loadProductsFromSupabase:", loadedFromSupabase);
        } else {
          console.log("loadProductsFromSupabase not available in context");
          // Fallback to direct loading from Supabase
          try {
            const supabaseProducts = await dbHelpers.getProducts();
            
            if (supabaseProducts && supabaseProducts.length > 0) {
              console.log("Loaded products from Supabase directly:", supabaseProducts.length);
              
              // Update localStorage with the latest from Supabase
              localStorage.setItem('ROCKETRY_SHOP_PRODUCTS_V7', JSON.stringify(supabaseProducts));
              
              // If we have a reload function, use it to refresh the app state
              if (reloadProductsFromStorage) {
                reloadProductsFromStorage();
              }
              
              // Set the display products
              setDisplayProducts(supabaseProducts);
              loadedFromSupabase = true;
            }
          } catch (err) {
            console.error("Error directly loading from Supabase:", err);
          }
        }
        
        if (!loadedFromSupabase) {
          console.log("Falling back to localStorage for products");
          
          // Ensure localStorage data is loaded into the state
          if (reloadProductsFromStorage) {
            reloadProductsFromStorage();
          }
          
          const allProducts = fetchAllProducts();
          console.log("Products loaded from localStorage:", allProducts.length);
          setDisplayProducts(allProducts);
        }
      } catch (error) {
        console.error("Error loading products:", error);
        
        // Final fallback to localStorage
        if (reloadProductsFromStorage) {
          reloadProductsFromStorage();
        }
        
        const allProducts = fetchAllProducts();
        console.log("Products loaded from localStorage (after error):", allProducts.length);
        setDisplayProducts(allProducts);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Initial load
    loadProducts();
    
    // Set up event listeners for product updates
    const handleProductUpdate = () => {
      console.log("Products updated, refreshing list");
      loadProducts();
    };
    
    // Listen for all possible update events
    window.addEventListener('rocketry-product-update-v7', handleProductUpdate);
    window.addEventListener('rocketry-sync-trigger-v7', handleProductUpdate);
    window.addEventListener('storage', (e) => {
      if (e.key === "ROCKETRY_SHOP_PRODUCTS_V7" || 
          e.key === "ROCKETRY_SHOP_SYNC_TRIGGER_V7" ||
          e.key === "ROCKETRY_SHOP_CHANGES_PENDING" ||
          e.key === "EXTERNAL_SYNC_TRIGGER" ||
          e.key === "ROCKETRY_LAST_SYNC_TIMESTAMP" ||
          e.key === "ROCKETRY_SYNC_NEEDED") {
        console.log(`Storage event detected for ${e.key}, refreshing products`);
        handleProductUpdate();
      }
    });
    
    return () => {
      window.removeEventListener('rocketry-product-update-v7', handleProductUpdate);
      window.removeEventListener('rocketry-sync-trigger-v7', handleProductUpdate);
      window.removeEventListener('storage', handleProductUpdate);
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
