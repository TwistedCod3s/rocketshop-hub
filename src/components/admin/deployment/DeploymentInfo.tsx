
import { Info } from "lucide-react";

const DeploymentInfo = () => {
  return (
    <div className="text-sm text-muted-foreground bg-gray-50 p-4 rounded-md border border-gray-200">
      <div className="flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Deployment Information</h4>
          <p className="mb-3">Changes in the admin panel are automatically stored in the codebase:</p>
          <ol className="list-decimal list-inside mb-4 space-y-1.5 pl-1">
            <li>When you deploy, your changes become part of the website's source code</li>
            <li>This ensures all users see the same content without synchronization issues</li> 
            <li>Your changes will be included in all future deployments automatically</li>
          </ol>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mt-2">
            <h5 className="font-medium text-blue-800 mb-1">Vercel Setup Required</h5>
            <p className="text-blue-700">
              For the deployment feature to work, you must configure specific settings in your Vercel project:
            </p>
            <ul className="list-disc list-inside mt-1 text-blue-700 space-y-1">
              <li>Enable filesystem access for API functions (may be in different locations based on your plan)</li>
              <li>Set required environment variables including <code className="bg-blue-100 px-1.5 py-0.5 rounded">VERCEL_FILESYSTEM_API_ENABLED=true</code></li>
              <li>Create a deployment webhook</li>
            </ul>
            <p className="mt-2 text-blue-700">
              <span className="font-medium">Can't find filesystem access setting?</span> It may be:
            </p>
            <ul className="list-disc list-inside mt-1 text-blue-700 space-y-1">
              <li>Under Project Settings → Functions</li>
              <li>Under Project Settings → General → Function Settings</li>
              <li>Under Project Settings → Advanced</li>
              <li>Only available on certain pricing plans</li>
            </ul>
            <p className="mt-2 text-blue-700">
              <span className="font-medium">Alternative for Pro/Enterprise plans:</span> If you still can't find it, you can:
            </p>
            <ul className="list-disc list-inside mt-1 text-blue-700 space-y-1">
              <li>Use the Vercel CLI with <code className="bg-blue-100 px-1.5 py-0.5 rounded">--build-env VERCEL_FILESYSTEM_API_ENABLED=true</code></li>
              <li>Add a <code className="bg-blue-100 px-1.5 py-0.5 rounded">vercel.json</code> file with filesystem permissions</li>
              <li>Contact Vercel support if you're on a paid plan</li>
            </ul>
            <p className="mt-2 text-blue-700 font-medium">
              See the detailed <code className="bg-blue-100 px-1.5 py-0.5 rounded">vercel-setup.md</code> file for step-by-step instructions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentInfo;
