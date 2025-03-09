
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useShopContext } from "@/context/ShopContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { ShoppingCart, PackageCheck, ArrowRight } from "lucide-react";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateCartItemQuantity, removeFromCart, clearCart, getCartTotal } = useShopContext();
  const [couponCode, setCouponCode] = useState("");
  
  if (cart.length === 0) {
    return (
      <MainLayout>
        <div className="container py-16">
          <div className="text-center max-w-md mx-auto">
            <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-rocketry-blue" />
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Button 
              onClick={() => navigate("/products")} 
              className="w-full"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  const subtotal = getCartTotal();
  const itemCount = cart.length;
  
  return (
    <MainLayout>
      <div className="container py-12">
        <h1 className="text-display-small font-bold text-rocketry-navy mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="hidden sm:grid sm:grid-cols-12 text-sm font-medium text-gray-500 mb-4">
                <div className="sm:col-span-6">Product</div>
                <div className="sm:col-span-2 text-center">Price</div>
                <div className="sm:col-span-2 text-center">Quantity</div>
                <div className="sm:col-span-2 text-center">Total</div>
              </div>
              
              <div className="space-y-4">
                {cart.map((item) => (
                  <CartItem 
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateCartItemQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>
              
              <div className="mt-6 flex flex-wrap gap-4">
                <Link to="/products">
                  <Button variant="outline">Continue Shopping</Button>
                </Link>
                <Button variant="outline" onClick={clearCart}>
                  Clear Cart
                </Button>
              </div>
            </div>
          </div>
          
          {/* Cart Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <CartSummary 
                cart={cart}
                subtotal={subtotal}
                itemCount={itemCount}
              />
              
              {/* Trust Badges */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <PackageCheck className="h-4 w-4 mr-2 text-rocketry-blue" />
                  Free shipping on orders over £200
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ShoppingCart className="h-4 w-4 mr-2 text-rocketry-blue" />
                  30-day returns on all orders
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Cart;
