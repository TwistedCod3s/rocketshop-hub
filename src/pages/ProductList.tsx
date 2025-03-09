
import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useShopContext } from "@/context/ShopContext";
import { Product } from "@/types/shop";
import ProductFilters from "@/components/products/ProductFilters";
import SortOptions from "@/components/products/SortOptions";
import ProductGrid from "@/components/products/ProductGrid";
import { useProductFilter } from "@/hooks/useProductFilter";

const ProductList = () => {
  const { fetchAllProducts } = useShopContext();
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Load products
  useEffect(() => {
    const allProducts = fetchAllProducts();
    console.log("All products:", allProducts);
    setDisplayProducts(allProducts);
  }, [fetchAllProducts]);
  
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
            
            <ProductGrid products={filteredProducts} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductList;
