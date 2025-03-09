
import React from "react";
import { Link } from "react-router-dom";

const Categories: React.FC = () => {
  return (
    <div>
      <h3 className="font-semibold mb-6">Categories</h3>
      <ul className="space-y-3">
        <li>
          <Link to="/category/rocket-kits" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            Rocket Kits
          </Link>
        </li>
        <li>
          <Link to="/category/engines" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            Engines
          </Link>
        </li>
        <li>
          <Link to="/category/tools" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            Tools
          </Link>
        </li>
        <li>
          <Link to="/category/materials" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            Materials
          </Link>
        </li>
        <li>
          <Link to="/category/ukroc" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            UKROC
          </Link>
        </li>
        <li>
          <Link to="/category/accessories" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            Accessories
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Categories;
