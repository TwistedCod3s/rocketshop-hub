
import React from "react";
import { ShieldCheck, Truck, CreditCard, Shield } from "lucide-react";

const TrustIndicators: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
      <div className="flex flex-col items-center text-center">
        <div className="h-14 w-14 rounded-full bg-rocketry-gray flex items-center justify-center mb-3">
          <Truck className="h-7 w-7 text-rocketry-navy" />
        </div>
        <h3 className="text-sm font-medium">Free Shipping</h3>
        <p className="text-xs text-muted-foreground mt-1">On orders over $150</p>
      </div>
      
      <div className="flex flex-col items-center text-center">
        <div className="h-14 w-14 rounded-full bg-rocketry-gray flex items-center justify-center mb-3">
          <ShieldCheck className="h-7 w-7 text-rocketry-navy" />
        </div>
        <h3 className="text-sm font-medium">Satisfaction Guaranteed</h3>
        <p className="text-xs text-muted-foreground mt-1">30-day money back</p>
      </div>
      
      <div className="flex flex-col items-center text-center">
        <div className="h-14 w-14 rounded-full bg-rocketry-gray flex items-center justify-center mb-3">
          <CreditCard className="h-7 w-7 text-rocketry-navy" />
        </div>
        <h3 className="text-sm font-medium">Secure Payments</h3>
        <p className="text-xs text-muted-foreground mt-1">All major cards accepted</p>
      </div>
      
      <div className="flex flex-col items-center text-center">
        <div className="h-14 w-14 rounded-full bg-rocketry-gray flex items-center justify-center mb-3">
          <Shield className="h-7 w-7 text-rocketry-navy" />
        </div>
        <h3 className="text-sm font-medium">Educational Discount</h3>
        <p className="text-xs text-muted-foreground mt-1">For qualifying schools</p>
      </div>
    </div>
  );
};

export default TrustIndicators;
