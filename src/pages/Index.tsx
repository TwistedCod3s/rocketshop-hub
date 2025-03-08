
import MainLayout from "@/components/layout/MainLayout";
import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import FeaturesSection from "@/components/home/FeaturesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import ProductCarousel from "@/components/products/ProductCarousel";
import { useEffect } from "react";
import { useShopContext } from "@/context/ShopContext";

const Index = () => {
  const { featuredProducts, fetchFeaturedProducts } = useShopContext();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    <MainLayout>
      <HeroSection />
      
      <section className="container py-16">
        <h2 className="text-display-small font-bold text-rocketry-navy mb-8 text-center">
          Featured Products
        </h2>
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
