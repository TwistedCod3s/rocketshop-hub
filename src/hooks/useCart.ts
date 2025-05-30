
import { useState, useCallback, useEffect } from "react";
import { CartItem, Product } from "@/types/shop";
import { toast } from "@/hooks/use-toast";

// Use a consistent storage key with version suffix
const CART_STORAGE_KEY = "ROCKETRY_SHOP_CART_V3";

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Load cart from sessionStorage (per user, per browser)
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
    try {
      sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      console.log("Saved cart to sessionStorage:", cart.length);
    } catch (error) {
      console.error("Error saving cart to sessionStorage:", error);
    }
  }, [cart]);
  
  // Cart Management Functions
  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      
      if (existingItem) {
        // Update quantity if product already in cart
        const updated = prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
        
        // Show toast notification
        toast({
          title: "Cart updated",
          description: `Updated quantity of ${product.name} in your cart.`,
        });
        
        return updated;
      } else {
        // Add new item to cart
        toast({
          title: "Added to cart",
          description: `${product.name} has been added to your cart.`,
        });
        
        // Create a proper CartItem
        const newItem: CartItem = {
          id: product.id,
          quantity,
          product
        };
        
        return [...prev, newItem];
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
