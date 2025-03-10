
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";

interface SubcategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  categoryName: string;
  currentSubcategories: string[];
  onSaveSubcategories: (subcategories: string[]) => void;
}

const SubcategoryDialog: React.FC<SubcategoryDialogProps> = ({
  isOpen,
  onOpenChange,
  categoryName,
  currentSubcategories,
  onSaveSubcategories
}) => {
  const [subcategoryList, setSubcategoryList] = useState<string[]>([]);
  const [newSubcategory, setNewSubcategory] = useState("");

  // Reset state when dialog opens with new data
  useEffect(() => {
    if (isOpen) {
      setSubcategoryList([...currentSubcategories]);
      setNewSubcategory("");
    }
  }, [isOpen, currentSubcategories]);

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

  const handleSave = () => {
    onSaveSubcategories(subcategoryList);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Subcategories</DialogTitle>
          <DialogDescription>
            Add or remove subcategories for {categoryName}
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubcategoryDialog;
