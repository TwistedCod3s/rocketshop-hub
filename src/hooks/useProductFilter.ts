
import { useState, useEffect } from "react";
import { Product } from "@/types/shop";
import { useSearchParams } from "react-router-dom";

export function useProductFilter(displayProducts: Product[]) {
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState("featured");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Update search term from URL parameters
  useEffect(() => {
    const search = searchParams.get("search");
    if (search) {
      setSearchTerm(search);
    }
  }, [searchParams]);
  
  // Apply filters and sorting
  useEffect(() => {
    console.log("Filtering products from:", displayProducts.length);
    console.log("Current filters - search:", searchTerm, "price:", priceRange, "categories:", selectedCategories);
    
    let result = [...displayProducts];
    
    // Apply search filter
    if (searchTerm && searchTerm.trim() !== '') {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(product => 
        (product.name && product.name.toLowerCase().includes(lowerSearch)) ||
        (product.description && product.description.toLowerCase().includes(lowerSearch))
      );
      console.log("After search filter:", result.length);
    }
    
    // Apply price filter
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    console.log("After price filter:", result.length);
    
    // Apply category filters if any are selected
    if (selectedCategories.length > 0) {
      result = result.filter(product => 
        product.category && selectedCategories.includes(product.category)
      );
      console.log("After category filter:", result.length);
    }
    
    // Apply sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "featured") {
      // Sort featured products first
      result.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
    }
    
    console.log("Final filtered products:", result.length);
    setFilteredProducts(result);
  }, [displayProducts, searchTerm, priceRange, sortBy, selectedCategories]);
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
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
    selectedCategories,
    handleCategoryChange
  };
}
