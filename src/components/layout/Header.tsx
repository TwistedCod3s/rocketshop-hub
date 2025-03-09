
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import DesktopNav from "./header/DesktopNav";
import ActionButtons from "./header/ActionButtons";

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reset search on route change
  useEffect(() => {
    setSearchQuery("");
  }, [location.pathname]);

  // Navigation categories
  const categories = [
    { name: "Rockets", path: "/category/rockets" },
    { name: "Kits", path: "/category/kits" },
    { name: "Components", path: "/category/components" },
    { name: "Tools", path: "/category/tools" },
    { name: "Curriculum", path: "/category/curriculum" },
    { name: "Books", path: "/category/books" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "glass-nav py-3" : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 transition-opacity hover:opacity-90"
          >
            <img 
              src="/lovable-uploads/6deeac36-da1c-460a-8457-ffb92c527e95.png" 
              alt="Rocketry For Schools" 
              className="h-10 md:h-12 object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          {!isMobile && (
            <DesktopNav 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              categories={categories}
            />
          )}

          {/* Action Buttons */}
          <ActionButtons 
            isMobile={isMobile}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categories={categories}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
