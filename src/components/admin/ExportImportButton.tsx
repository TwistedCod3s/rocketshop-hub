
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { useShopContext } from "@/context/ShopContext";
import { useDataExport } from "@/hooks/admin/useDataExport";
import { useToast } from "@/hooks/use-toast";

const ExportImportButton = () => {
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const { 
    products, 
    addProduct,
    updateProduct,
    removeProduct,
    categoryImages,
    updateCategoryImage,
    subcategories,
    updateSubcategories,
    coupons,
    updateCoupon,
    reloadAllAdminData
  } = useShopContext();
  
  const { exportDataToJson, importDataFromJson } = useDataExport();
  
  const handleExport = async () => {
    await exportDataToJson(
      products, 
      categoryImages || {}, 
      subcategories || {}, 
      coupons || []
    );
  };
  
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsImporting(true);
      try {
        // Replace products with those from the import
        const setAllProducts = (newProducts: any[]) => {
          // First, remove all current products
          [...products].forEach(product => {
            removeProduct(product.id);
          });
          
          // Then add all the new ones
          newProducts.forEach(product => {
            addProduct(product);
          });
        };
        
        await importDataFromJson(
          file, 
          setAllProducts, 
          updateCategoryImage, 
          updateSubcategories,
          updateCoupon
        );
        
        // Ensure all changes are propagated
        await reloadAllAdminData();
        
        toast({
          title: "Import complete",
          description: "The site data has been updated successfully",
        });
      } catch (error) {
        console.error("Import error:", error);
      } finally {
        setIsImporting(false);
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };
  
  return (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleExport}
        className="flex items-center"
      >
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleImportClick}
        className="flex items-center"
        disabled={isImporting}
      >
        <Upload className="mr-2 h-4 w-4" />
        {isImporting ? "Importing..." : "Import"}
      </Button>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".json"
      />
    </div>
  );
};

export default ExportImportButton;
