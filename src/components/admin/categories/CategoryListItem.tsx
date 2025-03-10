
import React from "react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/shop";
import { Trash2 } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CategoryListItemProps {
  slug: string;
  name: string;
  image: string;
  productCount: number;
  subcategoryCount: number;
  onEditImage: (slug: string) => void;
  onEditSubcategories: (slug: string) => void;
  onDeleteCategory?: (slug: string) => void;
}

const CategoryListItem: React.FC<CategoryListItemProps> = ({
  slug,
  name,
  image,
  productCount,
  subcategoryCount,
  onEditImage,
  onEditSubcategories,
  onDeleteCategory
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b last:border-b-0">
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
      <div className="flex items-center">
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
        
        {onDeleteCategory && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-red-500">
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the {name} category and all associated subcategories.
                  Products in this category will remain but will no longer be categorized.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => onDeleteCategory(slug)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
};

export default CategoryListItem;
