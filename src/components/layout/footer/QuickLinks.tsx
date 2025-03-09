
import React from "react";
import { Link } from "react-router-dom";

const QuickLinks: React.FC = () => {
  return (
    <div>
      <h3 className="font-semibold mb-6">Quick Links</h3>
      <ul className="space-y-3">
        <li>
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            Home
          </Link>
        </li>
        <li>
          <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            About Us
          </Link>
        </li>
        <li>
          <Link to="/products" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            Shop
          </Link>
        </li>
        <li>
          <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            Contact
          </Link>
        </li>
        <li>
          <Link to="/faq" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            FAQ
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default QuickLinks;
