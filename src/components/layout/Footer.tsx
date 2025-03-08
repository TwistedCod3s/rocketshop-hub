
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone, Shield, Truck, CreditCard, ShieldCheck } from "lucide-react";

const Footer: React.FC = () => {
  const [email, setEmail] = React.useState("");

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you for subscribing to our newsletter!");
    setEmail("");
  };

  return (
    <footer className="bg-white pt-16 pb-6">
      <div className="container mx-auto px-4 md:px-6">
        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="flex flex-col items-center text-center">
            <div className="h-14 w-14 rounded-full bg-rocketry-gray flex items-center justify-center mb-3">
              <Truck className="h-7 w-7 text-rocketry-navy" />
            </div>
            <h3 className="text-sm font-medium">Free Shipping</h3>
            <p className="text-xs text-muted-foreground mt-1">On orders over $150</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="h-14 w-14 rounded-full bg-rocketry-gray flex items-center justify-center mb-3">
              <ShieldCheck className="h-7 w-7 text-rocketry-navy" />
            </div>
            <h3 className="text-sm font-medium">Satisfaction Guaranteed</h3>
            <p className="text-xs text-muted-foreground mt-1">30-day money back</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="h-14 w-14 rounded-full bg-rocketry-gray flex items-center justify-center mb-3">
              <CreditCard className="h-7 w-7 text-rocketry-navy" />
            </div>
            <h3 className="text-sm font-medium">Secure Payments</h3>
            <p className="text-xs text-muted-foreground mt-1">All major cards accepted</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="h-14 w-14 rounded-full bg-rocketry-gray flex items-center justify-center mb-3">
              <Shield className="h-7 w-7 text-rocketry-navy" />
            </div>
            <h3 className="text-sm font-medium">Educational Discount</h3>
            <p className="text-xs text-muted-foreground mt-1">For qualifying schools</p>
          </div>
        </div>
        
        <Separator className="mb-12" />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* About Column */}
          <div>
            <Link to="/">
              <img 
                src="/lovable-uploads/6deeac36-da1c-460a-8457-ffb92c527e95.png" 
                alt="Rocketry For Schools" 
                className="h-10 mb-6"
              />
            </Link>
            <p className="text-muted-foreground text-sm mb-6">
              Providing high-quality rocketry products and curriculum materials to schools and educational institutions since 2010.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-6">Categories</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/category/rockets" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Rockets
                </Link>
              </li>
              <li>
                <Link to="/category/kits" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Kits
                </Link>
              </li>
              <li>
                <Link to="/category/components" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Components
                </Link>
              </li>
              <li>
                <Link to="/category/tools" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Tools
                </Link>
              </li>
              <li>
                <Link to="/category/curriculum" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Curriculum
                </Link>
              </li>
              <li>
                <Link to="/category/books" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Books
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-6">Newsletter</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Subscribe to our newsletter for the latest product updates, special offers, and educational resources.
            </p>
            <form onSubmit={handleNewsletter} className="space-y-3">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-md"
              />
              <Button type="submit" className="w-full bg-rocketry-navy hover:bg-rocketry-navy/90">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-rocketry-gray flex items-center justify-center flex-shrink-0">
              <MapPin className="h-5 w-5 text-rocketry-navy" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Our Location</h4>
              <p className="text-muted-foreground text-sm">123 Education Ave, Learning City, SC 12345</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-rocketry-gray flex items-center justify-center flex-shrink-0">
              <Phone className="h-5 w-5 text-rocketry-navy" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Call Us</h4>
              <p className="text-muted-foreground text-sm">(123) 456-7890</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-rocketry-gray flex items-center justify-center flex-shrink-0">
              <Mail className="h-5 w-5 text-rocketry-navy" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Email Us</h4>
              <p className="text-muted-foreground text-sm">info@rocketryforschools.com</p>
            </div>
          </div>
        </div>
        
        <Separator className="mb-6" />
        
        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Rocketry For Schools. All rights reserved.
          </p>
          
          <div className="flex space-x-4">
            <Link to="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms-conditions" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Terms & Conditions
            </Link>
            <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
