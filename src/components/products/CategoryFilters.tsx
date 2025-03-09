
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  subcategories
}) => {
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
            
            {/* Price Range */}
            <div>
              <h4 className="font-medium mb-2">Price Range</h4>
              <div className="flex items-center gap-4">
                <Input 
                  type="number" 
                  min="0"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-1/2"
                />
                <span>to</span>
                <Input 
                  type="number" 
                  min="0"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-1/2"
                />
              </div>
            </div>
            
            {/* Subcategories */}
            {subcategories.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Subcategories</h4>
                <div className="space-y-2">
                  {subcategories.map((sub) => (
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
