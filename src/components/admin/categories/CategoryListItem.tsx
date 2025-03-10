
import React from "react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/shop";

interface CategoryListItemProps {
  slug: string;
  name: string;
  image: string;
  productCount: number;
  subcategoryCount: number;
  onEditImage: (slug: string) => void;
  onEditSubcategories: (slug: string) => void;
}

const CategoryListItem: React.FC<CategoryListItemProps> = ({
  slug,
  name,
  image,
  productCount,
  subcategoryCount,
  onEditImage,
  onEditSubcategories
}) => {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100">
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
        <div>
          <h3 className="font-medium">{name}</h3>
          <div className="text-sm text-gray-500">
            <span>{productCount} products</span>
            <span className="mx-2">•</span>
            <span>{subcategoryCount} subcategories</span>
          </div>
        </div>
      </div>
      <div>
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-2"
          onClick={() => onEditImage(slug)}
        >
          Change Image
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-2"
          onClick={() => onEditSubcategories(slug)}
        >
          Manage Subcategories
        </Button>
        <Button variant="ghost" size="sm" className="text-red-500">
          Delete
        </Button>
      </div>
    </div>
  );
};

export default CategoryListItem;
