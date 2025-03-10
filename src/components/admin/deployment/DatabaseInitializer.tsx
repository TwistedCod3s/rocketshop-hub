
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Loader, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { initializeDatabaseFromLocalStorage } from "@/utils/databaseUtils";

const DatabaseInitializer = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleInitializeDatabase = async () => {
    if (isInitializing) return;

    setIsInitializing(true);
    setError(null);

    try {
      const success = await initializeDatabaseFromLocalStorage();
      
      if (success) {
        setIsInitialized(true);
        toast({
          title: "Database initialized",
          description: "Your database has been successfully populated with your store data",
        });
      } else {
        throw new Error("Failed to initialize database");
      }
    } catch (err) {
      console.error("Database initialization error:", err);
      
      // Improved error handling for specific Supabase errors
      let errorMessage = "Unknown error occurred";
      
      if (err && typeof err === 'object') {
        // Handle Supabase specific error format
        if ('code' in err && 'message' in err) {
          const supabaseError = err as { code: string; message: string; hint?: string };
          errorMessage = `Database error: ${supabaseError.message}`;
          
          if (supabaseError.code === '22P02' && supabaseError.message.includes('uuid: "placeholder"')) {
            errorMessage = "Database schema error: The tables might not be properly set up. Please ensure your Supabase tables have the correct structure.";
          } else if (supabaseError.hint) {
            errorMessage += ` (Hint: ${supabaseError.hint})`;
          }
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      toast({
        title: "Database initialization failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Initialization
        </CardTitle>
        <CardDescription>
          Transfer your current store data from localStorage to your Supabase database
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isInitialized ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-700">
              Database successfully initialized! Your data has been transferred.
            </AlertDescription>
          </Alert>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              {error.includes("schema") && (
                <div className="mt-2 text-sm">
                  Make sure your Supabase project has tables named:
                  <ul className="list-disc ml-5 mt-1">
                    <li>products (with UUID primary key)</li>
                    <li>category_images (with UUID primary key)</li>
                    <li>subcategories (with UUID primary key)</li>
                    <li>coupons (with UUID primary key)</li>
                  </ul>
                </div>
              )}
            </AlertDescription>
          </Alert>
        ) : (
          <p className="text-sm text-gray-500">
            This will copy all your current products, categories, subcategories, and coupons 
            from your browser's localStorage to your Supabase database. This operation only 
            needs to be performed once when first setting up the database approach.
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleInitializeDatabase} 
          disabled={isInitializing || isInitialized}
          className="flex items-center gap-2"
        >
          {isInitializing ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              Initializing...
            </>
          ) : (
            <>
              <Database className="h-4 w-4" />
              Initialize Database
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DatabaseInitializer;
