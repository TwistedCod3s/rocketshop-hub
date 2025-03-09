
import React from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useShop } from "@/context/ShopContext";

interface MobileNavProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categories: Array<{ name: string; path: string }>;
}

const MobileNav: React.FC<MobileNavProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  categories 
}) => {
  const { getCartCount, isAdmin } = useShop();
  const cartCount = getCartCount();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[85%] sm:w-[350px]">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/5e9df28c-dfeb-451d-aa2d-e34a30a769c6.png" 
                alt="Rocketry For Schools" 
                className="h-8 w-auto"
              />
            </Link>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <X className="h-5 w-5" />
              </Button>
            </SheetTrigger>
          </div>

          <div className="mb-6">
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-md w-full"
            />
          </div>

          <nav className="flex flex-col space-y-4">
            <Link to="/" className="py-2 px-1 hover:bg-accent rounded-md transition-colors">
              Home
            </Link>

            <div className="py-2 px-1">
              <div className="flex items-center justify-between">
                <span className="font-medium">Shop</span>
                <ChevronDown className="h-5 w-5" />
              </div>
              <div className="mt-2 ml-2 flex flex-col space-y-2">
                {categories.map((category) => (
                  <Link
                    key={category.path}
                    to={category.path}
                    className="py-1.5 px-2 hover:bg-accent rounded-md transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link to="/about" className="py-2 px-1 hover:bg-accent rounded-md transition-colors">
              About
            </Link>

            <Link to="/contact" className="py-2 px-1 hover:bg-accent rounded-md transition-colors">
              Contact
            </Link>

            <Link to="/account" className="py-2 px-1 hover:bg-accent rounded-md transition-colors">
              My Account
            </Link>

            <Link to="/cart" className="py-2 px-1 hover:bg-accent rounded-md transition-colors">
              Cart ({cartCount})
            </Link>
          </nav>

          <div className="mt-auto pt-6">
            {isAdmin ? (
              <Link to="/admin">
                <Button className="w-full bg-rocketry-navy hover:bg-rocketry-navy/90">
                  Admin Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/account">
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
