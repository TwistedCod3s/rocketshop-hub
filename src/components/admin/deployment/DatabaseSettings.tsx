
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Database } from "lucide-react";
import ConnectionStatusAlert from "./database/ConnectionStatusAlert";
import DatabaseInputFields from "./database/DatabaseInputFields";
import DatabaseActionButtons from "./database/DatabaseActionButtons";
import DatabaseHelpText from "./database/DatabaseHelpText";
import { useDatabaseConnection } from "./database/useDatabaseConnection";

const DatabaseSettings = () => {
  const {
    supabaseUrl,
    setSupabaseUrl,
    supabaseKey,
    setSupabaseKey,
    isTesting,
    connectionStatus,
    errorMessage,
    testConnection
  } = useDatabaseConnection();
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="h-5 w-5 mr-2" />
          Database Configuration
        </CardTitle>
        <CardDescription>
          Configure your Supabase database connection for data persistence
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <ConnectionStatusAlert 
          connectionStatus={connectionStatus} 
          errorMessage={errorMessage} 
        />
        
        <DatabaseInputFields
          supabaseUrl={supabaseUrl}
          supabaseKey={supabaseKey}
          setSupabaseUrl={setSupabaseUrl}
          setSupabaseKey={setSupabaseKey}
        />
        
        <DatabaseActionButtons
          isTesting={isTesting}
          connectionStatus={connectionStatus}
          testConnection={testConnection}
          supabaseUrl={supabaseUrl}
          supabaseKey={supabaseKey}
        />
        
        <DatabaseHelpText />
      </CardContent>
    </Card>
  );
};

export default DatabaseSettings;
