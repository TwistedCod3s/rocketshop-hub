
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  ShoppingBag, 
  LayoutGrid, 
  Users, 
  Settings, 
  LogOut,
  Home,
  TagIcon,
  RefreshCw
} from "lucide-react";

const sidebarItems = [
  {
    icon: ShoppingBag,
    label: "Products",
    value: "products",
  },
  {
    icon: LayoutGrid,
    label: "Categories",
    value: "categories",
  },
  {
    icon: Users,
    label: "Customers",
    value: "customers",
  },
  {
    icon: TagIcon,
    label: "Coupons",
    value: "coupons",
  },
  {
    icon: Settings,
    label: "Settings",
    value: "settings",
  },
];

interface AdminSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  handleLogout: () => void;
  navigate: (path: string) => void;
  forceSyncDatabase: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeSection,
  setActiveSection,
  handleLogout,
  navigate,
  forceSyncDatabase,
}) => {
  return (
    <div className="w-64 bg-white border-r min-h-screen flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-rocketry-navy">Rocketry Admin</h1>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => (
            <li key={item.value}>
              <button
                onClick={() => setActiveSection(item.value)}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors",
                  activeSection === item.value
                    ? "bg-rocketry-navy text-white"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t space-y-3">
        <Button
          onClick={forceSyncDatabase}
          variant="secondary"
          className="w-full flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-800"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Sync Database
        </Button>

        <Button
          onClick={() => navigate('/')}
          variant="outline"
          className="w-full flex items-center justify-center"
        >
          <Home className="h-4 w-4 mr-2" />
          View Store
        </Button>
        
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full flex items-center justify-center"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
