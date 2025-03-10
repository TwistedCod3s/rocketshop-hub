
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
            <li>Check deployment status in your Vercel dashboard</li>
          </ol>
        </AlertDescription>
      </Alert>
      
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important: Required Vercel Configuration</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="mb-2">
            You <strong>must</strong> set <code className="bg-gray-100 px-1 py-0.5 rounded">VERCEL_FILESYSTEM_API_ENABLED=true</code> in your 
            Vercel project's Environment Variables (not just in vercel.json).
          </p>
          <p className="mb-2">
            Go to your Vercel project dashboard → Settings → Environment Variables and add:
            <br />
            <code className="bg-gray-100 px-1 py-0.5 rounded block mt-1 mb-1">Name: VERCEL_FILESYSTEM_API_ENABLED</code>
            <code className="bg-gray-100 px-1 py-0.5 rounded block">Value: true</code>
          </p>
          <p className="mb-2">
            After adding this environment variable, redeploy your project or create a new deployment.
          </p>
          <p>
            Ensure your Vercel project Git integration is properly set up if you're using the deployment webhook.
          </p>
        </AlertDescription>
      </Alert>
      
      <Alert>
        <HelpCircle className="h-4 w-4" />
        <AlertTitle>Troubleshooting</AlertTitle>
        <AlertDescription className="mt-2 text-sm text-muted-foreground">
          <p className="mb-2">If you're experiencing issues with deployments:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Verify the <code className="bg-gray-100 px-1 py-0.5 rounded">VERCEL_FILESYSTEM_API_ENABLED</code> variable is set</li>
            <li>Check your deployment logs in the Vercel dashboard for specific errors</li>
            <li>Ensure your Vercel project is configured to use the Node.js 18.x runtime or later</li>
            <li>Try manually deploying from the Vercel dashboard first before using the webhook</li>
          </ol>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default DeploymentInfo;
