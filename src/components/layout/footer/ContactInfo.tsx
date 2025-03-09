
import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";

const ContactInfo: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-full bg-rocketry-gray flex items-center justify-center flex-shrink-0">
          <MapPin className="h-5 w-5 text-rocketry-navy" />
        </div>
        <div>
          <h4 className="font-medium text-sm">Our Location</h4>
          <p className="text-muted-foreground text-sm">123 Education Ave, Learning City, SC 12345</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-full bg-rocketry-gray flex items-center justify-center flex-shrink-0">
          <Phone className="h-5 w-5 text-rocketry-navy" />
        </div>
        <div>
          <h4 className="font-medium text-sm">Call Us</h4>
          <p className="text-muted-foreground text-sm">(123) 456-7890</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-full bg-rocketry-gray flex items-center justify-center flex-shrink-0">
          <Mail className="h-5 w-5 text-rocketry-navy" />
        </div>
        <div>
          <h4 className="font-medium text-sm">Email Us</h4>
          <p className="text-muted-foreground text-sm">info@rocketryforschools.com</p>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
