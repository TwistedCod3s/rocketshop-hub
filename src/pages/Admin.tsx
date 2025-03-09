import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLogin from "@/components/admin/AdminLogin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, PackageOpen, LayoutGrid, Users, Settings, LogOut } from "lucide-react";
import ProductForm from "@/components/admin/ProductForm";
import { useShopContext } from "@/context/ShopContext";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
      {/* Sidebar */}
      <div className="w-64 bg-rocketry-navy text-white p-6 flex flex-col">
        <div className="mb-10">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
        
        <nav className="space-y-1 flex-1">
          <button 
            className={`flex items-center w-full p-3 rounded-md text-left ${
              activeSection === "products" ? "bg-white/10" : "hover:bg-white/5"
            }`}
            onClick={() => setActiveSection("products")}
          >
            <PackageOpen className="h-5 w-5 mr-3" />
            Products
          </button>
          <button 
            className={`flex items-center w-full p-3 rounded-md text-left ${
              activeSection === "categories" ? "bg-white/10" : "hover:bg-white/5"
            }`}
            onClick={() => setActiveSection("categories")}
          >
            <LayoutGrid className="h-5 w-5 mr-3" />
            Categories
          </button>
          <button 
            className={`flex items-center w-full p-3 rounded-md text-left ${
              activeSection === "customers" ? "bg-white/10" : "hover:bg-white/5"
            }`}
            onClick={() => setActiveSection("customers")}
          >
            <Users className="h-5 w-5 mr-3" />
            Customers
          </button>
          <button 
            className={`flex items-center w-full p-3 rounded-md text-left ${
              activeSection === "settings" ? "bg-white/10" : "hover:bg-white/5"
            }`}
            onClick={() => setActiveSection("settings")}
          >
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </button>
        </nav>
        
        <div className="pt-6 mt-auto border-t border-white/10">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-white hover:bg-white/10 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start mt-4 border-white text-white hover:bg-white/10 hover:text-white"
            onClick={() => navigate("/")}
          >
            Return to Site
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">
              {activeSection === "products" && "Products"}
              {activeSection === "categories" && "Categories"}
              {activeSection === "customers" && "Customers"}
              {activeSection === "settings" && "Settings"}
            </h2>
            {activeSection === "products" && (
              <Button onClick={() => setShowProductForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Product
              </Button>
            )}
            {activeSection === "categories" && (
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Category
              </Button>
            )}
          </div>
          
          {activeSection === "products" && (
            <Tabs defaultValue="all">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Products</TabsTrigger>
                <TabsTrigger value="featured">Featured Products</TabsTrigger>
                <TabsTrigger value="out-of-stock">Out of Stock</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 px-4 text-left">Product</th>
                        <th className="py-3 px-4 text-left">Price</th>
                        <th className="py-3 px-4 text-left">Category</th>
                        <th className="py-3 px-4 text-left">Status</th>
                        <th className="py-3 px-4 text-left">Featured</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {products.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-4 px-4 text-center text-gray-500">
                            No products found
                          </td>
                        </tr>
                      ) : (
                        products.map((product) => (
                          <tr key={product.id}>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded bg-gray-100 mr-3 flex-shrink-0 overflow-hidden">
                                  {product.images?.length > 0 && (
                                    <img 
                                      src={product.images[0]} 
                                      alt={product.name} 
                                      className="h-full w-full object-cover"
                                    />
                                  )}
                                </div>
                                <div>
                                  <div className="font-medium">{product.name}</div>
                                  <div className="text-sm text-gray-500">ID: {product.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">£{product.price.toFixed(2)}</td>
                            <td className="py-3 px-4">{product.category}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                product.inStock 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <Button
                                variant={product.featured ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleToggleFeatured(product.id, !product.featured)}
                              >
                                {product.featured ? 'Featured' : 'Make Featured'}
                              </Button>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditProduct(product)}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="featured">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 px-4 text-left">Product</th>
                        <th className="py-3 px-4 text-left">Price</th>
                        <th className="py-3 px-4 text-left">Category</th>
                        <th className="py-3 px-4 text-left">Featured</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {products.filter(p => p.featured).length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-4 px-4 text-center text-gray-500">
                            No featured products
                          </td>
                        </tr>
                      ) : (
                        products.filter(p => p.featured).map((product) => (
                          <tr key={product.id}>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded bg-gray-100 mr-3 flex-shrink-0 overflow-hidden">
                                  {product.images?.length > 0 && (
                                    <img 
                                      src={product.images[0]} 
                                      alt={product.name} 
                                      className="h-full w-full object-cover"
                                    />
                                  )}
                                </div>
                                <div>
                                  <div className="font-medium">{product.name}</div>
                                  <div className="text-sm text-gray-500">ID: {product.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">£{product.price.toFixed(2)}</td>
                            <td className="py-3 px-4">{product.category}</td>
                            <td className="py-3 px-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleFeatured(product.id, false)}
                              >
                                Remove from Featured
                              </Button>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditProduct(product)}
                              >
                                Edit
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="out-of-stock">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 px-4 text-left">Product</th>
                        <th className="py-3 px-4 text-left">Price</th>
                        <th className="py-3 px-4 text-left">Category</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {products.filter(p => !p.inStock).length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-4 px-4 text-center text-gray-500">
                            No out of stock products
                          </td>
                        </tr>
                      ) : (
                        products.filter(p => !p.inStock).map((product) => (
                          <tr key={product.id}>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded bg-gray-100 mr-3 flex-shrink-0 overflow-hidden">
                                  {product.images?.length > 0 && (
                                    <img 
                                      src={product.images[0]} 
                                      alt={product.name} 
                                      className="h-full w-full object-cover"
                                    />
                                  )}
                                </div>
                                <div>
                                  <div className="font-medium">{product.name}</div>
                                  <div className="text-sm text-gray-500">ID: {product.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">£{product.price.toFixed(2)}</td>
                            <td className="py-3 px-4">{product.category}</td>
                            <td className="py-3 px-4 text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditProduct(product)}
                              >
                                Edit
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          )}
          
          {activeSection === "categories" && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-500 mb-4">Manage product categories here. Add, edit, or remove categories to organize your products.</p>
              
              <div className="border rounded-md divide-y">
                {CATEGORIES.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-4">
                    <div>
                      <h3 className="font-medium">{category}</h3>
                      <p className="text-sm text-gray-500">
                        {products.filter(p => p.category === category).length} products
                      </p>
                    </div>
                    <div>
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
            </div>
          )}
          
          {activeSection === "customers" && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-500 mb-4">View and manage customer information. Track order history and customer preferences.</p>
              
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Customers Yet</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Your customer list is empty. As customers make purchases, they will appear here.
                </p>
              </div>
            </div>
          )}
          
          {activeSection === "settings" && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-4">Store Settings</h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="store-name">Store Name</Label>
                    <Input id="store-name" defaultValue="Rocketry Store" />
                  </div>
                  <div>
                    <Label htmlFor="store-currency">Currency</Label>
                    <Select defaultValue="GBP">
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GBP">British Pound (£)</SelectItem>
                        <SelectItem value="USD">US Dollar ($)</SelectItem>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="store-description">Store Description</Label>
                  <Textarea 
                    id="store-description" 
                    defaultValue="Your one-stop shop for model rocketry supplies and equipment."
                    rows={3}
                  />
                </div>
                
                <div className="pt-4 border-t">
                  <Button>Save Settings</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Sample categories for the admin panel
const CATEGORIES = [
  "Rockets",
  "Kits",
  "Components",
  "Tools",
  "Books",
  "Accessories"
];

export default Admin;
