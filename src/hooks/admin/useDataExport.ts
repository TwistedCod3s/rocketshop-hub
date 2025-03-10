
import { Product, CouponCode } from "@/types/shop";
import { useToast } from "@/hooks/use-toast";
import { 
  CATEGORY_IMAGES_KEY, 
  SUBCATEGORIES_KEY, 
  COUPONS_KEY 
} from "./adminUtils";

export function useDataExport() {
  const { toast } = useToast();

  // Function to export all admin data to JSON
  const exportDataToJson = async (products: Product[], categoryImages: Record<string, string>, 
    subcategories: Record<string, string[]>, coupons: CouponCode[]) => {
    
    try {
      console.log("Exporting data to JSON...");
      
      // Create a data object with all the site content
      const exportData = {
        timestamp: new Date().toISOString(),
        products,
        categoryImages,
        subcategories,
        coupons
      };
      
      // Convert to JSON
      const jsonData = JSON.stringify(exportData, null, 2);
      
      // Create a Blob with the JSON data
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create a download link and trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.download = `rocketry-shop-backup-${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Data exported successfully",
        description: "Your site data has been exported as JSON"
      });
      
      return true;
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
      return false;
    }
  };
  
  // Function to import data from JSON
  const importDataFromJson = async (file: File, 
    setProducts: (products: Product[]) => void,
    updateCategoryImage: (categorySlug: string, imageUrl: string) => void,
    updateSubcategories: (category: string, subcategories: string[]) => void,
    updateCoupon: (coupon: CouponCode) => void) => {
    
    try {
      console.log("Importing data from JSON...");
      
      // Read the file
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Validate the data structure
      if (!data.products || !data.categoryImages || !data.subcategories || !data.coupons) {
        throw new Error("Invalid data format");
      }
      
      // Import products
      if (Array.isArray(data.products)) {
        console.log(`Importing ${data.products.length} products`);
        setProducts(data.products);
      }
      
      // Import category images
      if (typeof data.categoryImages === 'object') {
        console.log(`Importing category images`);
        Object.entries(data.categoryImages).forEach(([categorySlug, imageUrl]) => {
          updateCategoryImage(categorySlug, imageUrl as string);
        });
      }
      
      // Import subcategories
      if (typeof data.subcategories === 'object') {
        console.log(`Importing subcategories`);
        Object.entries(data.subcategories).forEach(([category, subcats]) => {
          updateSubcategories(category, subcats as string[]);
        });
      }
      
      // Import coupons
      if (Array.isArray(data.coupons)) {
        console.log(`Importing ${data.coupons.length} coupons`);
        data.coupons.forEach(coupon => {
          updateCoupon(coupon);
        });
      }
      
      toast({
        title: "Data imported successfully",
        description: "Your site data has been imported from the JSON file"
      });
      
      return true;
    } catch (error) {
      console.error("Error importing data:", error);
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    exportDataToJson,
    importDataFromJson
  };
}
