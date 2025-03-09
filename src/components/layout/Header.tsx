import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Search, 
  ShoppingCart, 
  Menu, 
  X, 
  ChevronDown,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useShop } from "@/context/ShopContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

const Header: React.FC = () => {
  const { getCartCount, isAdmin } = useShop();
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const cartCount = getCartCount();

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
                      <div className="grid grid-cols-2 gap-3 p-4 w-[400px]">
                        {categories.map((category) => (
                          <Link
                            key={category.path}
                            to={category.path}
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
          )}

          {/* Action Buttons */}
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

            {/* Removed Admin Indicator */}
            
            {/* Mobile Menu */}
            {isMobile && (
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
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
