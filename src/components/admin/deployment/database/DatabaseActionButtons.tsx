
import { Button } from "@/components/ui/button";
import { CheckCircle, Link } from "lucide-react";

interface DatabaseActionButtonsProps {
  isTesting: boolean;
  connectionStatus: 'untested' | 'success' | 'error';
  testConnection: () => Promise<void>;
  supabaseUrl: string;
  supabaseKey: string;
}

const DatabaseActionButtons = ({
  isTesting,
  connectionStatus,
  testConnection,
  supabaseUrl,
  supabaseKey
}: DatabaseActionButtonsProps) => {
  return (
    <div className="flex justify-between items-center pt-2">
      <Button
        onClick={testConnection}
        disabled={isTesting || !supabaseUrl || !supabaseKey}
      >
        {isTesting ? (
          <>Connecting...</>
        ) : connectionStatus === 'success' ? (
          <>
            <CheckCircle className="mr-2 h-4 w-4" />
            Connected
          </>
        ) : (
          <>
            <Link className="mr-2 h-4 w-4" />
            Test Connection
          </>
        )}
      </Button>
      
      <Button
        variant="outline"
        onClick={() => window.open('https://app.supabase.com', '_blank')}
      >
        Go to Supabase Dashboard
      </Button>
    </div>
  );
};

export default DatabaseActionButtons;
