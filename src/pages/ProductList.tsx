import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import ProductCard from "@/components/products/ProductCard";
import { useParams, useSearchParams } from "react-router-dom";
import { useShopContext } from "@/context/ShopContext";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
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
import { Product } from "@/types/shop";

const ProductList = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const { products, fetchProductsByCategory, fetchAllProducts } = useShopContext();
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState("featured");
  
  // Debug logs
  useEffect(() => {
    console.log("Category param:", category);
    console.log("All products from context:", products);
  }, [category, products]);
  
  useEffect(() => {
    // Initial products load
    if (category) {
      // If there's a category parameter, fetch products for that category
      const categoryProducts = fetchProductsByCategory(category);
      console.log(`Products for category ${category}:`, categoryProducts);
      setDisplayProducts(categoryProducts);
    } else {
      // Otherwise, fetch all products
      const allProducts = fetchAllProducts();
      console.log("All products:", allProducts);
      setDisplayProducts(allProducts);
    }
  }, [category, fetchProductsByCategory, fetchAllProducts, products]);
  
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
  }, [displayProducts, searchTerm, priceRange, sortBy]);
  
  return (
    <MainLayout>
      <div className="container py-12">
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
                  <Slider
                    defaultValue={[0, 500]}
                    max={500}
                    step={10}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="my-6"
                  />
                  <div className="flex justify-between">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
                
                {/* Categories */}
                <div>
                  <h4 className="font-medium mb-2">Categories</h4>
                  <div className="space-y-2">
                    {["Rockets", "Kits", "Components", "Tools", "Books"].map((cat) => (
                      <div key={cat} className="flex items-center space-x-2">
                        <Checkbox id={`category-${cat}`} />
                        <label htmlFor={`category-${cat}`} className="text-sm">{cat}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-rocketry-navy">
                {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products` : 'All Products'}
              </h1>
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

export default ProductList;
