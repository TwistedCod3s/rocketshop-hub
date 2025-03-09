
import { useState, useCallback, useEffect } from "react";
import { CartItem, Product } from "@/types/shop";

// Use a consistent storage key
const CART_STORAGE_KEY = "rocketry-shop-cart";

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Load cart from sessionStorage
  useEffect(() => {
    const savedCart = sessionStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
        console.log("Loaded cart from sessionStorage:", parsedCart.length);
      } catch (error) {
        console.error("Error parsing saved cart:", error);
        // Fall back to empty cart if there's a parsing error
        setCart([]);
      }
    }
  }, []);
  
  // Update sessionStorage when cart changes
  useEffect(() => {
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    console.log("Saved cart to sessionStorage:", cart.length);
  }, [cart]);
  
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

  return {
    cart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    getCartTotal,
    getCartCount
  };
}
