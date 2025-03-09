
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

interface AdminCategoriesProps {
  products: Product[];
}

const AdminCategories: React.FC<AdminCategoriesProps> = ({ products }) => {
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { handleFileUpload } = useAdmin();
  const { toast } = useToast();

  const handleEditImage = (categorySlug: string) => {
    const category = CATEGORY_MAP[categorySlug];
    const currentImageUrl = CATEGORY_IMAGES[categorySlug as keyof typeof CATEGORY_IMAGES] || "";
    
    setCurrentCategory(categorySlug);
    setImageUrl(currentImageUrl);
    setImagePreview(currentImageUrl);
    setImageFile(null);
    setIsImageDialogOpen(true);
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
    // In a real application, this would save to a database
    // For now, we'll just close the dialog and show a message
    const newImagePath = imagePreview || imageUrl;
    console.log(`Updated image for ${currentCategory} to: ${newImagePath}`);
    setIsImageDialogOpen(false);
    
    // This would update the image in a real application
    // For demonstration purposes only
    toast({
      title: "Image updated",
      description: `Image for ${CATEGORY_MAP[currentCategory]} has been updated successfully`,
    });
    
    // In a real app, we'd update the database here
    // For demo purposes, we're just showing a success message
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
    </div>
  );
};

export default AdminCategories;
