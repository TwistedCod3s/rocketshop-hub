
import React from "react";
import { Button } from "@/components/ui/button";
import { PackageOpen, LayoutGrid, Users, Settings, LogOut } from "lucide-react";

interface AdminSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  handleLogout: () => void;
  navigate: (path: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  activeSection, 
  setActiveSection, 
  handleLogout, 
  navigate 
}) => {
  return (
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
  );
};

export default AdminSidebar;
