
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const categories = [
  {
    name: "Rocket Kits",
    path: "/category/rocket-kits",
    description: "Ready-to-build model rockets for all skill levels",
    image: "/public/placeholder.svg",
    color: "bg-blue-50",
    textColor: "text-blue-700",
  },
  {
    name: "Engines",
    path: "/category/engines",
    description: "Reliable rocket engines for safe launches",
    image: "/public/placeholder.svg",
    color: "bg-indigo-50",
    textColor: "text-indigo-700",
  },
  {
    name: "Materials",
    path: "/category/materials",
    description: "Essential materials for rocket building",
    image: "/public/placeholder.svg",
    color: "bg-purple-50",
    textColor: "text-purple-700",
  },
  {
    name: "Tools",
    path: "/category/tools",
    description: "Launch pads, controllers, and measurement tools",
    image: "/public/placeholder.svg",
    color: "bg-green-50",
    textColor: "text-green-700",
  },
  {
    name: "UKROC",
    path: "/category/ukroc",
    description: "UK Rocketry Challenge materials and resources",
    image: "/public/placeholder.svg",
    color: "bg-amber-50",
    textColor: "text-amber-700",
  },
  {
    name: "Accessories",
    path: "/category/accessories",
    description: "Additional components and accessories",
    image: "/public/placeholder.svg",
    color: "bg-red-50",
    textColor: "text-red-700",
  },
];

const CategorySection: React.FC = () => {
  return (
    <div className="py-16 bg-rocketry-gray/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="text-3xl font-semibold text-foreground">Product Categories</h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Browse our comprehensive range of rocketry products designed specifically for educational use.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link 
              key={category.path} 
              to={category.path}
              className={cn(
                "group relative overflow-hidden rounded-xl transition-all hover:-translate-y-1 hover:shadow-lg",
                "animate-fade-up",
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={cn(
                "h-full p-6 transition-colors",
                category.color,
                "group-hover:bg-white"
              )}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className={cn(
                      "text-xl font-medium mb-2 transition-colors",
                      category.textColor,
                      "group-hover:text-rocketry-navy"
                    )}>
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {category.description}
                    </p>
                    <span className="inline-flex items-center text-sm font-medium text-rocketry-navy">
                      Browse Products
                      <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                  <div className="w-20 h-20 flex-shrink-0">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySection;
