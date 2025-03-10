
import { UploadCloud, Save, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeploymentActionsProps {
  isSyncing: boolean;
  isDeploying: boolean;
  hasPendingChanges: boolean;
  deployUrl: string;
  onSync: () => void;
  onDeploy: () => void;
}

const DeploymentActions = ({
  isSyncing,
  isDeploying,
  hasPendingChanges,
  deployUrl,
  onSync,
  onDeploy,
}: DeploymentActionsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Button 
        onClick={onSync} 
        disabled={isSyncing}
        variant="outline"
      >
        {isSyncing ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Syncing Data...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Sync Data Only
          </>
        )}
      </Button>
      
      <Button 
        onClick={onDeploy} 
        disabled={isDeploying || isSyncing || !deployUrl}
        variant={hasPendingChanges ? "default" : "outline"}
        className={hasPendingChanges ? "bg-amber-600 hover:bg-amber-700" : ""}
      >
        {isDeploying ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Deploying...
          </>
        ) : (
          <>
            <UploadCloud className="mr-2 h-4 w-4" />
            {hasPendingChanges ? "Deploy Pending Changes" : "Deploy Now"}
          </>
        )}
      </Button>
    </div>
  );
};

export default DeploymentActions;
