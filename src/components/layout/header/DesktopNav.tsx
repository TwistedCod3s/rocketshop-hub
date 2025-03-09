
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { 
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent
} from "@/components/ui/navigation-menu";

interface DesktopNavProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categories: Array<{ name: string; path: string }>;
}

const DesktopNav: React.FC<DesktopNavProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  categories 
}) => {
  const location = useLocation();

  return (
    <div className="hidden md:flex items-center space-x-8">
      <NavigationMenu>
        <NavigationMenuList>
          {/* Home Link */}
          <NavigationMenuItem>
            <Link 
              to="/" 
              className={cn(
                "nav-link relative group text-foreground/80 hover:text-foreground transition-colors px-2 py-1.5",
                location.pathname === "/" && "font-medium text-foreground"
              )}
            >
              Home
              <span className="nav-indicator group-hover:scale-x-100" />
            </Link>
          </NavigationMenuItem>
          
          {/* Shop Dropdown */}
          <NavigationMenuItem>
            <NavigationMenuTrigger>Shop</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid grid-cols-1 gap-3 p-4 w-[200px]">
                <Link
                  to="/products"
                  className="block p-3 hover:bg-accent rounded-md transition-colors font-medium"
                >
                  All Products
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.path}
                    to={`/category/${category.path}`}
                    className="block p-3 hover:bg-accent rounded-md transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* About Link */}
          <NavigationMenuItem>
            <Link 
              to="/about" 
              className={cn(
                "nav-link relative group text-foreground/80 hover:text-foreground transition-colors px-2 py-1.5",
                location.pathname === "/about" && "font-medium text-foreground"
              )}
            >
              About
              <span className="nav-indicator group-hover:scale-x-100" />
            </Link>
          </NavigationMenuItem>

          {/* Contact Link */}
          <NavigationMenuItem>
            <Link 
              to="/contact" 
              className={cn(
                "nav-link relative group text-foreground/80 hover:text-foreground transition-colors px-2 py-1.5",
                location.pathname === "/contact" && "font-medium text-foreground"
              )}
            >
              Contact
              <span className="nav-indicator group-hover:scale-x-100" />
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Search */}
      <div className="relative w-56">
        <Input
          type="search"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-full pl-10 pr-4 bg-background/50 border-muted focus:bg-background"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
};

export default DesktopNav;
