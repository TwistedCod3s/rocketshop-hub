
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLogin from "@/components/admin/AdminLogin";
import { useShopContext } from "@/context/ShopContext";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminCategories from "@/components/admin/AdminCategories";
import AdminCustomers from "@/components/admin/AdminCustomers";
import AdminSettings from "@/components/admin/AdminSettings";
import ProductForm from "@/components/admin/ProductForm";
import CouponManagement from "@/components/admin/CouponManagement";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { products, addProduct, updateProduct, removeProduct, updateFeaturedProducts } = useShopContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [activeSection, setActiveSection] = useState("products");
  
  const handleLogin = (success) => {
    if (success) {
      setIsAuthenticated(true);
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard",
      });
    } else {
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };
  
  const handleProductSubmit = (product) => {
    if (productToEdit) {
      updateProduct(product);
      toast({
        title: "Product updated",
        description: `${product.name} has been updated successfully`,
      });
    } else {
      addProduct(product);
      toast({
        title: "Product added",
        description: `${product.name} has been added successfully`,
      });
    }
    setShowProductForm(false);
    setProductToEdit(null);
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
  
  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }
  
  if (showProductForm) {
    return (
      <ProductForm 
        product={productToEdit} 
        onSubmit={handleProductSubmit} 
        onCancel={() => {
          setShowProductForm(false);
          setProductToEdit(null);
        }}
      />
    );
  }
  
  return (
    <div className="min-h-screen flex">
      <AdminSidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        handleLogout={handleLogout}
        navigate={navigate}
      />
      
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">
              {activeSection === "products" && "Products"}
              {activeSection === "categories" && "Categories"}
              {activeSection === "customers" && "Customers"}
              {activeSection === "settings" && "Settings"}
              {activeSection === "coupons" && "Coupon Management"}
            </h2>
            
            {activeSection === "products" && (
              <button 
                onClick={() => setShowProductForm(true)}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0">
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
                Add New Product
              </button>
            )}
            
            {activeSection === "categories" && (
              <button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0">
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
                Add New Category
              </button>
            )}
          </div>
          
          {activeSection === "products" && (
            <AdminProducts 
              products={products}
              handleEditProduct={handleEditProduct}
              handleDeleteProduct={handleDeleteProduct}
              handleToggleFeatured={handleToggleFeatured}
            />
          )}
          
          {activeSection === "categories" && (
            <AdminCategories products={products} />
          )}
          
          {activeSection === "customers" && (
            <AdminCustomers />
          )}
          
          {activeSection === "settings" && (
            <AdminSettings />
          )}
          
          {activeSection === "coupons" && (
            <CouponManagement />
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
