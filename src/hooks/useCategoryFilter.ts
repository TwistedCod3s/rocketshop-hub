
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Product } from "@/types/shop";
import { useShopContext } from "@/context/ShopContext";

export function useCategoryFilter(displayProducts: Product[], subcategories: string[]) {
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState("featured");
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Get the latest subcategories from context
  const { subcategories: contextSubcategories } = useShopContext();
  
  // Update search term from URL parameters
  useEffect(() => {
    const search = searchParams.get("search");
    if (search) {
      setSearchTerm(search);
    }
  }, [searchParams]);
  
  // Reset selected subcategories when available subcategories change
  useEffect(() => {
    // Clear selected subcategories that no longer exist in the new subcategories list
    if (subcategories && subcategories.length > 0) {
      console.log("Subcategory list changed:", subcategories);
      setSelectedSubcategories(prev => 
        prev.filter(selected => subcategories.includes(selected))
      );
    }
  }, [subcategories]);
  
  // Apply filters and sorting
  useEffect(() => {
    console.log("Filtering products:", displayProducts.length);
    console.log("Using subcategories filter:", selectedSubcategories);
    
    let result = [...displayProducts];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply price filter
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Apply subcategory filters if any are selected
    if (selectedSubcategories.length > 0) {
      result = result.filter(product => 
        product.subcategory && selectedSubcategories.includes(product.subcategory)
      );
      console.log("After subcategory filtering:", result.length);
      // Log each product's subcategory for debugging
      result.forEach(p => console.log(`Product: ${p.name}, Subcategory: ${p.subcategory}`));
    }
    
    // Apply sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    console.log("Filtered results:", result.length);
    setFilteredProducts(result);
  }, [displayProducts, searchTerm, priceRange, sortBy, selectedSubcategories]);
  
  const handleSubcategoryChange = (subcategory: string) => {
    console.log("Toggling subcategory:", subcategory);
    setSelectedSubcategories(prev => {
      if (prev.includes(subcategory)) {
        return prev.filter(c => c !== subcategory);
      } else {
        return [...prev, subcategory];
      }
    });
  };
  
  return {
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
  };
}
