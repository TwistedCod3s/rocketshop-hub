
import { Info, Cloud, FileJson } from "lucide-react";

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
            <div className="flex items-center gap-2">
              <Cloud className="h-4 w-4 text-blue-700" />
              <h5 className="font-medium text-blue-800">Vercel Setup</h5>
            </div>
            
            <div className="mt-3 mb-4">
              <div className="flex items-center gap-2">
                <FileJson className="h-4 w-4 text-blue-700" />
                <h6 className="font-medium text-blue-800">Recommended: Use vercel.json</h6>
              </div>
              <p className="text-blue-700 mt-1">
                The easiest way to enable filesystem access is by adding a <code className="bg-blue-100 px-1.5 py-0.5 rounded">vercel.json</code> file:
              </p>
              <pre className="bg-blue-100 p-2 rounded mt-2 text-xs overflow-x-auto">
{`{
  "functions": {
    "api/*.js": {
      "includeFiles": "**/*"
    }
  },
  "build": {
    "env": {
      "VERCEL_FILESYSTEM_API_ENABLED": "true"
    }
  }
}`}
              </pre>
              <p className="text-blue-700 mt-2">
                Add this file to your project root and redeploy. This approach works for all Vercel plans.
              </p>
            </div>
            
            <div className="border-t border-blue-200 pt-3 mt-3">
              <h6 className="font-medium text-blue-800 mb-2">Other Requirements:</h6>
              <ul className="list-disc list-inside text-blue-700 space-y-1.5">
                <li>Create a deployment webhook in Vercel (Project Settings → Git Integration → Deploy Hooks)</li>
                <li>Add the webhook URL to the Deployment Settings in your admin panel</li>
              </ul>
            </div>
            
            <div className="border-t border-blue-200 pt-3 mt-3">
              <h6 className="font-medium text-blue-800 mb-2">Alternative Approaches:</h6>
              <ul className="list-disc list-inside text-blue-700 space-y-1.5">
                <li><span className="font-medium">Use Vercel CLI:</span> Deploy with <code className="bg-blue-100 px-1.5 py-0.5 rounded">vercel deploy --build-env VERCEL_FILESYSTEM_API_ENABLED=true</code></li>
                <li><span className="font-medium">Use a database:</span> Store content in Vercel KV, Postgres, or similar database service</li>
                <li><span className="font-medium">GitHub integration:</span> Use GitHub's API to commit changes through a serverless function</li>
              </ul>
            </div>
            
            <p className="mt-3 pt-3 border-t border-blue-200 text-blue-700 font-medium">
              See the detailed <code className="bg-blue-100 px-1.5 py-0.5 rounded">vercel-setup.md</code> file for full instructions on all approaches.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentInfo;
