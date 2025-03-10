
import { AlertCircle, HelpCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DeploymentInfo = () => {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">Deployment Information</h4>
      
      <Alert>
        <HelpCircle className="h-4 w-4" />
        <AlertTitle>How deployments work</AlertTitle>
        <AlertDescription className="mt-2 text-sm text-muted-foreground">
          <p className="mb-2">
            When you make changes to your store, they are saved to your browser's localStorage. 
            When you deploy these changes, they are written to the codebase and a new build is triggered.
          </p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Set up your Vercel deployment webhook URL in the field above</li>
            <li>Make changes to your store (products, categories, etc.)</li>
            <li>Click "Deploy Now" to push these changes to your live site</li>
          </ol>
        </AlertDescription>
      </Alert>
      
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important: Configure Vercel Environment</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="mb-2">
            You must set <code className="bg-gray-100 px-1 py-0.5 rounded">VERCEL_FILESYSTEM_API_ENABLED=true</code> in your 
            Vercel project's environment variables for file system access to work.
          </p>
          <p>
            Make sure your Vercel deployment webhook has proper permissions to trigger builds.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default DeploymentInfo;
