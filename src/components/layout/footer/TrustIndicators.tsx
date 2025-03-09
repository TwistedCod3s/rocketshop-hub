
import React from "react";
import { ShieldCheck, Truck, CreditCard, Shield } from "lucide-react";
import TrustItem from "./TrustItem";

const TrustIndicators: React.FC = () => {
  const trustItems = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On orders over £200"
    },
    {
      icon: ShieldCheck,
      title: "Buy with confidence",
      description: "Products are rigorously tested with 24/7 support"
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description: "All major cards accepted"
    },
    {
      icon: Shield,
      title: "Educational Discount",
      description: "For qualifying schools"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
      {trustItems.map((item, index) => (
        <TrustItem
          key={index}
          icon={item.icon}
          title={item.title}
          description={item.description}
        />
      ))}
    </div>
  );
};

export default TrustIndicators;
