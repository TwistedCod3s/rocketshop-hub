
import { useCallback } from "react";
import { Product, Coupon } from "@/types/shop";
import { useToast } from "@/hooks/use-toast";

export function useDataExport() {
  const { toast } = useToast();

  // Function to export data to JSON file
  const exportDataToJson = useCallback(async (
    products: Product[],
    categoryImages: Record<string, string>,
    subcategories: Record<string, string[]>,
    coupons: Coupon[]
  ) => {
    try {
      // Create an export object with all data
      const exportData = {
        version: 1,
        timestamp: new Date().toISOString(),
        products,
        categoryImages,
        subcategories,
        coupons
      };
      
      // Convert to JSON string
      const jsonString = JSON.stringify(exportData, null, 2);
      
      // Create a blob
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      // Create a download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rocket-shop-export-${new Date().toISOString().slice(0, 10)}.json`;
      
      // Trigger download
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export successful",
        description: "Your site data has been exported successfully"
      });
      
      return true;
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your data",
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);
  
  // Function to import data from JSON file
  const importDataFromJson = useCallback(async (
    file: File,
    setProducts: (products: Product[]) => void,
    updateCategoryImage?: (categorySlug: string, imageUrl: string) => void,
    updateSubcategories?: (category: string, subcategories: string[]) => void,
    updateCoupon?: (coupon: Coupon) => void
  ) => {
    return new Promise<boolean>((resolve, reject) => {
      try {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          try {
            const result = e.target?.result;
            if (!result || typeof result !== 'string') {
              throw new Error('Failed to read file');
            }
            
            // Parse the JSON data
            const importData = JSON.parse(result);
            
            // Validate the data structure
            if (!importData.products || !Array.isArray(importData.products)) {
              throw new Error('Invalid data format: products missing or not an array');
            }
            
            // Import products
            setProducts(importData.products);
            console.log(`Imported ${importData.products.length} products`);
            
            // Import category images
            if (importData.categoryImages && typeof importData.categoryImages === 'object' && updateCategoryImage) {
              Object.entries(importData.categoryImages).forEach(([slug, imageUrl]) => {
                updateCategoryImage(slug, imageUrl as string);
              });
              console.log(`Imported category images for ${Object.keys(importData.categoryImages).length} categories`);
            }
            
            // Import subcategories
            if (importData.subcategories && typeof importData.subcategories === 'object' && updateSubcategories) {
              Object.entries(importData.subcategories).forEach(([category, subcats]) => {
                if (Array.isArray(subcats)) {
                  updateSubcategories(category, subcats);
                }
              });
              console.log(`Imported subcategories for ${Object.keys(importData.subcategories).length} categories`);
            }
            
            // Import coupons
            if (importData.coupons && Array.isArray(importData.coupons) && updateCoupon) {
              importData.coupons.forEach((coupon: Coupon) => {
                updateCoupon(coupon);
              });
              console.log(`Imported ${importData.coupons.length} coupons`);
            }
            
            resolve(true);
          } catch (error) {
            console.error("Import parsing error:", error);
            reject(error);
          }
        };
        
        reader.onerror = (error) => {
          console.error("File reading error:", error);
          reject(error);
        };
        
        // Start reading the file
        reader.readAsText(file);
        
      } catch (error) {
        console.error("Import setup error:", error);
        reject(error);
      }
    });
  }, []);
  
  return { exportDataToJson, importDataFromJson };
}
