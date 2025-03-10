
import { AlertCircle, HelpCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DeploymentInfo = () => {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">Database Information</h4>
      
      <Alert>
        <HelpCircle className="h-4 w-4" />
        <AlertTitle>How the database approach works</AlertTitle>
        <AlertDescription className="mt-2 text-sm text-muted-foreground">
          <p className="mb-2">
            When you make changes to your store, they are first saved to your browser's localStorage. 
            When you click "Save Changes" (previously "Deploy"), they are written to the database and immediately available on your site.
          </p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Make changes to your store (products, categories, etc.)</li>
            <li>Click "Save Changes" to push these changes to the database</li>
            <li>Your changes are immediately available to all users</li>
            <li>No deployment or rebuild is necessary</li>
          </ol>
        </AlertDescription>
      </Alert>
      
      <Alert variant="default" className="border-blue-200 bg-blue-50">
        <AlertCircle className="h-4 w-4 text-blue-500" />
        <AlertTitle className="text-blue-700">Initial Database Setup</AlertTitle>
        <AlertDescription className="mt-2 text-sm text-blue-700">
          <p className="mb-2">
            If this is your first time using the database approach, you'll need to initialize
            your database with your current store data.
          </p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Verify that your Supabase URL and anon key are set correctly in your environment variables</li>
            <li>Go to the Database tab in the Settings section</li>
            <li>Click "Initialize Database" to populate your database with your existing data</li>
          </ol>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default DeploymentInfo;
