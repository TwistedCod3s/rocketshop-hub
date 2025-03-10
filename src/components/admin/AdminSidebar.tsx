
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Settings, 
  PackageOpen, 
  Users, 
  Tag, 
  LogOut, 
  RefreshCw, 
  Upload,
  Layers
} from "lucide-react";

// Define the props interface
interface AdminSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  handleLogout: () => void;
  navigate: ReturnType<typeof useNavigate>;
  forceSyncDatabase: () => void;
  isDeploying?: boolean;
  triggerDeployment?: () => Promise<boolean>;
  autoDeployEnabled?: boolean;
  toggleAutoDeploy?: (enabled: boolean) => void;
}

const AdminSidebar = ({ 
  activeSection, 
  setActiveSection, 
  handleLogout, 
  navigate, 
  forceSyncDatabase,
  isDeploying,
  triggerDeployment,
  autoDeployEnabled = false,
  toggleAutoDeploy
}: AdminSidebarProps) => {
  return (
    <div className="w-64 bg-gray-900 text-white p-6 shadow-lg flex flex-col h-screen">
      <div className="flex items-center mb-8">
        <PackageOpen className="h-8 w-8 mr-3" />
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>

      <nav className="flex-1 space-y-2">
        <button
          onClick={() => setActiveSection("products")}
          className={`w-full text-left py-2 px-3 rounded flex items-center space-x-3 ${
            activeSection === "products" ? "bg-gray-700" : "hover:bg-gray-800"
          }`}
        >
          <PackageOpen className="h-5 w-5" />
          <span>Products</span>
        </button>

        <button
          onClick={() => setActiveSection("categories")}
          className={`w-full text-left py-2 px-3 rounded flex items-center space-x-3 ${
            activeSection === "categories" ? "bg-gray-700" : "hover:bg-gray-800"
          }`}
        >
          <Tag className="h-5 w-5" />
          <span>Categories</span>
        </button>

        <button
          onClick={() => setActiveSection("customers")}
          className={`w-full text-left py-2 px-3 rounded flex items-center space-x-3 ${
            activeSection === "customers" ? "bg-gray-700" : "hover:bg-gray-800"
          }`}
        >
          <Users className="h-5 w-5" />
          <span>Customers</span>
        </button>

        <button
          onClick={() => setActiveSection("coupons")}
          className={`w-full text-left py-2 px-3 rounded flex items-center space-x-3 ${
            activeSection === "coupons" ? "bg-gray-700" : "hover:bg-gray-800"
          }`}
        >
          <Layers className="h-5 w-5" />
          <span>Coupons</span>
        </button>

        <button
          onClick={() => setActiveSection("settings")}
          className={`w-full text-left py-2 px-3 rounded flex items-center space-x-3 ${
            activeSection === "settings" ? "bg-gray-700" : "hover:bg-gray-800"
          }`}
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </button>
      </nav>

      <Separator className="my-6 bg-gray-700" />

      <div className="space-y-4">
        <Button 
          variant="outline" 
          className="w-full bg-gray-800 hover:bg-gray-700 border-gray-700 text-white"
          onClick={forceSyncDatabase}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Sync Database
        </Button>
        
        {triggerDeployment && (
          <Button 
            variant="outline" 
            className="w-full bg-gray-800 hover:bg-gray-700 border-gray-700 text-white"
            onClick={triggerDeployment}
            disabled={isDeploying}
          >
            <Upload className="w-4 h-4 mr-2" />
            {isDeploying ? 'Deploying...' : 'Deploy Now'}
          </Button>
        )}
        
        {toggleAutoDeploy && (
          <div className="flex items-center justify-between py-2 px-2 rounded">
            <div className="flex flex-col">
              <span className="text-sm">Auto-Deploy</span>
              <span className="text-xs text-gray-400">Deploy on changes</span>
            </div>
            <Switch 
              checked={autoDeployEnabled} 
              onCheckedChange={toggleAutoDeploy} 
            />
          </div>
        )}
        
        <Button 
          variant="destructive" 
          className="w-full" 
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
        
        <div className="text-xs text-gray-500 mt-4 text-center">
          Version 2.0.0
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
