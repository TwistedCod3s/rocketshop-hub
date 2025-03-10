
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface CategoryImageDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  categoryName: string;
  currentImageUrl: string;
  onSaveImage: (imageUrl: string) => void;
  handleFileUpload: (file: File) => Promise<string>;
}

const CategoryImageDialog: React.FC<CategoryImageDialogProps> = ({
  isOpen, 
  onOpenChange,
  categoryName,
  currentImageUrl,
  onSaveImage,
  handleFileUpload
}) => {
  const [imageUrl, setImageUrl] = useState(currentImageUrl);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(currentImageUrl);
  const [isSaving, setIsSaving] = useState(false);

  // Reset state when dialog opens with new data
  useEffect(() => {
    if (isOpen) {
      setImageUrl(currentImageUrl);
      setImagePreview(currentImageUrl);
      setImageFile(null);
      setIsSaving(false);
    }
  }, [isOpen, currentImageUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImageFile(file);
    try {
      const base64 = await handleFileUpload(file);
      setImagePreview(base64);
    } catch (err) {
      console.error("Error converting file to base64:", err);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveImage(imagePreview || imageUrl);
      // Force a small delay to ensure database operations complete
      setTimeout(() => {
        onOpenChange(false);
        setIsSaving(false);
      }, 500);
    } catch (error) {
      console.error("Error saving image:", error);
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Category Image</DialogTitle>
          <DialogDescription>
            Update the image for {categoryName}
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
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryImageDialog;
