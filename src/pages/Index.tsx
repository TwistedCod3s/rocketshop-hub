
import MainLayout from "@/components/layout/MainLayout";
import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import FeaturesSection from "@/components/home/FeaturesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import ProductCarousel from "@/components/products/ProductCarousel";
import { useEffect, useState, useCallback } from "react";
import { useShopContext } from "@/context/ShopContext";
import { Product } from "@/types/shop";

const Index = () => {
  const { products, fetchFeaturedProducts } = useShopContext();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Memoized function to get featured products
  const loadFeaturedProducts = useCallback(() => {
    // Only fetch if we have the hook function and don't already have featured products
    if (fetchFeaturedProducts) {
      const featured = fetchFeaturedProducts();
      setFeaturedProducts(featured);
      setIsLoading(false);
    } else if (products) {
      // If we don't have the hook function, filter products manually
      const featured = products.filter(p => p.featured);
      setFeaturedProducts(featured);
      setIsLoading(false);
    }
  }, [fetchFeaturedProducts, products]);

  useEffect(() => {
    // Only fetch featured products once on mount
    loadFeaturedProducts();
    
    // Listen for specific product update event, but don't re-fetch on every sync event
    const handleProductUpdate = () => {
      console.log("Product update detected, refreshing featured products");
      loadFeaturedProducts();
    };
    
    window.addEventListener('rocketry-product-update-v7', handleProductUpdate);
    
    return () => {
      window.removeEventListener('rocketry-product-update-v7', handleProductUpdate);
    };
  }, [loadFeaturedProducts]);

  return (
    <MainLayout>
      <HeroSection />
      
      <section className="container py-0 -mt-16">
        <ProductCarousel 
          products={featuredProducts} 
          title="Featured Products"
          description="Discover our most popular educational rocketry products"
        />
      </section>
      
      <CategorySection />
      <FeaturesSection />
      <TestimonialsSection />
      <NewsletterSection />
    </MainLayout>
  );
};

export default Index;
