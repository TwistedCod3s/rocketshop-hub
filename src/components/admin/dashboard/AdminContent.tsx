
import { Button } from "@/components/ui/button";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminCategories from "@/components/admin/AdminCategories";
import AdminCustomers from "@/components/admin/AdminCustomers";
import AdminSettings from "@/components/admin/AdminSettings";
import CouponManagement from "@/components/admin/CouponManagement";
import { Product } from "@/types/shop";

interface AdminContentProps {
  activeSection: string;
  products: Product[];
  handleEditProduct: (product: Product) => void;
  handleDeleteProduct: (productId: string) => void;
  handleToggleFeatured: (productId: string, isFeatured: boolean) => void;
  setShowProductForm: (show: boolean) => void;
}

const AdminContent = ({
  activeSection,
  products,
  handleEditProduct,
  handleDeleteProduct,
  handleToggleFeatured,
  setShowProductForm
}: AdminContentProps) => {
  
  const renderSectionTitle = () => {
    switch (activeSection) {
      case "products": return "Products";
      case "categories": return "Categories";
      case "customers": return "Customers";
      case "settings": return "Settings";
      case "coupons": return "Coupon Management";
      default: return "";
    }
  };
  
  const renderActionButton = () => {
    if (activeSection === "products") {
      return (
        <Button 
          onClick={() => setShowProductForm(true)}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0">
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          Add New Product
        </Button>
      );
    }
    
    if (activeSection === "categories") {
      return (
        <Button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0">
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          Add New Category
        </Button>
      );
    }
    
    return null;
  };
  
  const renderContent = () => {
    switch (activeSection) {
      case "products":
        return (
          <AdminProducts 
            products={products}
            handleEditProduct={handleEditProduct}
            handleDeleteProduct={handleDeleteProduct}
            handleToggleFeatured={handleToggleFeatured}
          />
        );
      
      case "categories":
        return <AdminCategories products={products} />;
      
      case "customers":
        return <AdminCustomers />;
      
      case "settings":
        return <AdminSettings />;
      
      case "coupons":
        return <CouponManagement />;
      
      default:
        return null;
    }
  };
  
  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">
          {renderSectionTitle()}
        </h2>
        
        {renderActionButton()}
      </div>
      
      {renderContent()}
    </>
  );
};

export default AdminContent;
