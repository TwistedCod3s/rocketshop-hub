
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Loader, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
          
          // Specific handling for UUID errors
          if (supabaseError.code === '22P02' && supabaseError.message.includes('uuid')) {
            errorMessage = "Database schema error: UUID format issue. Please ensure your Supabase tables have primary key columns with UUID data type.";
          } 
          // Handle foreign key violations
          else if (supabaseError.code === '23503') {
            errorMessage = "Database constraint error: Foreign key violation. Check that your table relationships are correctly set up.";
          }
          // Handle unique constraint violations
          else if (supabaseError.code === '23505') {
            errorMessage = "Database constraint error: Unique violation. Duplicate entries detected.";
          }
          // Default error message
          else {
            errorMessage = `Database error (${supabaseError.code}): ${supabaseError.message}`;
            if (supabaseError.hint) {
              errorMessage += ` (Hint: ${supabaseError.hint})`;
            }
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
            <AlertTitle>Database Initialization Failed</AlertTitle>
            <AlertDescription>
              {error}
              <div className="mt-2 text-sm">
                Please ensure your Supabase project has the following tables properly set up:
                <ul className="list-disc ml-5 mt-1">
                  <li>products (with id column as UUID primary key)</li>
                  <li>category_images (with id column as UUID primary key)</li>
                  <li>subcategories (with id column as UUID primary key)</li>
                  <li>coupons (with id column as UUID primary key)</li>
                </ul>
                <p className="mt-2">Each table must have an ID column of type UUID that is the primary key and set to auto-generate.</p>
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              This will copy all your current products, categories, subcategories, and coupons 
              from your browser's localStorage to your Supabase database. This operation only 
              needs to be performed once when first setting up the database approach.
            </p>
            
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-blue-700">
                <strong>Before initializing:</strong> Make sure you've created the required tables in your Supabase project:
                <ul className="list-disc ml-5 mt-1">
                  <li>products (with id column as UUID primary key)</li>
                  <li>category_images (with id column as UUID primary key)</li>
                  <li>subcategories (with id column as UUID primary key)</li>
                  <li>coupons (with id column as UUID primary key)</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
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
