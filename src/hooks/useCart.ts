
import { useState, useCallback, useEffect } from "react";
import { CartItem, Product } from "@/types/shop";

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);
  
  // Update localStorage when cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
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
