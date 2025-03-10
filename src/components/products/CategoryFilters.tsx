
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShopContext } from "@/context/ShopContext";

interface CategoryFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  selectedSubcategories: string[];
  handleSubcategoryChange: (subcategory: string) => void;
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
  subcategories: string[];
  categoryName?: string; // Add optional categoryName prop
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  priceRange,
  setPriceRange,
  selectedSubcategories,
  handleSubcategoryChange,
  filterOpen,
  setFilterOpen,
  subcategories,
  categoryName
}) => {
  // Get subcategories from context for dynamic updates
  const { subcategories: globalSubcategories } = useShopContext();
  
  // Use subcategories from context if categoryName is provided
  const displaySubcategories = categoryName && globalSubcategories?.[categoryName] 
    ? globalSubcategories[categoryName] 
    : subcategories;

  // Handle min price slider change
  const handleMinPriceChange = (value: number[]) => {
    const newMin = value[0];
    // Ensure min price doesn't exceed max price
    if (newMin <= priceRange[1]) {
      setPriceRange([newMin, priceRange[1]]);
    }
  };

  // Handle max price slider change
  const handleMaxPriceChange = (value: number[]) => {
    const newMax = value[0];
    // Ensure max price isn't less than min price
    if (newMax >= priceRange[0]) {
      setPriceRange([priceRange[0], newMax]);
    }
  };

  return (
    <>
      {/* Filter Sidebar - Mobile Toggle */}
      <div className="md:hidden w-full">
        <Button 
          onClick={() => setFilterOpen(!filterOpen)} 
          variant="outline" 
          className="w-full flex items-center justify-between"
        >
          <span>Filters</span>
          {filterOpen ? <X size={18} /> : <SlidersHorizontal size={18} />}
        </Button>
      </div>
      
      {/* Filter Sidebar */}
      <div className={`w-full md:w-64 ${filterOpen ? 'block' : 'hidden md:block'}`}>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Filters</h3>
          
          <div className="space-y-6">
            {/* Search */}
            <div>
              <h4 className="font-medium mb-2">Search</h4>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search products..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            {/* Price Range - Using two separate sliders */}
            <div>
              <h4 className="font-medium mb-2">Price Range</h4>
              
              {/* Min Price Slider */}
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Min Price</span>
                  <span className="text-sm font-medium">${priceRange[0]}</span>
                </div>
                <Slider
                  defaultValue={[0]}
                  value={[priceRange[0]]}
                  max={500}
                  step={10}
                  onValueChange={handleMinPriceChange}
                />
              </div>
              
              {/* Max Price Slider */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Max Price</span>
                  <span className="text-sm font-medium">${priceRange[1]}</span>
                </div>
                <Slider
                  defaultValue={[500]}
                  value={[priceRange[1]]}
                  max={500}
                  step={10}
                  onValueChange={handleMaxPriceChange}
                />
              </div>
              
              {/* Price Range Display */}
              <div className="flex justify-between items-center mt-4 text-sm">
                <span>Range: ${priceRange[0]} - ${priceRange[1]}</span>
              </div>
            </div>
            
            {/* Display Subcategories from context */}
            {displaySubcategories && displaySubcategories.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Subcategories</h4>
                <div className="space-y-2">
                  {displaySubcategories.map((sub) => (
                    <div key={sub} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`subcategory-${sub}`} 
                        checked={selectedSubcategories.includes(sub)}
                        onCheckedChange={() => handleSubcategoryChange(sub)}
                      />
                      <label 
                        htmlFor={`subcategory-${sub}`} 
                        className="text-sm cursor-pointer"
                      >
                        {sub}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryFilters;
