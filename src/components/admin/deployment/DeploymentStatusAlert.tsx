
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface DeploymentStatusAlertProps {
  deployHookUrl: string;
}

const DeploymentStatusAlert = ({ deployHookUrl }: DeploymentStatusAlertProps) => {
  const [pendingChanges, setPendingChanges] = useState<boolean>(
    localStorage.getItem('ROCKETRY_SHOP_CHANGES_PENDING') === 'true'
  );
  
  // Listen for changes to the pending changes flag
  useEffect(() => {
    const checkPendingChanges = () => {
      const isPending = localStorage.getItem('ROCKETRY_SHOP_CHANGES_PENDING') === 'true';
      setPendingChanges(isPending);
    };
    
    // Check initially
    checkPendingChanges();
    
    // Listen for storage events
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ROCKETRY_SHOP_CHANGES_PENDING') {
        checkPendingChanges();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also set up an interval to check periodically
    const interval = setInterval(checkPendingChanges, 5000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);
  
  if (!deployHookUrl) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Database Connection Not Configured</AlertTitle>
        <AlertDescription>
          Your database connection is not properly configured. Please set up your Supabase URL and anon key in your environment variables.
          Check the documentation for more information.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (pendingChanges) {
    return (
      <Alert className="border-amber-200 bg-amber-50">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800">Unsaved Changes</AlertTitle>
        <AlertDescription className="text-amber-700">
          You have changes that haven't been saved to the database yet. Click "Save Changes to Database" to make your changes visible to all users.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Alert className="border-green-200 bg-green-50">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertTitle className="text-green-800">Database Up to Date</AlertTitle>
      <AlertDescription className="text-green-700">
        All your changes have been saved to the database and are visible to all users.
      </AlertDescription>
    </Alert>
  );
};

export default DeploymentStatusAlert;
