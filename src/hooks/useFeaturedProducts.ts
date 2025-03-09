
import { useState, useCallback, useEffect } from "react";
import { Product } from "@/types/shop";

export function useFeaturedProducts(products: Product[]) {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  
  const fetchFeaturedProducts = useCallback((): Product[] => {
    const featured = products.filter(p => p.featured);
    setFeaturedProducts(featured);
    return featured;
  }, [products]);
  
  // Update featured products when products change
  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return {
    featuredProducts,
    fetchFeaturedProducts
  };
}
