
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import ProductCard from "@/components/products/ProductCard";
import { useShopContext } from "@/context/ShopContext";
import { Product } from "@/types/shop";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define subcategories for each main category
const SUBCATEGORIES = {
  "Rocket Kits": ["Beginner", "Intermediate", "Advanced", "Educational"],
  "Engines": ["A Class", "B Class", "C Class", "D Class", "Bulk Packs"],
  "Tools": ["Launch Controllers", "Construction Tools", "Safety Equipment"],
  "Materials": ["Body Tubes", "Nose Cones", "Fins", "Parachutes"],
  "UKROC": ["Competition Kits", "Egg Lofters", "Supplies"],
  "Accessories": ["Display Stands", "Decals", "Recovery Wadding", "Books"]
};

const CategoryPage = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const { products, fetchProductsByCategory } = useShopContext();
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState("featured");
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  
  // Get the proper category name
  const decodedCategory = category ? decodeURIComponent(category) : "";
  const displayCategory = decodedCategory === ':category' ? 'All Products' : decodedCategory;
  const subcategories = SUBCATEGORIES[decodedCategory] || [];
  
  // Debug logs
  useEffect(() => {
    console.log("Category param:", decodedCategory);
    console.log("All products from context:", products);
  }, [decodedCategory, products]);
  
  useEffect(() => {
    // Get products for this category or all products if category is ':category'
    if (decodedCategory === ':category') {
      console.log("Getting all products");
      setDisplayProducts(products);
    } else if (decodedCategory) {
      console.log(`Looking for products in category: ${decodedCategory}`);
      const categoryProducts = fetchProductsByCategory(decodedCategory);
      console.log(`Products for category ${decodedCategory}:`, categoryProducts);
      setDisplayProducts(categoryProducts);
    }
  }, [decodedCategory, fetchProductsByCategory, products]);
  
  useEffect(() => {
    const search = searchParams.get("search");
    if (search) {
      setSearchTerm(search);
    }
  }, [searchParams]);
  
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
    console.log("Filtered products:", result);
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
  
  return (
    <MainLayout>
      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-rocketry-navy mb-2">
            {displayCategory}
          </h1>
          <p className="text-muted-foreground">
            Browse our selection of {displayCategory.toLowerCase()} for your rocketry projects.
          </p>
        </div>
        
        {subcategories.length > 0 && (
          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="w-full flex overflow-x-auto max-w-full">
              <TabsTrigger value="all" className="flex-shrink-0">All {displayCategory}</TabsTrigger>
              {subcategories.map(sub => (
                <TabsTrigger key={sub} value={sub} className="flex-shrink-0">{sub}</TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="all">
              {/* All products shown by default */}
            </TabsContent>
            {subcategories.map(sub => (
              <TabsContent key={sub} value={sub}>
                {/* Subcategory specific content would go here */}
              </TabsContent>
            ))}
          </Tabs>
        )}
        
        <div className="flex flex-col md:flex-row gap-8">
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
          
          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''}
              </h2>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CategoryPage;
