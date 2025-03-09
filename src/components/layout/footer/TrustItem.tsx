
import React from "react";
import { LucideIcon } from "lucide-react";

interface TrustItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const TrustItem: React.FC<TrustItemProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="h-14 w-14 rounded-full bg-rocketry-gray flex items-center justify-center mb-3">
        <Icon className="h-7 w-7 text-rocketry-navy" />
      </div>
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  );
};

export default TrustItem;
