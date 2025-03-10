
import React, { useState } from "react";
import { Product } from "@/types/shop";
import { CATEGORY_IMAGES } from "@/components/home/CategorySection";
import { CATEGORY_MAP } from "@/constants/categories";
import { useAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import { useShopContext } from "@/context/ShopContext";
import CategoryListItem from "./categories/CategoryListItem";
import CategoryImageDialog from "./categories/CategoryImageDialog";
import SubcategoryDialog from "./categories/SubcategoryDialog";

interface AdminCategoriesProps {
  products: Product[];
}

const AdminCategories: React.FC<AdminCategoriesProps> = ({ products }) => {
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isSubcategoryDialogOpen, setIsSubcategoryDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("");
  const [currentCategoryName, setCurrentCategoryName] = useState("");
  
  const { handleFileUpload, updateCategoryImage, categoryImages, isUpdating, reloadAllAdminData } = useAdmin();
  const { subcategories, updateSubcategories, updateProduct } = useShopContext();
  const { toast } = useToast();

  const handleEditImage = (categorySlug: string) => {
    const category = CATEGORY_MAP[categorySlug];
    setCurrentCategory(categorySlug);
    setCurrentCategoryName(category);
    setIsImageDialogOpen(true);
  };

  const handleEditSubcategories = (categorySlug: string) => {
    const categoryName = CATEGORY_MAP[categorySlug];
    setCurrentCategory(categorySlug);
    setCurrentCategoryName(categoryName);
    setIsSubcategoryDialogOpen(true);
  };

  const handleSaveImage = async (newImagePath: string) => {
    try {
      // Update the category image
      await updateCategoryImage(currentCategory, newImagePath);
      
      console.log(`Updated image for ${currentCategory} to: ${newImagePath.substring(0, 50)}...`);
      
      // Trigger a global data sync after saving
      setTimeout(() => {
        if (reloadAllAdminData) {
          reloadAllAdminData(true).then(() => {
            console.log("Completed full admin data reload after image update");
          });
        }
      }, 1000);
      
      toast({
        title: "Image updated",
        description: `Image for ${CATEGORY_MAP[currentCategory]} has been updated successfully`,
      });
      
      return true;
    } catch (error) {
      console.error("Error in handleSaveImage:", error);
      
      toast({
        title: "Error saving image",
        description: "Failed to update image. Please try again.",
        variant: "destructive"
      });
      
      return false;
    }
  };

  const handleSaveSubcategories = (newSubcategoryList: string[]) => {
    // Update subcategories
    if (updateSubcategories) {
      updateSubcategories(currentCategoryName, newSubcategoryList);
    }
    
    // Update products with old subcategories to use new ones if needed
    const oldSubcategories = subcategories?.[currentCategoryName] || [];
    const removedSubcategories = oldSubcategories.filter(sub => !newSubcategoryList.includes(sub));
    
    // If there are removed subcategories, we need to update products
    if (removedSubcategories.length > 0) {
      products.forEach(product => {
        if (product.category === currentCategoryName && product.subcategory && 
            removedSubcategories.includes(product.subcategory)) {
          // Reset subcategory for products with removed subcategories
          const updatedProduct = { ...product, subcategory: undefined };
          updateProduct(updatedProduct);
        }
      });
    }
    
    toast({
      title: "Subcategories updated",
      description: `Subcategories for ${currentCategoryName} have been updated successfully`,
    });
  };

  // Get the appropriate image URL for a category
  const getCategoryImage = (slug: string) => {
    if (categoryImages && categoryImages[slug]) {
      return categoryImages[slug];
    }
    return CATEGORY_IMAGES[slug as keyof typeof CATEGORY_IMAGES] || "";
  };

  // Get the current image for the selected category
  const getCurrentImageUrl = () => {
    if (categoryImages && categoryImages[currentCategory]) {
      return categoryImages[currentCategory];
    }
    return CATEGORY_IMAGES[currentCategory as keyof typeof CATEGORY_IMAGES] || "";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <p className="text-gray-500 mb-4">Manage product categories here. Add, edit, or remove categories to organize your products.</p>
      
      <div className="border rounded-md divide-y">
        {Object.entries(CATEGORY_MAP).map(([slug, name]) => (
          <CategoryListItem
            key={slug}
            slug={slug}
            name={name}
            image={getCategoryImage(slug)}
            productCount={products.filter(p => p.category === name).length}
            subcategoryCount={subcategories?.[name]?.length || 0}
            onEditImage={handleEditImage}
            onEditSubcategories={handleEditSubcategories}
          />
        ))}
      </div>

      {/* Image Upload Dialog */}
      <CategoryImageDialog
        isOpen={isImageDialogOpen}
        onOpenChange={setIsImageDialogOpen}
        categoryName={currentCategoryName}
        currentImageUrl={getCurrentImageUrl()}
        onSaveImage={handleSaveImage}
        handleFileUpload={handleFileUpload}
      />
      
      {/* Subcategories Dialog */}
      <SubcategoryDialog
        isOpen={isSubcategoryDialogOpen}
        onOpenChange={setIsSubcategoryDialogOpen}
        categoryName={currentCategoryName}
        currentSubcategories={subcategories?.[currentCategoryName] || []}
        onSaveSubcategories={handleSaveSubcategories}
      />
    </div>
  );
};

export default AdminCategories;
