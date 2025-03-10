
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useShopContext } from "@/context/ShopContext";
import { Product } from "@/types/shop";
import SortOptions from "@/components/products/SortOptions";
import ProductGrid from "@/components/products/ProductGrid";
import CategoryFilters from "@/components/products/CategoryFilters";
import SubcategoryTabs from "@/components/products/SubcategoryTabs";
import { useCategoryFilter } from "@/hooks/useCategoryFilter";
import { SUBCATEGORIES, CATEGORY_MAP } from "@/constants/categories";

interface CategoryPageProps {
  categoryName?: string;
}

const CategoryPage = ({ categoryName: propCategoryName }: CategoryPageProps) => {
  const { categoryName: paramCategoryName } = useParams();
  const { products, fetchProductsByCategory, subcategories: contextSubcategories } = useShopContext();
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  console.log("CategoryPage rendering with params:", { 
    propCategoryName, 
    paramCategoryName, 
    pathContents: window.location.pathname 
  });
  
  // Determine which category to use (prop or param)
  let resolvedCategoryName = propCategoryName;
  
  // If no prop was provided, try to get it from the URL parameter
  if (!resolvedCategoryName && paramCategoryName) {
    // First check if the parameter is a slug in our CATEGORY_MAP
    resolvedCategoryName = CATEGORY_MAP[paramCategoryName];
    
    // If not found in map, use the parameter directly (for backward compatibility)
    if (!resolvedCategoryName) {
      resolvedCategoryName = paramCategoryName;
    }
  }
  
  // Use the resolved category name or default to "All Products"
  const categoryTitle = resolvedCategoryName || "All Products";
  
  // Get subcategories from context first, fall back to constants
  const categorySubcategories = contextSubcategories?.[categoryTitle] || SUBCATEGORIES[categoryTitle] || [];
  
  // Debug logs
  useEffect(() => {
    console.log("Category name prop:", propCategoryName);
    console.log("Category name param:", paramCategoryName);
    console.log("Resolved category name:", resolvedCategoryName);
    console.log("Context subcategories:", contextSubcategories);
    console.log("Using subcategories:", categorySubcategories);
    console.log("All products from context:", products);
  }, [propCategoryName, paramCategoryName, resolvedCategoryName, products, contextSubcategories]);
  
  useEffect(() => {
    // Get products for this specific category
    if (categoryTitle && categoryTitle !== "All Products") {
      console.log(`Looking for products in category: ${categoryTitle}`);
      const categoryProducts = fetchProductsByCategory(categoryTitle);
      console.log(`Products for category ${categoryTitle}:`, categoryProducts);
      setDisplayProducts(categoryProducts);
    } else {
      // If no category or "All Products", show all products
      setDisplayProducts(products);
    }
  }, [categoryTitle, fetchProductsByCategory, products]);
  
  // Use our custom hook for filtering
  const {
    filteredProducts,
    searchTerm,
    setSearchTerm,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    selectedSubcategories,
    handleSubcategoryChange,
    filterOpen,
    setFilterOpen
  } = useCategoryFilter(displayProducts, categorySubcategories);
  
  return (
    <MainLayout>
      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-rocketry-navy mb-2">
            {categoryTitle}
          </h1>
          <p className="text-muted-foreground">
            Browse our selection of {categoryTitle.toLowerCase()} for your rocketry projects.
          </p>
        </div>
        
        {/* Subcategory Tabs */}
        <SubcategoryTabs 
          subcategories={categorySubcategories} 
          categoryTitle={categoryTitle} 
        />
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Category Filters */}
          <CategoryFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedSubcategories={selectedSubcategories}
            handleSubcategoryChange={handleSubcategoryChange}
            filterOpen={filterOpen}
            setFilterOpen={setFilterOpen}
            subcategories={categorySubcategories}
            categoryName={categoryTitle}  // Pass the category name to filters
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

export default CategoryPage;
