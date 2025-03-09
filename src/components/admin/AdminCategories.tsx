
import React from "react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/shop";

// Sample categories for the admin panel
const CATEGORIES = [
  "Rockets",
  "Kits",
  "Components",
  "Tools",
  "Books",
  "Accessories"
];

interface AdminCategoriesProps {
  products: Product[];
}

const AdminCategories: React.FC<AdminCategoriesProps> = ({ products }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <p className="text-gray-500 mb-4">Manage product categories here. Add, edit, or remove categories to organize your products.</p>
      
      <div className="border rounded-md divide-y">
        {CATEGORIES.map((category, index) => (
          <div key={index} className="flex items-center justify-between p-4">
            <div>
              <h3 className="font-medium">{category}</h3>
              <p className="text-sm text-gray-500">
                {products.filter(p => p.category === category).length} products
              </p>
            </div>
            <div>
              <Button variant="ghost" size="sm" className="mr-2">
                Edit
              </Button>
              <Button variant="ghost" size="sm" className="text-red-500">
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;
