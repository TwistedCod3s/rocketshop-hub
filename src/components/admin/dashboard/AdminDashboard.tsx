
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShopContext } from "@/context/ShopContext";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminContent from "@/components/admin/dashboard/AdminContent";

interface AdminDashboardProps {
  handleLogout: () => void;
  setShowProductForm: (show: boolean) => void;
  setProductToEdit: (product: any) => void;
}

const AdminDashboard = ({ 
  handleLogout, 
  setShowProductForm, 
  setProductToEdit 
}: AdminDashboardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    products, 
    removeProduct, 
    updateFeaturedProducts,
    reloadAllAdminData,
    triggerDeployment,
    isDeploying,
    autoDeployEnabled,
    toggleAutoDeploy
  } = useShopContext();
  
  const [activeSection, setActiveSection] = useState("products");
  const [isSyncing, setIsSyncing] = useState(false);
  
  const forceSyncDatabase = async () => {
    setIsSyncing(true);
    
    // Force reload all admin data
    try {
      await reloadAllAdminData(true); // true to trigger deployment if auto-deploy is enabled
      
      toast({
        title: "Database synchronized",
        description: "All changes have been pushed to all users",
      });
    } catch (error) {
      toast({
        title: "Sync failed",
        description: "There was an error synchronizing the database",
        variant: "destructive",
      });
      console.error("Error syncing database:", error);
    } finally {
      setIsSyncing(false);
    }
  };
  
  const handleEditProduct = (product) => {
    setProductToEdit(product);
    setShowProductForm(true);
  };
  
  const handleDeleteProduct = (productId) => {
    removeProduct(productId);
    toast({
      title: "Product deleted",
      description: "The product has been deleted successfully",
    });
  };
  
  const handleToggleFeatured = (productId, isFeatured) => {
    updateFeaturedProducts(productId, isFeatured);
    toast({
      title: isFeatured ? "Added to featured" : "Removed from featured",
      description: `Product has been ${isFeatured ? "added to" : "removed from"} featured products`,
    });
  };
  
  // Wrap triggerDeployment to match the expected type
  const handleTriggerDeployment = async () => {
    if (triggerDeployment) {
      return await triggerDeployment();
    }
    return false;
  };
  
  return (
    <div className="min-h-screen flex">
      <AdminSidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        handleLogout={handleLogout}
        navigate={navigate}
        forceSyncDatabase={forceSyncDatabase}
        triggerDeployment={handleTriggerDeployment}
        isDeploying={isDeploying}
        autoDeployEnabled={autoDeployEnabled}
        toggleAutoDeploy={toggleAutoDeploy}
      />
      
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-8">
          <AdminContent 
            activeSection={activeSection}
            products={products}
            handleEditProduct={handleEditProduct}
            handleDeleteProduct={handleDeleteProduct}
            handleToggleFeatured={handleToggleFeatured}
            setShowProductForm={setShowProductForm}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
