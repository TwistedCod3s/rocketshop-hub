
import React from "react";
import { Separator } from "@/components/ui/separator";
import TrustIndicators from "./footer/TrustIndicators";
import AboutColumn from "./footer/AboutColumn";
import QuickLinks from "./footer/QuickLinks";
import Categories from "./footer/Categories";
import Newsletter from "./footer/Newsletter";
import ContactInfo from "./footer/ContactInfo";
import FooterBottom from "./footer/FooterBottom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white pt-16 pb-6">
      <div className="container mx-auto px-4 md:px-6">
        {/* Trust Indicators */}
        <TrustIndicators />
        
        <Separator className="mb-12" />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* About Column */}
          <AboutColumn />
          
          {/* Quick Links */}
          <QuickLinks />
          
          {/* Categories */}
          <Categories />
          
          {/* Newsletter */}
          <Newsletter />
        </div>
        
        {/* Contact Information */}
        <ContactInfo />
        
        <Separator className="mb-6" />
        
        {/* Footer Bottom */}
        <FooterBottom />
      </div>
    </footer>
  );
};

export default Footer;
