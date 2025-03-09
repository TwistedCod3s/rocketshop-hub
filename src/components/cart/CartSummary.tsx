
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { CartItem, CartSummaryProps } from "@/types/shop";
import { useShopContext } from "@/context/ShopContext";

const CartSummary: React.FC<CartSummaryProps> = ({ cart, subtotal: propSubtotal, itemCount: propItemCount }) => {
  
  // Calculate subtotal and item count if not provided as props
  const calculatedSubtotal = propSubtotal || cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const calculatedItemCount = propItemCount || cart.reduce((count, item) => count + item.quantity, 0);
  
  // Calculate totals
  const shipping = calculatedSubtotal > 200 ? 0 : 12.99;
  const tax = calculatedSubtotal * 0.07; // Assuming 7% tax
  const total = calculatedSubtotal + shipping + tax;
  
  return (
    <div className="bg-gray-50 rounded-lg p-6 border">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal ({calculatedItemCount} items)</span>
          <span>£{calculatedSubtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>{shipping === 0 ? "Free" : `£${shipping.toFixed(2)}`}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Estimated Tax</span>
          <span>£{tax.toFixed(2)}</span>
        </div>
        
        <div className="border-t pt-3 mt-3 flex justify-between font-semibold">
          <span>Total</span>
          <span>£{total.toFixed(2)}</span>
        </div>
      </div>
      
      <Link to="/checkout">
        <Button className="w-full bg-rocketry-navy hover:bg-rocketry-navy/90 mb-3">
          Proceed to Checkout
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
      
      <p className="text-xs text-center text-muted-foreground">
        Free shipping on orders over £200. <br/>
        Educational institutions may qualify for additional discounts.
      </p>
    </div>
  );
};

export default CartSummary;
