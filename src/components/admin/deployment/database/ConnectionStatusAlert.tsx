
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ConnectionStatusAlertProps {
  connectionStatus: 'untested' | 'success' | 'error';
  errorMessage: string | null;
}

const ConnectionStatusAlert = ({ connectionStatus, errorMessage }: ConnectionStatusAlertProps) => {
  if (connectionStatus === 'untested') {
    return null;
  }
  
  if (connectionStatus === 'success') {
    return (
      <Alert className="bg-green-50 border-green-200 text-green-800">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <AlertTitle>Connected</AlertTitle>
        <AlertDescription>
          Successfully connected to your Supabase database
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Connection Failed</AlertTitle>
      <AlertDescription>
        {errorMessage || "Failed to connect to database with the provided credentials"}
      </AlertDescription>
    </Alert>
  );
};

export default ConnectionStatusAlert;
