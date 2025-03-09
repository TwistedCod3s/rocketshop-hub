
import React from "react";
import { Link } from "react-router-dom";

const Categories: React.FC = () => {
  return (
    <div>
      <h3 className="font-semibold mb-6">Categories</h3>
      <ul className="space-y-3">
        <li>
          <Link to="/category/rockets" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            Rockets
          </Link>
        </li>
        <li>
          <Link to="/category/kits" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            Kits
          </Link>
        </li>
        <li>
          <Link to="/category/components" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            Components
          </Link>
        </li>
        <li>
          <Link to="/category/tools" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            Tools
          </Link>
        </li>
        <li>
          <Link to="/category/curriculum" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            Curriculum
          </Link>
        </li>
        <li>
          <Link to="/category/books" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            Books
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Categories;
