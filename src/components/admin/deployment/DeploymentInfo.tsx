
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
            
            <div className="mt-4 border-t border-blue-200 pt-3">
              <h5 className="font-medium text-blue-800 mb-1">Can't Find Filesystem Access?</h5>
              <p className="text-blue-700">If you can't locate the filesystem setting, here are alternative approaches:</p>
              
              <h6 className="font-medium text-blue-700 mt-3">Option 1: Use vercel.json Configuration</h6>
              <p className="text-blue-700 mt-1">Add a <code className="bg-blue-100 px-1.5 py-0.5 rounded">vercel.json</code> file to your project root with:</p>
              <pre className="bg-blue-100 p-2 rounded mt-1 text-xs overflow-x-auto">
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
              
              <h6 className="font-medium text-blue-700 mt-3">Option 2: Use Vercel CLI for Deployment</h6>
              <p className="text-blue-700 mt-1">Deploy using the Vercel CLI with the filesystem flag:</p>
              <pre className="bg-blue-100 p-2 rounded mt-1 text-xs overflow-x-auto">
{`# Install Vercel CLI first
npm i -g vercel

# Deploy with filesystem enabled
vercel deploy --build-env VERCEL_FILESYSTEM_API_ENABLED=true`}
              </pre>
              
              <h6 className="font-medium text-blue-700 mt-3">Option 3: Use Serverless Function with DB</h6>
              <p className="text-blue-700 mt-1">Instead of filesystem access, store data in a database:</p>
              <ul className="list-disc list-inside mt-1 text-blue-700 space-y-1">
                <li>Use Vercel KV, Vercel Postgres, or other database services</li>
                <li>Modify the admin panel to use database storage instead of filesystem</li>
                <li>This approach may require more extensive code changes</li>
              </ul>
              
              <h6 className="font-medium text-blue-700 mt-3">Option 4: GitHub Integration</h6>
              <p className="text-blue-700 mt-1">Use GitHub's API to commit changes to your repository:</p>
              <ul className="list-disc list-inside mt-1 text-blue-700 space-y-1">
                <li>Create a GitHub token with repo access</li>
                <li>Set up a serverless function to commit changes via GitHub API</li>
                <li>Configure Vercel to auto-deploy on GitHub commits</li>
              </ul>
            </div>
            
            <p className="mt-3 pt-3 border-t border-blue-200 text-blue-700 font-medium">
              See the detailed <code className="bg-blue-100 px-1.5 py-0.5 rounded">vercel-setup.md</code> file for step-by-step instructions on all approaches.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentInfo;
