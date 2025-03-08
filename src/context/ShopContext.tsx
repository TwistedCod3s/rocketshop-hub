
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

// Define types
export type ProductCategory = 
  | 'rockets'
  | 'kits' 
  | 'components' 
  | 'tools' 
  | 'curriculum' 
  | 'books';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: ProductCategory;
  featured: boolean;
  inventory: number;
  specifications?: Record<string, string>;
  relatedProducts?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

// Mock products data
const INITIAL_PRODUCTS: Product[] = [
  {
    id: "rocket-starter-kit",
    name: "Rocket Starter Kit",
    description: "Everything your school needs to start a rocketry program. Includes 10 rocket kits, launch pad, and curriculum materials.",
    price: 299.99,
    images: ["/public/placeholder.svg"],
    category: "kits",
    featured: true,
    inventory: 15,
    specifications: {
      "Skill Level": "Beginner",
      "Age Range": "12-18",
      "Students": "Up to 30",
      "Duration": "1 Semester"
    }
  },
  {
    id: "model-rocket-engine-pack",
    name: "Model Rocket Engine Pack",
    description: "A pack of 24 A8-3 rocket engines, perfect for classroom demonstrations and student projects.",
    price: 49.99,
    images: ["/public/placeholder.svg"],
    category: "components",
    featured: true,
    inventory: 50
  },
  {
    id: "advanced-rocketry-curriculum",
    name: "Advanced Rocketry Curriculum",
    description: "Complete curriculum for a year-long advanced rocketry course, aligned with STEM standards.",
    price: 129.99,
    images: ["/public/placeholder.svg"],
    category: "curriculum",
    featured: true,
    inventory: 20
  },
  {
    id: "altitude-tracking-system",
    name: "Altitude Tracking System",
    description: "Track the height of your rockets with this easy-to-use altitude tracking system.",
    price: 79.99,
    images: ["/public/placeholder.svg"],
    category: "tools",
    featured: true,
    inventory: 12
  },
  {
    id: "introduction-to-rocketry",
    name: "Introduction to Rocketry",
    description: "A comprehensive textbook introducing the principles of rocketry for middle and high school students.",
    price: 34.99,
    images: ["/public/placeholder.svg"],
    category: "books",
    featured: false,
    inventory: 35
  },
  {
    id: "launch-pad-deluxe",
    name: "Launch Pad Deluxe",
    description: "Heavy-duty launch pad suitable for group launches and capable of supporting larger model rockets.",
    price: 149.99,
    images: ["/public/placeholder.svg"],
    category: "tools",
    featured: false,
    inventory: 8
  }
];

// Admin user credentials
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "password123"
};

// Interface for our context
interface ShopContextType {
  products: Product[];
  featuredProducts: Product[];
  cartItems: CartItem[];
  isAdmin: boolean;
  tryAdminLogin: (username: string, password: string) => boolean;
  adminLogout: () => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: ProductCategory) => Product[];
  toggleProductFeatured: (productId: string) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
}

// Create context
const ShopContext = createContext<ShopContextType | undefined>(undefined);

// Provider component
export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // Get featured products
  const featuredProducts = products.filter(product => product.featured);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart from localStorage');
      }
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Admin login function
  const tryAdminLogin = (username: string, password: string): boolean => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsAdmin(true);
      toast.success("Successfully logged in as admin");
      return true;
    }
    toast.error("Invalid credentials");
    return false;
  };

  // Admin logout function
  const adminLogout = () => {
    setIsAdmin(false);
    toast.info("Logged out successfully");
  };

  // Add to cart function
  const addToCart = (product: Product, quantity = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      
      return [...prev, { product, quantity }];
    });
    
    toast.success(`Added ${product.name} to cart`);
  };

  // Remove from cart function
  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
    toast.info("Item removed from cart");
  };

  // Update cart quantity function
  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prev => 
      prev.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  // Clear cart function
  const clearCart = () => {
    setCartItems([]);
    toast.info("Cart cleared");
  };

  // Get cart total
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  // Get cart count
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  // Get product by ID
  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };

  // Get products by category
  const getProductsByCategory = (category: ProductCategory) => {
    return products.filter(product => product.category === category);
  };

  // Toggle product featured status
  const toggleProductFeatured = (productId: string) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, featured: !product.featured } 
          : product
      )
    );
    toast.success("Product featured status updated");
  };

  // Add a new product
  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
    toast.success("Product added successfully");
  };

  // Update an existing product
  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === updatedProduct.id 
          ? updatedProduct 
          : product
      )
    );
    toast.success("Product updated successfully");
  };

  // Delete a product
  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(product => product.id !== productId));
    toast.success("Product deleted successfully");
  };

  const contextValue: ShopContextType = {
    products,
    featuredProducts,
    cartItems,
    isAdmin,
    tryAdminLogin,
    adminLogout,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    getProductById,
    getProductsByCategory,
    toggleProductFeatured,
    addProduct,
    updateProduct,
    deleteProduct
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {children}
    </ShopContext.Provider>
  );
};

// Hook for using the shop context
export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
