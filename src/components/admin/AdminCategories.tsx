
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/shop";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CATEGORY_IMAGES } from "@/components/home/CategorySection";
import { CATEGORY_MAP } from "@/constants/categories";

interface AdminCategoriesProps {
  products: Product[];
}

const AdminCategories: React.FC<AdminCategoriesProps> = ({ products }) => {
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleEditImage = (categorySlug: string) => {
    const category = CATEGORY_MAP[categorySlug];
    const currentImageUrl = CATEGORY_IMAGES[categorySlug as keyof typeof CATEGORY_IMAGES] || "";
    
    setCurrentCategory(categorySlug);
    setImageUrl(currentImageUrl);
    setIsImageDialogOpen(true);
  };

  const handleSaveImage = () => {
    // In a real application, this would save to a database
    // For now, we'll just close the dialog and show a message
    console.log(`Updated image for ${currentCategory} to: ${imageUrl}`);
    setIsImageDialogOpen(false);
    
    // This would update the image in a real application
    // For demonstration purposes only
    alert(`Image URL for ${CATEGORY_MAP[currentCategory]} would be updated to: ${imageUrl}`);
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
                  src={CATEGORY_IMAGES[slug as keyof typeof CATEGORY_IMAGES] || ""} 
                  alt={name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div>
                <h3 className="font-medium">{name}</h3>
                <p className="text-sm text-gray-500">
                  {products.filter(p => p.category === name).length} products
                </p>
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
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL or path"
              />
            </div>
            
            {imageUrl && (
              <div className="mt-4">
                <Label>Preview</Label>
                <div className="mt-2 w-full h-40 rounded-md overflow-hidden bg-gray-100">
                  <img 
                    src={imageUrl} 
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
    </div>
  );
};

export default AdminCategories;
