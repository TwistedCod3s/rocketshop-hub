
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product, CartItem, ShopContextType } from "@/types/shop";
import { initialProducts } from "@/data/initialProducts";

// Create context with default values
const ShopContext = createContext<ShopContextType>({
  products: [],
  featuredProducts: [],
  cart: [],
  addProduct: () => {},
  updateProduct: () => {},
  removeProduct: () => {},
  getProduct: () => undefined,
  fetchAllProducts: () => {},
  fetchProductsByCategory: () => {},
  fetchFeaturedProducts: () => {},
  getRelatedProducts: () => [],
  updateFeaturedProducts: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  updateCartItemQuantity: () => {},
  clearCart: () => {},
  getCartTotal: () => 0,
  getCartCount: () => 0,
  tryAdminLogin: () => false,
});

// Hook for using the shop context
export const useShopContext = () => useContext(ShopContext);
export const useShop = useShopContext; // Alias for useShopContext

// Provider component
export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  // Load initial data
  useEffect(() => {
    // Try to load products from localStorage
    const savedProducts = localStorage.getItem("products");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // Use initial products data if nothing in localStorage
      setProducts(initialProducts);
      localStorage.setItem("products", JSON.stringify(initialProducts));
    }
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    
    // Check if admin is logged in
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (adminLoggedIn === "true") {
      setIsAdmin(true);
    }
  }, []);
  
  // Update localStorage when cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
  
  // Update localStorage when products change
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("products", JSON.stringify(products));
    }
  }, [products]);
  
  // Product Management Functions
  const addProduct = useCallback((product: Product) => {
    setProducts(prev => [...prev, product]);
  }, []);
  
  const updateProduct = useCallback((product: Product) => {
    setProducts(prev => 
      prev.map(p => p.id === product.id ? product : p)
    );
  }, []);
  
  const removeProduct = useCallback((productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    // Also remove from cart if present
    setCart(prev => prev.filter(item => item.id !== productId));
  }, []);
  
  const getProduct = useCallback((productId: string) => {
    return products.find(p => p.id === productId);
  }, [products]);
  
  const fetchAllProducts = useCallback(() => {
    // In a real app, this would be an API call
    // For now, we just use the state
    return products;
  }, [products]);
  
  const fetchProductsByCategory = useCallback((category: string) => {
    // In a real app, this would be an API call
    // Fixed: Actually filter the products by category and return the filtered array
    const filteredProducts = products.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    );
    return filteredProducts;
  }, [products]);
  
  const fetchFeaturedProducts = useCallback(() => {
    const featured = products.filter(p => p.featured);
    setFeaturedProducts(featured);
    return featured;
  }, [products]);
  
  const getRelatedProducts = useCallback((category: string, excludeProductId: string) => {
    return products
      .filter(p => p.category === category && p.id !== excludeProductId)
      .slice(0, 4); // Limit to 4 related products
  }, [products]);
  
  const updateFeaturedProducts = useCallback((productId: string, isFeatured: boolean) => {
    setProducts(prev => 
      prev.map(p => p.id === productId ? { ...p, featured: isFeatured } : p)
    );
    // Update featured products list
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);
  
  // Cart Management Functions
  const addToCart = useCallback((product: Product, quantity: number) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      
      if (existingItem) {
        // Update quantity if product already in cart
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        // Add new item to cart
        return [...prev, { id: product.id, product, quantity }];
      }
    });
  }, []);
  
  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  }, []);
  
  const updateCartItemQuantity = useCallback((productId: string, quantity: number) => {
    setCart(prev => 
      prev.map(item => 
        item.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  }, []);
  
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);
  
  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }, [cart]);
  
  const getCartCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);
  
  // Admin functions
  const tryAdminLogin = useCallback((username: string, password: string) => {
    // Simple mock authentication for demo purposes
    if (username === "admin" && password === "password123") {
      localStorage.setItem("adminLoggedIn", "true");
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);
  
  // Context value
  const value = {
    products,
    featuredProducts,
    cart,
    addProduct,
    updateProduct,
    removeProduct,
    getProduct,
    fetchAllProducts,
    fetchProductsByCategory,
    fetchFeaturedProducts,
    getRelatedProducts,
    updateFeaturedProducts,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    isAdmin,
    tryAdminLogin,
  };
  
  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};
