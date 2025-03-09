import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Clock, FileText } from "lucide-react";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const orderNumber = `RFS-${Math.floor(100000 + Math.random() * 900000)}`;
  
  // Redirect if user directly accesses this page without checkout
  useEffect(() => {
    const hasCompletedCheckout = sessionStorage.getItem("orderCompleted");
    if (!hasCompletedCheckout) {
      navigate("/");
    } else {
      // Clear the flag after successful access
      sessionStorage.removeItem("orderCompleted");
    }
  }, [navigate]);
  
  return (
    <MainLayout>
      <div className="container py-16">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-10">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-display-small font-bold text-rocketry-navy mb-4">Order Confirmed!</h1>
            <p className="text-lg text-gray-600">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
          </div>
          
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="font-bold text-lg mb-3">Order Information</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Number:</span>
                    <span className="font-medium">{orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">Credit Card</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping Method:</span>
                    <span className="font-medium">Standard Shipping</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="font-bold text-lg mb-3">Shipping Address</h2>
                <address className="not-italic">
                  <p>John Doe</p>
                  <p>123 Main Street</p>
                  <p>Anytown, CA 12345</p>
                  <p>United States</p>
                </address>
              </div>
            </div>
          </div>
          
          <div className="mb-10">
            <h2 className="font-bold text-lg mb-3">What's Next?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center p-4">
                <FileText className="h-8 w-8 text-rocketry-blue mb-3" />
                <h3 className="font-medium mb-1">Order Confirmation</h3>
                <p className="text-sm text-gray-600">
                  You'll receive an email with your order details.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4">
                <Package className="h-8 w-8 text-rocketry-blue mb-3" />
                <h3 className="font-medium mb-1">Order Processing</h3>
                <p className="text-sm text-gray-600">
                  We're preparing your items for shipment.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4">
                <Clock className="h-8 w-8 text-rocketry-blue mb-3" />
                <h3 className="font-medium mb-1">Shipping Updates</h3>
                <p className="text-sm text-gray-600">
                  You'll be notified when your order ships.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button>
                Return to Homepage
              </Button>
            </Link>
            <Link to="/track-order">
              <Button variant="outline">
                Track Your Order
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderConfirmation;
