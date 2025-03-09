import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
const HeroSection: React.FC = () => {
  return <div className="relative min-h-[65vh] flex items-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 hero-pattern"></div>
      
      {/* Content Container */}
      <div className="container mx-auto px-4 md:px-6 py-2 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-3 animate-fade-up">
            <div className="inline-block">
              <div className="bg-rocketry-blue/10 text-rocketry-navy border border-rocketry-blue/20 rounded-full px-4 py-1 text-sm">
                Empowering education through rocketry
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-rocketry-navy">
              <span className="bg-gradient-to-r from-rocketry-navy to-rocketry-blue bg-clip-text text-transparent">
                Rocketry for Schools
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-md">High-quality rocketry kits, components, and 
materials designed specifically for educational institutions, beginners and enthusiasts.</p>
            
            <div className="flex flex-wrap gap-4 pt-1">
              <Link to="/products">
                <Button size="lg" className="bg-rocketry-navy hover:bg-rocketry-navy/90 text-white rounded-md">
                  Shop Products
                </Button>
              </Link>
              
              <Link to="/products/category/Kits">
                <Button size="lg" variant="outline" className="border-rocketry-navy text-rocketry-navy hover:bg-rocketry-navy/10 rounded-md">
                  Explore Kits
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center pt-2 space-x-8">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-rocketry-gray flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rocketry-navy">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M12 11V5a2 2 0 1 0-4 0v1h4" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">Secure Payment</p>
                  <p className="text-xs text-muted-foreground">100% Protected</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-rocketry-gray flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rocketry-navy">
                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                    <path d="M12 12v9" />
                    <path d="m8 17 4 4 4-4" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">School Discounts</p>
                  <p className="text-xs text-muted-foreground">For Educational Use</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center lg:justify-end items-center">
            <div className="relative">
              <img src="/lovable-uploads/464bb92b-3c96-4abd-9987-49654404f1b3.png" alt="Rocketry for Schools" className="object-contain max-h-[450px] animate-rocket-move" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default HeroSection;