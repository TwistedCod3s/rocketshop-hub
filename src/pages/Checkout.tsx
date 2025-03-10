import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useShopContext } from "@/context/ShopContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { LockIcon } from "lucide-react";
import CartSummary from "@/components/cart/CartSummary";
import { CartSummaryProps } from "@/types/shop";

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cart, clearCart, getCartTotal, getCartCount } = useShopContext();
  const [step, setStep] = useState(1);
  
  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });
  
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States"
  });
  
  const [billingInfo, setBillingInfo] = useState({
    sameAsShipping: true,
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States"
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    method: "credit_card",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: ""
  });
  
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleShippingInfoChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleBillingInfoChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePaymentInfoChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulate checkout completion
    sessionStorage.setItem("orderCompleted", "true");
    toast({
      title: "Order Placed!",
      description: "Your order has been successfully placed.",
    });
    
    // Clear cart and redirect to confirmation
    clearCart();
    navigate("/order-confirmation");
  };
  
  const nextStep = () => {
    setStep(step + 1);
    window.scrollTo(0, 0);
  };
  
  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };
  
  // Calculate subtotal and item count for CartSummary
  const subtotal = getCartTotal ? getCartTotal() : cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const itemCount = getCartCount ? getCartCount() : cart.reduce((count, item) => count + item.quantity, 0);
  
  if (cart.length === 0) {
    navigate("/cart");
    return null;
  }
  
  return (
    <MainLayout>
      <div className="container py-12">
        <h1 className="text-display-small font-bold text-rocketry-navy mb-8">Checkout</h1>
        
        {/* Checkout Progress */}
        <div className="mb-12">
          <div className="flex justify-between">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 1 ? 'bg-rocketry-blue text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="text-sm">Personal Info</span>
            </div>
            <div className="flex-1 h-0.5 self-center mx-4 bg-gray-200">
              <div className={`h-full ${step >= 2 ? 'bg-rocketry-blue' : 'bg-gray-200'}`} style={{ width: `${step >= 2 ? '100%' : '0%'}` }}></div>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 2 ? 'bg-rocketry-blue text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="text-sm">Shipping</span>
            </div>
            <div className="flex-1 h-0.5 self-center mx-4 bg-gray-200">
              <div className={`h-full ${step >= 3 ? 'bg-rocketry-blue' : 'bg-gray-200'}`} style={{ width: `${step >= 3 ? '100%' : '0%'}` }}></div>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 3 ? 'bg-rocketry-blue text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="text-sm">Payment</span>
            </div>
            <div className="flex-1 h-0.5 self-center mx-4 bg-gray-200">
              <div className={`h-full ${step >= 4 ? 'bg-rocketry-blue' : 'bg-gray-200'}`} style={{ width: `${step >= 4 ? '100%' : '0%'}` }}></div>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 4 ? 'bg-rocketry-blue text-white' : 'bg-gray-200'}`}>
                4
              </div>
              <span className="text-sm">Review</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Personal Information */}
              {step === 1 && (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h2 className="text-xl font-bold mb-6">Personal Information</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName"
                        name="firstName"
                        value={personalInfo.firstName}
                        onChange={handlePersonalInfoChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName"
                        name="lastName"
                        value={personalInfo.lastName}
                        onChange={handlePersonalInfoChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email"
                        name="email"
                        type="email"
                        value={personalInfo.email}
                        onChange={handlePersonalInfoChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone"
                        name="phone"
                        value={personalInfo.phone}
                        onChange={handlePersonalInfoChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <Button type="button" onClick={nextStep}>
                      Continue to Shipping
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Step 2: Shipping Information */}
              {step === 2 && (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
                  
                  <div className="space-y-4 mb-4">
                    <div>
                      <Label htmlFor="address">Street Address</Label>
                      <Input 
                        id="address"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleShippingInfoChange}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input 
                          id="city"
                          name="city"
                          value={shippingInfo.city}
                          onChange={handleShippingInfoChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input 
                          id="state"
                          name="state"
                          value={shippingInfo.state}
                          onChange={handleShippingInfoChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input 
                          id="postalCode"
                          name="postalCode"
                          value={shippingInfo.postalCode}
                          onChange={handleShippingInfoChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Input 
                          id="country"
                          name="country"
                          value={shippingInfo.country}
                          onChange={handleShippingInfoChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="sameAsBilling"
                        checked={billingInfo.sameAsShipping}
                        onCheckedChange={(checked) => {
                          setBillingInfo(prev => ({
                            ...prev,
                            sameAsShipping: !!checked,
                            ...(!!checked ? {
                              address: shippingInfo.address,
                              city: shippingInfo.city,
                              state: shippingInfo.state,
                              postalCode: shippingInfo.postalCode,
                              country: shippingInfo.country
                            } : {})
                          }));
                        }}
                      />
                      <label htmlFor="sameAsBilling" className="text-sm">
                        Billing address is the same as shipping address
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      Back
                    </Button>
                    <Button type="button" onClick={nextStep}>
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Step 3: Payment Information */}
              {step === 3 && (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h2 className="text-xl font-bold mb-6">Payment Method</h2>
                  
                  <div className="mb-6">
                    <RadioGroup 
                      value={paymentInfo.method} 
                      onValueChange={(value) => setPaymentInfo(prev => ({ ...prev, method: value }))}
                    >
                      <div className="flex items-center space-x-2 mb-3">
                        <RadioGroupItem value="credit_card" id="credit_card" />
                        <Label htmlFor="credit_card">Credit/Debit Card</Label>
                      </div>
                      <div className="flex items-center space-x-2 mb-3">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal">PayPal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                        <Label htmlFor="bank_transfer">Bank Transfer</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {paymentInfo.method === "credit_card" && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input 
                          id="cardName"
                          name="cardName"
                          value={paymentInfo.cardName}
                          onChange={handlePaymentInfoChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input 
                          id="cardNumber"
                          name="cardNumber"
                          value={paymentInfo.cardNumber}
                          onChange={handlePaymentInfoChange}
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Expiry Date (MM/YY)</Label>
                          <Input 
                            id="expiry"
                            name="expiry"
                            value={paymentInfo.expiry}
                            onChange={handlePaymentInfoChange}
                            required
                            placeholder="MM/YY"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input 
                            id="cvv"
                            name="cvv"
                            value={paymentInfo.cvv}
                            onChange={handlePaymentInfoChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="border-t mt-6 pt-4">
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <LockIcon className="h-4 w-4 mr-2" />
                      <span>Your payment information is secure and encrypted</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      Back
                    </Button>
                    <Button type="button" onClick={nextStep}>
                      Review Order
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Step 4: Order Review */}
              {step === 4 && (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h2 className="text-xl font-bold mb-6">Review Your Order</h2>
                  
                  <div className="space-y-6 mb-6">
                    <div>
                      <h3 className="font-medium mb-2">Personal Information</h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p>
                          {personalInfo.firstName} {personalInfo.lastName}
                        </p>
                        <p>{personalInfo.email}</p>
                        <p>{personalInfo.phone}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Shipping Address</h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p>{shippingInfo.address}</p>
                        <p>
                          {shippingInfo.city}, {shippingInfo.state} {shippingInfo.postalCode}
                        </p>
                        <p>{shippingInfo.country}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Payment Method</h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        {paymentInfo.method === "credit_card" && (
                          <p>Credit Card (ending in {paymentInfo.cardNumber.slice(-4)})</p>
                        )}
                        {paymentInfo.method === "paypal" && <p>PayPal</p>}
                        {paymentInfo.method === "bank_transfer" && <p>Bank Transfer</p>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 mt-6">
                    <div className="flex items-center space-x-2 mb-6">
                      <Checkbox id="terms" required />
                      <label htmlFor="terms" className="text-sm">
                        I agree to the <a href="#" className="text-rocketry-blue">Terms and Conditions</a> and <a href="#" className="text-rocketry-blue">Privacy Policy</a>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      Back
                    </Button>
                    <Button type="submit">
                      Place Order
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
              
              {/* Cart Items Summary */}
              <div className="border-b pb-4 mb-4">
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div className="flex">
                        <span className="mr-2">{item.quantity}x</span>
                        <span className="font-medium">{item.product.name}</span>
                      </div>
                      <span>£{(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <CartSummary 
                cart={cart}
                subtotal={subtotal}
                itemCount={itemCount}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Checkout;
