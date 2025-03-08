
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

interface CartSummaryProps {
  subtotal: number;
  itemCount: number;
}

const CartSummary: React.FC<CartSummaryProps> = ({ subtotal, itemCount }) => {
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock coupon codes
    if (couponCode.toUpperCase() === "SCHOOL10") {
      setDiscount(subtotal * 0.1);
      toast.success("Coupon applied successfully!", {
        description: "10% discount applied to your order."
      });
    } else if (couponCode.toUpperCase() === "EDUCATION20") {
      setDiscount(subtotal * 0.2);
      toast.success("Coupon applied successfully!", {
        description: "20% discount applied to your order."
      });
    } else {
      toast.error("Invalid coupon code", {
        description: "Please check your coupon code and try again."
      });
    }
  };
  
  // Calculate totals
  const shipping = subtotal > 150 ? 0 : 12.99;
  const tax = (subtotal - discount) * 0.07; // Assuming 7% tax
  const total = subtotal - discount + shipping + tax;
  
  return (
    <div className="bg-gray-50 rounded-lg p-6 border">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Estimated Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        
        <div className="border-t pt-3 mt-3 flex justify-between font-semibold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      
      <form onSubmit={handleApplyCoupon} className="mb-6">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" variant="outline">Apply</Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Try "SCHOOL10" for 10% off or "EDUCATION20" for 20% off
        </p>
      </form>
      
      <Link to="/checkout">
        <Button className="w-full bg-rocketry-navy hover:bg-rocketry-navy/90 mb-3">
          Proceed to Checkout
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
      
      <p className="text-xs text-center text-muted-foreground">
        Free shipping on orders over $150. <br/>
        Educational institutions may qualify for additional discounts.
      </p>
    </div>
  );
};

export default CartSummary;
