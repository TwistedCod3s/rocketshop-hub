import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import { Product } from "@/types/shop";

interface ProductCarouselProps {
  products: Product[];
  title?: string;
  description?: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  title,
  description
}) => {
  const [current, setCurrent] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive itemsPerView
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setItemsPerView(1);
      } else if (width < 768) {
        setItemsPerView(2);
      } else if (width < 1024) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update translateX when current or itemsPerView changes
  useEffect(() => {
    if (containerRef.current) {
      const itemWidth = containerRef.current.offsetWidth / itemsPerView;
      setTranslateX(-current * itemWidth);
    }
  }, [current, itemsPerView]);
  const next = () => {
    if (current < products.length - itemsPerView) {
      setCurrent(current + 1);
    } else {
      setCurrent(0); // Reset to start
    }
  };

  const prev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    } else {
      setCurrent(Math.max(0, products.length - itemsPerView)); // Go to end
    }
  };

  // Auto-scroll interval
  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 5000);
    return () => clearInterval(interval);
  }, [current]);

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 mb-16">
      {title && (
        <div className="text-center mb-6">
          {/* Reduced margin-bottom from mb-10 to mb-6 */}
          
          {description && (
            <p className="mt-1 text-muted-foreground max-w-2xl mx-auto">
              {/* Reduced margin-top from mt-3 to mt-1 */}
              {description}
            </p>
          )}
        </div>
      )}
      
      <div className="relative" ref={containerRef}>
        {/* Carousel Navigation */}
        <div className="absolute top-1/2 -left-4 z-10 -translate-y-1/2">
          <Button variant="outline" size="icon" className="rounded-full bg-white border-gray-200 shadow-md hover:bg-white hover:border-gray-300" onClick={prev}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="absolute top-1/2 -right-4 z-10 -translate-y-1/2">
          <Button variant="outline" size="icon" className="rounded-full bg-white border-gray-200 shadow-md hover:bg-white hover:border-gray-300" onClick={next}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Products Container */}
        <div className="overflow-hidden px-4 relative">
          <div className="flex transition-transform duration-500 ease-out" style={{
          transform: `translateX(${translateX}px)`
        }}>
            {products.map(product => <div key={product.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex-shrink-0 p-2">
                <ProductCard product={product} />
              </div>)}
          </div>
        </div>
        
        {/* Dots Indicator */}
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({
          length: Math.ceil(products.length / itemsPerView)
        }).map((_, i) => <button key={i} className={`h-2 rounded-full transition-all ${i === Math.floor(current / itemsPerView) ? "w-6 bg-rocketry-navy" : "w-2 bg-gray-300"}`} onClick={() => setCurrent(i * itemsPerView)} />)}
        </div>
      </div>
    </div>
  );
};

export default ProductCarousel;
