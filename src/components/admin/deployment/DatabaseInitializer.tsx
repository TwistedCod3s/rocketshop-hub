
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Loader, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { initializeDatabaseFromLocalStorage } from "@/utils/databaseUtils";
import { dbHelpers } from "@/lib/supabase";
import { getSupabaseClient } from "@/lib/supabase";

const DatabaseInitializer = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const { toast } = useToast();

  // Check if the database has already been initialized
  useEffect(() => {
    const checkDatabaseInitialized = async () => {
      try {
        setIsChecking(true);
        console.log("Checking if database is already initialized...");
        
        // First check if we can connect to Supabase
        const client = getSupabaseClient();
        if (!client) {
          setConnectionStatus('error');
          setError("Could not create Supabase client. Check if your environment variables are correctly set.");
          setIsChecking(false);
          return;
        }
        
        try {
          // Test a simple query to verify connection
          const { data: testData, error: testError } = await client.from('products').select('count', { count: 'exact', head: true });
          
          if (testError) {
            console.error("Database connection test failed:", testError);
            setConnectionStatus('error');
            
            if (testError.code === '42P01') {
              setError("Table 'products' does not exist. Please create the required tables in your Supabase project.");
            } else {
              setError(`Database connection error: ${testError.message}`);
            }
            
            setIsChecking(false);
            return;
          }
          
          setConnectionStatus('connected');
          console.log("Database connection successful");
        } catch (connectionErr) {
          console.error("Error testing database connection:", connectionErr);
          setConnectionStatus('error');
          setError(`Failed to connect to database: ${connectionErr instanceof Error ? connectionErr.message : String(connectionErr)}`);
          setIsChecking(false);
          return;
        }
        
        // If connection was successful, check if we have data
        try {
          // Try to fetch products from the database
          const products = await dbHelpers.getProducts();
          const categoryImages = await dbHelpers.getCategoryImages();
          const subcategories = await dbHelpers.getSubcategories();
          const coupons = await dbHelpers.getCoupons();
          
          // If we have data in any of these tables, consider the database initialized
          const hasData = products.length > 0 || 
                          Object.keys(categoryImages).length > 0 || 
                          Object.keys(subcategories).length > 0 || 
                          coupons.length > 0;
          
          console.log("Database initialization check:", {
            productsCount: products.length,
            categoryImagesCount: Object.keys(categoryImages).length,
            subcategoriesCount: Object.keys(subcategories).length,
            couponsCount: coupons.length,
            hasData
          });
          
          setIsInitialized(hasData);
          setIsChecking(false);
        } catch (err) {
          console.error("Error checking database content:", err);
          // We still consider the database reachable, just not initialized
          setIsInitialized(false);
          setIsChecking(false);
          
          if (err instanceof Error && err.message.includes("does not exist")) {
            setError("Required tables are missing in your Supabase project. Please create them before initializing.");
          }
        }
      } catch (err) {
        console.error("Error in checkDatabaseInitialized:", err);
        setIsChecking(false);
        setConnectionStatus('error');
        setError("Could not connect to database to check initialization status");
      }
    };
    
    checkDatabaseInitialized();
  }, []);

  const handleInitializeDatabase = async () => {
    if (isInitializing) return;

    setIsInitializing(true);
    setError(null);

    try {
      // Make sure we have some data to initialize with
      const productsStr = localStorage.getItem('ROCKETRY_SHOP_PRODUCTS_V7');
      if (!productsStr) {
        throw new Error("No products found in localStorage to initialize database with");
      }

      console.log("Starting database initialization from localStorage...");
      const success = await initializeDatabaseFromLocalStorage();
      
      if (success) {
        setIsInitialized(true);
        toast({
          title: "Database initialized",
          description: "Your database has been successfully populated with your store data",
        });
        // Clear pending changes flag since we've just initialized
        localStorage.setItem('ROCKETRY_SHOP_CHANGES_PENDING', 'false');
        // Set last deployment time
        localStorage.setItem('LAST_DEPLOYMENT_TIME', new Date().toISOString());
      } else {
        throw new Error("Failed to initialize database");
      }
    } catch (err) {
      console.error("Database initialization error:", err);
      
      let errorMessage = "Unknown error occurred";
      
      if (err && typeof err === 'object') {
        if ('code' in err && 'message' in err) {
          const dbError = err as { code: string; message: string; hint?: string };
          
          if (dbError.code === '42P01') {
            errorMessage = "Required tables are missing. Please create all necessary tables in your Supabase project.";
          } else if (dbError.code === '42703') {
            errorMessage = "Required columns are missing. Please check your table structure.";
          } else if (dbError.code === 'PGRST204') {
            errorMessage = "Table schema mismatch: Some columns don't exist in your Supabase tables. Please update your database schema.";
          } else if (dbError.code === '23502') {
            errorMessage = "Required fields are missing. Please check your data format.";
          } else {
            errorMessage = `Database error (${dbError.code}): ${dbError.message}`;
            if (dbError.hint) {
              errorMessage += ` (Hint: ${dbError.hint})`;
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

  const handleCheckAgain = async () => {
    setIsChecking(true);
    setError(null);
    setConnectionStatus('checking');
    
    try {
      // First confirm database connection
      const client = getSupabaseClient();
      if (!client) {
        setConnectionStatus('error');
        setError("Could not create Supabase client. Check your environment variables.");
        setIsChecking(false);
        return;
      }
      
      // Test connection
      const { error: testError } = await client.from('products').select('count', { count: 'exact', head: true });
      if (testError) {
        setConnectionStatus('error');
        setError(`Database connection error: ${testError.message}`);
        setIsChecking(false);
        return;
      }
      
      setConnectionStatus('connected');
      
      // Check if database has data
      const products = await dbHelpers.getProducts();
      const hasData = products.length > 0;
      
      console.log("Re-checked database, found", products.length, "products");
      setIsInitialized(hasData);
      
      if (hasData) {
        toast({
          title: "Database check complete",
          description: `Database is initialized with ${products.length} products`,
        });
      } else {
        toast({
          title: "Database is empty",
          description: "No products found in the database",
        });
      }
    } catch (err) {
      console.error("Error checking database:", err);
      setError("Could not connect to database to check status");
      toast({
        title: "Database check failed",
        description: "Could not connect to database",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
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
        {isChecking ? (
          <div className="flex justify-center items-center p-8">
            <Loader className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-3">Checking database status...</span>
          </div>
        ) : connectionStatus === 'error' ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Database Connection Error</AlertTitle>
            <AlertDescription>
              {error || "Could not connect to Supabase database"}
              <div className="mt-2 text-sm">
                <p>Please check your Supabase environment variables:</p>
                <ul className="list-disc ml-5 mt-1">
                  <li>VITE_SUPABASE_URL: Should be your Supabase project URL (e.g., https://yourproject.supabase.co)</li>
                  <li>VITE_SUPABASE_ANON_KEY: Should be your Supabase anon/public key</li>
                </ul>
                <p className="mt-2">You can find these values in your Supabase project settings under API.</p>
              </div>
            </AlertDescription>
          </Alert>
        ) : isInitialized ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-700">
              Database is already initialized! Your data has been transferred.
            </AlertDescription>
          </Alert>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Database Initialization Failed</AlertTitle>
            <AlertDescription>
              {error}
              <div className="mt-2 text-sm">
                <p>Please ensure your Supabase project has the following tables properly set up:</p>
                <ul className="list-disc ml-5 mt-1">
                  <li>products (with id, name, description, price, category, images, inStock, featured, rating, specifications, reviews columns)</li>
                  <li>category_images (with id, category_slug, image_url columns)</li>
                  <li>subcategories (with id, category, subcategory_list columns)</li>
                  <li>coupons (with id, code, discount, discountPercentage, expiryDate, active, description columns)</li>
                </ul>
                <p className="mt-2">Each table must have an ID column of type UUID that is the primary key.</p>
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
                  <li>products (with id, name, description, price, category, images, inStock, featured, rating, specifications, reviews columns)</li>
                  <li>category_images (with id, category_slug, image_url columns)</li>
                  <li>subcategories (with id, category, subcategory_list columns)</li>
                  <li>coupons (with id, code, discount, discountPercentage, expiryDate, active, description columns)</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        {isInitialized ? (
          <Button 
            variant="outline"
            onClick={handleCheckAgain}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Check Again
          </Button>
        ) : connectionStatus === 'connected' ? (
          <Button 
            onClick={handleInitializeDatabase} 
            disabled={isInitializing || isChecking}
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
        ) : (
          <Button 
            variant="outline"
            onClick={handleCheckAgain}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry Connection
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DatabaseInitializer;
