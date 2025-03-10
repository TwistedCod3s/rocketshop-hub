
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
      
      <Alert>
        <HelpCircle className="h-4 w-4" />
        <AlertTitle>First-time Setup</AlertTitle>
        <AlertDescription className="mt-2 text-sm text-muted-foreground">
          <p className="mb-2">
            To use the database approach, you need to:
          </p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Create a Supabase account at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">supabase.com</a></li>
            <li>Create a new project and note your API URL and anon key</li>
            <li>Create the necessary tables in your Supabase project:
              <ul className="list-disc pl-5 mt-1">
                <li><code className="bg-gray-100 px-1 py-0.5 rounded">products</code> - For storing product data</li>
                <li><code className="bg-gray-100 px-1 py-0.5 rounded">category_images</code> - For category image URLs</li>
                <li><code className="bg-gray-100 px-1 py-0.5 rounded">subcategories</code> - For subcategory lists</li>
                <li><code className="bg-gray-100 px-1 py-0.5 rounded">coupons</code> - For coupon codes</li>
              </ul>
            </li>
            <li>Set your Supabase URL and key as environment variables in your Vercel project:
              <br />
              <code className="bg-gray-100 px-1 py-0.5 rounded block mt-1 mb-1">Name: VITE_SUPABASE_URL</code>
              <code className="bg-gray-100 px-1 py-0.5 rounded block">Name: VITE_SUPABASE_ANON_KEY</code>
            </li>
          </ol>
        </AlertDescription>
      </Alert>
      
      <Alert>
        <HelpCircle className="h-4 w-4" />
        <AlertTitle>Troubleshooting</AlertTitle>
        <AlertDescription className="mt-2 text-sm text-muted-foreground">
          <p className="mb-2">If you're experiencing issues with the database approach:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Verify your Supabase URL and anon key are set correctly as environment variables</li>
            <li>Check your browser console for any errors</li>
            <li>Make sure your database tables have the correct structure</li>
            <li>Ensure you have proper permissions set in your Supabase project</li>
          </ol>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default DeploymentInfo;
