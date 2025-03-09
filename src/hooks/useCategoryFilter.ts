
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Product } from "@/types/shop";

export function useCategoryFilter(displayProducts: Product[], subcategories: string[]) {
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState("featured");
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Update search term from URL parameters
  useEffect(() => {
    const search = searchParams.get("search");
    if (search) {
      setSearchTerm(search);
    }
  }, [searchParams]);
  
  // Apply filters and sorting
  useEffect(() => {
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
      // This is just a simulation since we don't have subcategory data
      // In a real app, products would have a subcategory field
      const filtered = [...result];
      // For demonstration, we'll just take a subset of products for each subcategory
      result = filtered.slice(0, 2 * selectedSubcategories.length);
    }
    
    // Apply sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    setFilteredProducts(result);
  }, [displayProducts, searchTerm, priceRange, sortBy, selectedSubcategories]);
  
  const handleSubcategoryChange = (subcategory: string) => {
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
