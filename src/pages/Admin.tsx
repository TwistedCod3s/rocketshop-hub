
import { useState, useEffect } from "react";
import AdminLogin from "@/components/admin/AdminLogin";
import { useShopContext } from "@/context/ShopContext";
import { useToast } from "@/hooks/use-toast";
import AdminDashboard from "@/components/admin/dashboard/AdminDashboard";
import ProductForm from "@/components/admin/ProductForm";

const Admin = () => {
  const { toast } = useToast();
  const { 
    isAdmin,
    tryAdminLogin,
    addProduct,
    updateProduct
  } = useShopContext();
  
  const [isAuthenticated, setIsAuthenticated] = useState(isAdmin);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  
  // Sync with global admin state
  useEffect(() => {
    setIsAuthenticated(isAdmin);
  }, [isAdmin]);
  
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
    <AdminDashboard 
      handleLogout={handleLogout}
      setShowProductForm={setShowProductForm}
      setProductToEdit={setProductToEdit}
    />
  );
};

export default Admin;
