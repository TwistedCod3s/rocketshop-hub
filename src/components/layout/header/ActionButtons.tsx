
import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useShop } from "@/context/ShopContext";
import MobileNav from "./MobileNav";

interface ActionButtonsProps {
  isMobile: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categories: Array<{ name: string; path: string }>;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  isMobile, 
  searchQuery, 
  setSearchQuery, 
  categories 
}) => {
  const { getCartCount } = useShop();
  const cartCount = getCartCount();

  return (
    <div className="flex items-center space-x-1 md:space-x-3">
      {/* Account Icon for larger screens */}
      {!isMobile && (
        <Link to="/account">
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
          </Button>
        </Link>
      )}

      {/* Cart */}
      <Link to="/cart">
        <Button variant="ghost" size="icon" className="rounded-full relative">
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1.5 h-5 min-w-5 flex items-center justify-center bg-rocketry-navy text-white">
              {cartCount}
            </Badge>
          )}
        </Button>
      </Link>

      {/* Mobile Menu */}
      {isMobile && (
        <MobileNav 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          categories={categories} 
        />
      )}
    </div>
  );
};

export default ActionButtons;
