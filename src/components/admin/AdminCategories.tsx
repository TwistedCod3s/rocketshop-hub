
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/shop";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CATEGORY_IMAGES } from "@/components/home/CategorySection";
import { CATEGORY_MAP } from "@/constants/categories";
import { useAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import { useShopContext } from "@/context/ShopContext";
import { X, Plus } from "lucide-react";

interface AdminCategoriesProps {
  products: Product[];
}

const AdminCategories: React.FC<AdminCategoriesProps> = ({ products }) => {
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isSubcategoryDialogOpen, setIsSubcategoryDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("");
  const [currentCategoryName, setCurrentCategoryName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [subcategoryList, setSubcategoryList] = useState<string[]>([]);
  const [newSubcategory, setNewSubcategory] = useState("");
  
  const { handleFileUpload, updateCategoryImage, categoryImages, subcategories, updateSubcategories } = useAdmin();
  const { toast } = useToast();
  const { updateProduct } = useShopContext();

  const handleEditImage = (categorySlug: string) => {
    const category = CATEGORY_MAP[categorySlug];
    // Use custom image if available, otherwise use default
    const currentImageUrl = categoryImages[categorySlug] || 
                           CATEGORY_IMAGES[categorySlug as keyof typeof CATEGORY_IMAGES] || "";
    
    setCurrentCategory(categorySlug);
    setImageUrl(currentImageUrl);
    setImagePreview(currentImageUrl);
    setImageFile(null);
    setIsImageDialogOpen(true);
  };

  const handleEditSubcategories = (categorySlug: string) => {
    const categoryName = CATEGORY_MAP[categorySlug];
    setCurrentCategory(categorySlug);
    setCurrentCategoryName(categoryName);
    setSubcategoryList([...(subcategories[categoryName] || [])]);
    setIsSubcategoryDialogOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImageFile(file);
    try {
      const base64 = await handleFileUpload(file);
      setImagePreview(base64);
    } catch (err) {
      console.error("Error converting file to base64:", err);
      toast({
        title: "Error",
        description: "Failed to process the image file",
        variant: "destructive",
      });
    }
  };

  const handleSaveImage = () => {
    const newImagePath = imagePreview || imageUrl;
    
    // Update the category image
    updateCategoryImage(currentCategory, newImagePath);
    
    console.log(`Updated image for ${currentCategory} to: ${newImagePath}`);
    setIsImageDialogOpen(false);
    
    toast({
      title: "Image updated",
      description: `Image for ${CATEGORY_MAP[currentCategory]} has been updated successfully`,
    });
  };

  const handleAddSubcategory = () => {
    if (newSubcategory.trim() === "") return;
    
    if (!subcategoryList.includes(newSubcategory.trim())) {
      setSubcategoryList([...subcategoryList, newSubcategory.trim()]);
    }
    setNewSubcategory("");
  };

  const handleRemoveSubcategory = (subcategory: string) => {
    setSubcategoryList(subcategoryList.filter(sub => sub !== subcategory));
  };

  const handleSaveSubcategories = () => {
    // Update subcategories
    updateSubcategories(currentCategoryName, subcategoryList);
    
    // Update products with old subcategories to use new ones if needed
    const oldSubcategories = subcategories[currentCategoryName] || [];
    const removedSubcategories = oldSubcategories.filter(sub => !subcategoryList.includes(sub));
    
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
    
    setIsSubcategoryDialogOpen(false);
    
    toast({
      title: "Subcategories updated",
      description: `Subcategories for ${currentCategoryName} have been updated successfully`,
    });
  };

  // Get the appropriate image URL for a category
  const getCategoryImage = (slug: string) => {
    return categoryImages[slug] || 
           CATEGORY_IMAGES[slug as keyof typeof CATEGORY_IMAGES] || "";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <p className="text-gray-500 mb-4">Manage product categories here. Add, edit, or remove categories to organize your products.</p>
      
      <div className="border rounded-md divide-y">
        {Object.entries(CATEGORY_MAP).map(([slug, name]) => (
          <div key={slug} className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                <img 
                  src={getCategoryImage(slug)} 
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
                  <span>{products.filter(p => p.category === name).length} products</span>
                  <span className="mx-2">•</span>
                  <span>{subcategories[name]?.length || 0} subcategories</span>
                </div>
              </div>
            </div>
            <div>
              <Button 
                variant="outline" 
                size="sm" 
                className="mr-2"
                onClick={() => handleEditImage(slug)}
              >
                Change Image
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="mr-2"
                onClick={() => handleEditSubcategories(slug)}
              >
                Manage Subcategories
              </Button>
              <Button variant="ghost" size="sm" className="text-red-500">
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Image Upload Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Category Image</DialogTitle>
            <DialogDescription>
              Update the image for {currentCategory ? CATEGORY_MAP[currentCategory] : "this category"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setImagePreview(e.target.value);
                  setImageFile(null);
                }}
                placeholder="Enter image URL or path"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image-file">Or upload an image</Label>
              <Input
                id="image-file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              <p className="text-xs text-gray-500">Supported formats: JPEG, PNG, GIF, WebP</p>
            </div>
            
            {imagePreview && (
              <div className="mt-4">
                <Label>Preview</Label>
                <div className="mt-2 w-full h-40 rounded-md overflow-hidden bg-gray-100">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImageDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveImage}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Subcategories Dialog */}
      <Dialog open={isSubcategoryDialogOpen} onOpenChange={setIsSubcategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Subcategories</DialogTitle>
            <DialogDescription>
              Add or remove subcategories for {currentCategoryName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex space-x-2">
              <Input
                value={newSubcategory}
                onChange={(e) => setNewSubcategory(e.target.value)}
                placeholder="Enter subcategory name"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubcategory();
                  }
                }}
              />
              <Button type="button" onClick={handleAddSubcategory}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {subcategoryList.length === 0 ? (
                <p className="text-sm text-gray-500">No subcategories added yet.</p>
              ) : (
                subcategoryList.map((subcategory) => (
                  <div key={subcategory} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>{subcategory}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveSubcategory(subcategory)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubcategoryDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveSubcategories}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategories;
