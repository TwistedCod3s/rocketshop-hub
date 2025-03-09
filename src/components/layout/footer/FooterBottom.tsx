
import React from "react";
import { Link } from "react-router-dom";

const FooterBottom: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center">
      <p className="text-muted-foreground text-sm mb-4 md:mb-0">
        © {new Date().getFullYear()} Rocketry For Schools. All rights reserved.
      </p>
      
      <div className="flex space-x-4">
        <Link to="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
          Privacy Policy
        </Link>
        <Link to="/terms-conditions" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
          Terms & Conditions
        </Link>
        <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
          Admin
        </Link>
      </div>
    </div>
  );
};

export default FooterBottom;
